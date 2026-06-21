// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ReceiptService {
  async generateReceiptHtml(payment: any, affiliate: any): Promise<string> {
    const date = payment.paidAt ? new Date(payment.paidAt).toLocaleDateString('es-EC') : new Date().toLocaleDateString('es-EC');
    return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; color: #1a1a2e; }
    .header { text-align: center; border-bottom: 3px solid #1a3c6e; padding-bottom: 20px; margin-bottom: 30px; }
    .header h1 { color: #1a3c6e; margin: 0; font-size: 22px; }
    .header p { margin: 4px 0; font-size: 13px; color: #555; }
    .badge { background: #1a3c6e; color: white; padding: 6px 18px; border-radius: 20px; font-size: 13px; font-weight: bold; display: inline-block; margin-top: 8px; }
    .section { margin-bottom: 24px; }
    .section h3 { color: #1a3c6e; font-size: 14px; border-bottom: 1px solid #ddd; padding-bottom: 6px; margin-bottom: 12px; }
    .row { display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 13px; }
    .label { color: #666; }
    .value { font-weight: 600; }
    .amount-box { background: #f0f7ff; border: 2px solid #1a3c6e; border-radius: 8px; padding: 16px; text-align: center; margin: 20px 0; }
    .amount-box .amount { font-size: 32px; font-weight: bold; color: #1a3c6e; }
    .amount-box .label { font-size: 13px; color: #555; }
    .status-paid { background: #d4edda; color: #155724; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold; }
    .footer { text-align: center; font-size: 11px; color: #888; border-top: 1px solid #ddd; padding-top: 16px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>CÁMARA DE COMERCIO</h1>
    <p>Plataforma de Gestión de Afiliados</p>
    <div class="badge">RECIBO DE PAGO</div>
  </div>

  <div class="section">
    <h3>INFORMACIÓN DEL RECIBO</h3>
    <div class="row"><span class="label">N° Recibo:</span><span class="value">${payment.receiptNumber}</span></div>
    <div class="row"><span class="label">Fecha de Pago:</span><span class="value">${date}</span></div>
    <div class="row"><span class="label">Período:</span><span class="value">${payment.period}</span></div>
    <div class="row"><span class="label">Estado:</span><span><span class="status-paid">PAGADO</span></span></div>
  </div>

  <div class="section">
    <h3>DATOS DEL AFILIADO</h3>
    <div class="row"><span class="label">Empresa:</span><span class="value">${affiliate.businessName}</span></div>
    <div class="row"><span class="label">RUC:</span><span class="value">${affiliate.ruc}</span></div>
    <div class="row"><span class="label">Correo:</span><span class="value">${affiliate.email}</span></div>
  </div>

  <div class="amount-box">
    <div class="label">MONTO PAGADO</div>
    <div class="amount">${payment.currency || 'USD'} ${Number(payment.amount).toFixed(2)}</div>
    ${payment.method ? `<div class="label" style="margin-top:8px">Método: ${payment.method}</div>` : ''}
    ${payment.reference ? `<div class="label">Referencia: ${payment.reference}</div>` : ''}
  </div>

  <div class="footer">
    <p>Este recibo es un comprobante digital generado automáticamente por el sistema.</p>
    <p>Cámara de Comercio — Plataforma UCEZ</p>
  </div>
</body>
</html>`;
  }

  async saveReceipt(html: string, receiptNumber: string): Promise<string> {
    const dir = path.join(process.cwd(), 'uploads', 'receipts');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const filename = `recibo-${receiptNumber}.html`;
    const filepath = path.join(dir, filename);
    fs.writeFileSync(filepath, html, 'utf8');

    return `/uploads/receipts/${filename}`;
  }
}
