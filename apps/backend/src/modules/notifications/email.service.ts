// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: config.get('SMTP_HOST'),
      port: config.get<number>('SMTP_PORT', 587),
      secure: false,
      auth: {
        user: config.get('SMTP_USER'),
        pass: config.get('SMTP_PASS'),
      },
    });
  }

  async sendPaymentConfirmationEmail(to: string, data: { businessName: string; receiptNumber: string; amount: number; currency: string; period: string; paidAt: Date; receiptUrl?: string }) {
    const subject = `Confirmación de Pago - ${data.receiptNumber}`;
    const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e">
      <div style="background:#1a3c6e;padding:24px;text-align:center">
        <h1 style="color:white;margin:0;font-size:20px">CÁMARA DE COMERCIO</h1>
        <p style="color:#a8c4e8;margin:4px 0;font-size:13px">Confirmación de Pago</p>
      </div>
      <div style="padding:30px;background:#fff;border:1px solid #e0e0e0">
        <p>Estimados <strong>${data.businessName}</strong>,</p>
        <p>Hemos registrado correctamente su pago. A continuación los detalles:</p>
        <table style="width:100%;border-collapse:collapse;margin:20px 0">
          <tr style="background:#f5f5f5"><td style="padding:10px;font-size:13px;color:#666">N° Recibo</td><td style="padding:10px;font-weight:bold">${data.receiptNumber}</td></tr>
          <tr><td style="padding:10px;font-size:13px;color:#666">Período</td><td style="padding:10px">${data.period}</td></tr>
          <tr style="background:#f5f5f5"><td style="padding:10px;font-size:13px;color:#666">Monto</td><td style="padding:10px;font-weight:bold;color:#1a3c6e">${data.currency} ${Number(data.amount).toFixed(2)}</td></tr>
          <tr><td style="padding:10px;font-size:13px;color:#666">Fecha de Pago</td><td style="padding:10px">${new Date(data.paidAt).toLocaleDateString('es-EC')}</td></tr>
        </table>
        ${data.receiptUrl ? `<p style="text-align:center"><a href="${data.receiptUrl}" style="background:#1a3c6e;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;font-size:14px">Descargar Recibo</a></p>` : ''}
        <p style="font-size:13px;color:#888">Si tiene alguna duda, comuníquese con la Cámara de Comercio.</p>
      </div>
      <div style="text-align:center;padding:16px;font-size:11px;color:#888">Plataforma UCEZ — Cámara de Comercio</div>
    </div>`;

    await this.send(to, subject, html);
  }

  async sendPaymentReminderEmail(to: string, data: { businessName: string; amount: number; currency: string; period: string; dueDate: Date }) {
    const subject = `Recordatorio de Pago Pendiente - ${data.period}`;
    const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e">
      <div style="background:#c8932a;padding:24px;text-align:center">
        <h1 style="color:white;margin:0;font-size:20px">RECORDATORIO DE PAGO</h1>
      </div>
      <div style="padding:30px;background:#fff;border:1px solid #e0e0e0">
        <p>Estimados <strong>${data.businessName}</strong>,</p>
        <p>Le recordamos que tiene un pago pendiente con vencimiento próximo:</p>
        <div style="background:#fff8e1;border-left:4px solid #c8932a;padding:16px;margin:20px 0">
          <p style="margin:4px 0"><strong>Período:</strong> ${data.period}</p>
          <p style="margin:4px 0"><strong>Monto:</strong> ${data.currency} ${Number(data.amount).toFixed(2)}</p>
          <p style="margin:4px 0"><strong>Vence:</strong> ${new Date(data.dueDate).toLocaleDateString('es-EC')}</p>
        </div>
        <p style="font-size:13px;color:#888">Para realizar su pago o consultar el estado de su cuenta, ingrese a la plataforma.</p>
      </div>
    </div>`;

    await this.send(to, subject, html);
  }

  private async send(to: string, subject: string, html: string) {
    try {
      await this.transporter.sendMail({ from: this.config.get('EMAIL_FROM'), to, subject, html });
      this.logger.log(`Email enviado a ${to}: ${subject}`);
    } catch (error) {
      this.logger.error(`Error enviando email a ${to}: ${error.message}`);
    }
  }
}
