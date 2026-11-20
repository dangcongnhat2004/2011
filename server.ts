import express from 'express';
import fs from 'fs';
import path from 'path';
import type { SavedTeacherOrder } from './src/types/order.ts';

const PORT = 3000;
const DATA_DIR = path.resolve(process.cwd(), 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

interface OrdersDatabase {
  orders: SavedTeacherOrder[];
  updatedAt: string;
}

function ensureOrdersFile(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(ORDERS_FILE)) {
    const initial: OrdersDatabase = {
      orders: [],
      updatedAt: new Date().toISOString(),
    };
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(initial, null, 2), 'utf-8');
  }
}

function readOrdersDb(): OrdersDatabase {
  ensureOrdersFile();
  try {
    const raw = fs.readFileSync(ORDERS_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<OrdersDatabase>;
    return {
      orders: Array.isArray(parsed.orders) ? parsed.orders : [],
      updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : new Date().toISOString(),
    };
  } catch {
    return { orders: [], updatedAt: new Date().toISOString() };
  }
}

function writeOrdersDb(orders: SavedTeacherOrder[]): OrdersDatabase {
  ensureOrdersFile();
  const payload: OrdersDatabase = {
    orders,
    updatedAt: new Date().toISOString(),
  };
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(payload, null, 2), 'utf-8');
  return payload;
}

function formatOrderExportText(orders: SavedTeacherOrder[]): string {
  const lines: string[] = [
    'DANH SÁCH ĐẶT MÓN TRI ÂN 20/11 — TẬP THỂ GIÁO VIÊN NIX',
    `Xuất lúc: ${new Date().toLocaleString('vi-VN')}`,
    '============================================================',
    '',
  ];

  const grouped = new Map<string, { label: string; qty: number; unitPrice: number; teachers: string[] }>();

  let grandTotal = 0;
  let grandCups = 0;

  for (const order of orders) {
    grandTotal += order.totalAmount;
    grandCups += order.totalCups;
    for (const item of order.items) {
      const topKey = item.toppings.map((t) => t.name).sort().join(', ');
      const sizeStr = item.size === 'DEFAULT' ? 'Chuẩn' : item.size === 'HOT' ? 'Nóng' : `Size ${item.size}`;
      const options = [
        sizeStr,
        item.sweetness,
        item.ice,
        topKey ? `Topping: ${topKey}` : '',
        item.note ? `Ghi chú: ${item.note}` : '',
      ]
        .filter(Boolean)
        .join(' · ');
      const key = `${item.name}||${options}`;
      const unitPrice = item.quantity > 0 ? item.lineTotal / item.quantity : item.lineTotal;
      const existing = grouped.get(key);
      if (existing) {
        existing.qty += item.quantity;
        existing.teachers.push(`${order.teacherName} (${item.quantity})`);
      } else {
        grouped.set(key, {
          label: `${item.name} [${options}]`,
          qty: item.quantity,
          unitPrice,
          teachers: [`${order.teacherName} (${item.quantity})`],
        });
      }
    }
  }

  lines.push('1. TỔNG HỢP THEO MÓN ĐỂ ĐI MUA:');
  if (grouped.size === 0) {
    lines.push('  (Chưa có món nào được đặt)');
  } else {
    let idx = 1;
    for (const entry of grouped.values()) {
      const subtotal = Math.round(entry.qty * entry.unitPrice * 1000).toLocaleString('vi-VN');
      lines.push(`  ${idx}. ${entry.qty}x ${entry.label} — ${subtotal}đ`);
      lines.push(`     Người chọn: ${entry.teachers.join(', ')}`);
      idx += 1;
    }
  }

  lines.push('');
  lines.push(`TỔNG SỐ LƯỢNG: ${grandCups} món`);
  lines.push(`TỔNG CỘNG: ${(grandTotal * 1000).toLocaleString('vi-VN')}đ (Đã bao gồm VAT)`);
  lines.push('');
  lines.push('2. CHI TIẾT THEO TỪNG GIÁO VIÊN:');
  for (const order of orders) {
    const status = order.purchased ? '[ĐÃ MUA]' : '[CHƯA MUA]';
    lines.push(`- ${order.teacherName} ${status} — ${(order.totalAmount * 1000).toLocaleString('vi-VN')}đ`);
    if (order.wishNote) {
      lines.push(`  Lời nhắn: "${order.wishNote}"`);
    }
    for (const item of order.items) {
      const sizeStr = item.size === 'DEFAULT' ? '' : ` (${item.size === 'HOT' ? 'Nóng' : `Size ${item.size}`})`;
      const top = item.toppings.length ? ` + ${item.toppings.map((t) => t.name).join(', ')}` : '';
      const opts = [item.sweetness, item.ice].filter(Boolean).join(', ');
      lines.push(
        `  • ${item.quantity}x ${item.name}${sizeStr}${top}${opts ? ` [${opts}]` : ''} — ${(item.lineTotal * 1000).toLocaleString('vi-VN')}đ`
      );
    }
  }

  return lines.join('\n');
}

async function startServer() {
  ensureOrdersFile();
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/orders', (_req, res) => {
    const db = readOrdersDb();
    res.json({
      orders: db.orders,
      updatedAt: db.updatedAt,
      filePath: 'data/orders.json',
    });
  });

  app.post('/api/orders', (req, res) => {
    const body = req.body as Partial<SavedTeacherOrder>;
    const teacherName = typeof body.teacherName === 'string' ? body.teacherName.trim() : '';
    const wishNote = typeof body.wishNote === 'string' ? body.wishNote.trim() : '';
    const items = Array.isArray(body.items) ? body.items : [];

    if (!teacherName) {
      res.status(400).json({ error: 'Vui lòng nhập tên giáo viên trước khi lưu đơn.' });
      return;
    }
    if (items.length === 0) {
      res.status(400).json({ error: 'Giỏ hàng đang trống, vui lòng chọn ít nhất 1 món.' });
      return;
    }

    const totalAmount = items.reduce((sum, item) => sum + (Number(item.lineTotal) || 0), 0);
    const totalCups = items.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);

    const newOrder: SavedTeacherOrder = {
      id: `nix-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      teacherName,
      wishNote: wishNote || undefined,
      items,
      totalAmount,
      totalCups,
      purchased: false,
      createdAt: new Date().toISOString(),
    };

    const db = readOrdersDb();
    const updated = writeOrdersDb([newOrder, ...db.orders]);

    res.status(201).json({
      order: newOrder,
      orders: updated.orders,
      updatedAt: updated.updatedAt,
    });
  });

  app.patch('/api/orders/:id', (req, res) => {
    const { id } = req.params;
    const { purchased } = req.body as { purchased?: boolean };
    const db = readOrdersDb();
    const exists = db.orders.some((o) => o.id === id);
    if (!exists) {
      res.status(404).json({ error: 'Không tìm thấy đơn hàng.' });
      return;
    }
    const nextOrders = db.orders.map((o) =>
      o.id === id ? { ...o, purchased: typeof purchased === 'boolean' ? purchased : !o.purchased } : o
    );
    const updated = writeOrdersDb(nextOrders);
    res.json({ orders: updated.orders, updatedAt: updated.updatedAt });
  });

  app.delete('/api/orders/:id', (req, res) => {
    const { id } = req.params;
    const db = readOrdersDb();
    const nextOrders = db.orders.filter((o) => o.id !== id);
    const updated = writeOrdersDb(nextOrders);
    res.json({ orders: updated.orders, updatedAt: updated.updatedAt });
  });

  app.get('/api/orders/export', (req, res) => {
    const format = req.query.format === 'txt' ? 'txt' : 'json';
    const db = readOrdersDb();

    if (format === 'txt') {
      const content = formatOrderExportText(db.orders);
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="nix-20-11-orders.txt"');
      res.send(content);
      return;
    }

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="nix-20-11-orders.json"');
    res.send(JSON.stringify(db, null, 2));
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Nix 20/11 server running at http://localhost:${PORT}`);
  });
}

startServer();
