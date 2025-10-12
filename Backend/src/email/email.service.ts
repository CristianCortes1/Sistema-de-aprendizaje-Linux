import { Injectable, OnModuleInit } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import sgMail from '@sendgrid/mail';

@Injectable()
export class EmailService implements OnModuleInit {
    private transporter!: nodemailer.Transporter;
    private ready = false;
  private useSendgrid = false;

    async onModuleInit() {
        await this.init();
    }

  private async init() {
        try {
      const useProd = process.env.NODE_ENV === 'production';
      // Preferir SendGrid API en producción si existe API key (evita timeouts SMTP)
      if (useProd && process.env.SENDGRID_API_KEY) {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        this.useSendgrid = true;
        this.ready = true;
        console.log('✅ Email: SendGrid API listo');
        return;
      }

      // SMTP sólo si no hay API key (útil para desarrollo local)
      if (!useProd) {
        // 🧪 Desarrollo → Ethereal
        try {
          const testAccount = await nodemailer.createTestAccount();
          this.transporter = nodemailer.createTransport({
            host: testAccount.smtp.host,
            port: testAccount.smtp.port,
            secure: testAccount.smtp.secure,
            auth: { user: testAccount.user, pass: testAccount.pass },
          });
          await this.transporter.verify();
          this.ready = true;
          console.log('✅ Ethereal account:', testAccount.user);
          return;
        } catch (e: any) {
          console.warn('⚠️ Ethereal no disponible, usando stream transport:', e.message);
          this.transporter = nodemailer.createTransport({
            streamTransport: true,
            newline: 'unix',
            buffer: true,
          });
          this.ready = true;
          console.log('✅ Email: stream transport listo (dev)');
          return;
        }
      }

      // Si estamos en producción sin API key (no recomendado), intentamos SMTP como último recurso
      if (useProd) {
        this.transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || 'smtp.sendgrid.net',
          port: Number(process.env.SMTP_PORT ?? 587),
          secure: process.env.SMTP_SECURE === 'true' || Number(process.env.SMTP_PORT) === 465,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
          // Timeouts más holgados
          connectionTimeout: 20000,
          greetingTimeout: 15000,
          socketTimeout: 30000,
        });
        await this.transporter.verify();
        this.ready = true;
        console.log('✅ Email: SMTP verificado');
      }
        } catch (err: any) {
            console.error('❌ Error inicializando email transporter:', err?.message);
        }
    }

    private ensureReady() {
        if (!this.ready) throw new Error('Email transporter not initialized yet');
    }

    async sendConfirmationEmail(email: string, confirmationToken: string, username: string) {
        this.ensureReady();

        const confirmationUrl = `${process.env.FRONTEND_URL}/confirm-email?token=${confirmationToken}`;
        const from =
            process.env.EMAIL_FROM ||
            '"Penguin Path 🐧" <noreply@penguinpath.app>';

        const html = `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <div style="background: linear-gradient(135deg, #ef9c6c 0%, #c57da1 50%, #956eaa 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">🐧 Penguin Path</h1>
            <p style="color: white; margin: 10px 0 0 0;">Sistema de Aprendizaje Linux</p>
          </div>
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-top: 0;">¡Hola ${username}!</h2>
            <p style="color: #666; line-height: 1.6;">
              Gracias por registrarte en Penguin Path. Para comenzar tu aventura, confirma tu correo.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${confirmationUrl}"
                 style="background: linear-gradient(135deg, #ef9c6c 0%, #c57da1 50%, #956eaa 100%);
                        color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                Confirmar mi cuenta
              </a>
            </div>
            <p style="color: #999; font-size: 14px; margin-top: 30px;">
              Si no puedes hacer clic, copia este enlace: <a href="${confirmationUrl}">${confirmationUrl}</a>
            </p>
          </div>
          <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 14px;">
            <p style="margin: 0;">© 2025 Penguin Path - Aprende Linux paso a paso</p>
          </div>
        </div>
      `;

        if (this.useSendgrid) {
            const res = await sgMail.send({ to: email, from, subject: 'Confirma tu cuenta - Penguin Path', html });
            return res;
        }

        const result = await this.transporter.sendMail({ from, to: email, subject: 'Confirma tu cuenta - Penguin Path', html });
        const preview = nodemailer.getTestMessageUrl(result);
        if (preview) console.log(`🔍 Preview email: ${preview}`);
        return result;
    }
}
