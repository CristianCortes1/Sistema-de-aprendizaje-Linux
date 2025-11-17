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

      // Opción 1: SendGrid API (si existe API key)
      if (useProd && process.env.SENDGRID_API_KEY) {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        this.useSendgrid = true;
        this.ready = true;
        console.log('✅ Email: SendGrid API listo');
        return;
      }

      // Opción 2: AWS SES SMTP (si existe configuración)
      if (
        useProd &&
        process.env.AWS_SES_SMTP_USER &&
        process.env.AWS_SES_SMTP_PASSWORD
      ) {
        this.transporter = nodemailer.createTransport({
          host:
            process.env.AWS_SES_SMTP_HOST ||
            'email-smtp.us-east-2.amazonaws.com',
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
            user: process.env.AWS_SES_SMTP_USER,
            pass: process.env.AWS_SES_SMTP_PASSWORD,
          },
        });
        await this.transporter.verify();
        this.ready = true;
        console.log('✅ Email: AWS SES SMTP listo');
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
          console.warn(
            '⚠️ Ethereal no disponible, usando stream transport:',
            e.message,
          );
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

      // Configuración SMTP (Gmail o similar) - se ejecuta si no hay SendGrid o en desarrollo
      if (useProd || process.env.SMTP_HOST) {
        console.log('🔧 Configurando SMTP con:', process.env.SMTP_HOST);
        
        this.transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || 'smtp.gmail.com',
          port: Number(process.env.SMTP_PORT ?? 587),
          secure: process.env.SMTP_SECURE === 'true' || Number(process.env.SMTP_PORT) === 465,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD || process.env.SMTP_PASS, // Soportar ambos nombres
          },
          // Configuración optimizada para Gmail
          connectionTimeout: 30000,
          greetingTimeout: 20000,
          socketTimeout: 45000,
          // Configuración adicional para Gmail
          tls: {
            rejectUnauthorized: false
          }
        });
        
        try {
          await this.transporter.verify();
          this.ready = true;
          console.log('✅ SMTP configurado correctamente con:', process.env.SMTP_HOST);
        } catch (error) {
          console.error('❌ Error verificando SMTP:', error.message);
          this.ready = false;
        }
      }
    } catch (err: any) {
      console.error('❌ Error inicializando email transporter:', err?.message);
    }
  }

  private ensureReady() {
    if (!this.ready) throw new Error('Email transporter not initialized yet');
  }

  async sendConfirmationEmail(
    email: string,
    confirmationToken: string,
    username: string,
  ) {
    this.ensureReady();

    const confirmUrl = `${process.env.FRONTEND_URL}/confirm-email?token=${confirmationToken}`;
    const from =
      process.env.EMAIL_FROM ||
      '"Penguin Path" <noreply@penguinpath.duckdns.org>';

    const html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirma tu cuenta - Penguin Path</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/3/35/Tux.svg" alt="Penguin Path" width="50" style="margin-bottom: 10px;">
                            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 300;">Penguin Path</h1>
                            <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0; font-size: 14px;">Plataforma Educativa de Linux</p>
                        </td>
                    </tr>
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="color: #333; margin: 0 0 20px 0; font-size: 24px; font-weight: 400;">¡Bienvenido/a, ${username}!</h2>
                            <p style="color: #666; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
                                Gracias por unirte a Penguin Path, la plataforma educativa para aprender Linux de forma interactiva y práctica.
                            </p>
                            <p style="color: #666; line-height: 1.6; margin: 0 0 30px 0; font-size: 16px;">
                                Para completar tu registro y comenzar tu aventura de aprendizaje, por favor confirma tu dirección de correo electrónico:
                            </p>
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="padding: 20px 0;">
                                        <a href="${confirmUrl}" style="background: #667eea; color: white; padding: 15px 40px; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 16px; display: inline-block;">
                                            Confirmar mi cuenta
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            <p style="color: #999; font-size: 14px; line-height: 1.5; margin: 20px 0;">
                                Si no puedes hacer clic en el botón, copia y pega este enlace en tu navegador:<br>
                                <a href="${confirmUrl}" style="color: #667eea; word-break: break-all; text-decoration: none;">${confirmUrl}</a>
                            </p>
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td style="background: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #eee;">
                            <p style="color: #999; font-size: 12px; margin: 0 0 5px 0;">
                                Este enlace de confirmación expira en 24 horas por seguridad.
                            </p>
                            <p style="color: #999; font-size: 12px; margin: 0;">
                                Si no solicitaste esta cuenta, puedes ignorar este correo de forma segura.
                            </p>
                            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #eee;">
                                <p style="color: #666; font-size: 12px; margin: 0;">
                                    © 2025 Penguin Path • Plataforma Educativa de Linux
                                </p>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;    if (this.useSendgrid) {
      const res = await sgMail.send({
        to: email,
        from,
        subject: 'Confirma tu cuenta - Penguin Path',
        html,
      });
      return res;
    }

    const result = await this.transporter.sendMail({
      from,
      to: email,
      subject: 'Confirma tu cuenta - Penguin Path',
      html,
    });
    const preview = nodemailer.getTestMessageUrl(result);
    if (preview) console.log(`🔍 Preview email: ${preview}`);
    return result;
  }

  async sendPasswordResetEmail(
    email: string,
    resetToken: string,
    username: string,
  ) {
    this.ensureReady();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const from =
      process.env.AWS_SES_FROM_EMAIL ||
      process.env.EMAIL_FROM ||
      '"Penguin Path 🐧" <noreply@penguinpath.app>';

            const html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Restablece tu contraseña - Penguin Path</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/3/35/Tux.svg" alt="Penguin Path" width="50" style="margin-bottom: 10px;">
                            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 300;">Penguin Path</h1>
                            <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0; font-size: 14px;">Plataforma Educativa de Linux</p>
                        </td>
                    </tr>
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="color: #333; margin: 0 0 20px 0; font-size: 24px; font-weight: 400;">Hola, ${username}</h2>
                            <p style="color: #666; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
                                Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en Penguin Path.
                            </p>
                            <p style="color: #666; line-height: 1.6; margin: 0 0 30px 0; font-size: 16px;">
                                Haz clic en el siguiente botón para crear una nueva contraseña:
                            </p>
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="padding: 20px 0;">
                                        <a href="${resetUrl}" style="background: #667eea; color: white; padding: 15px 40px; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 16px; display: inline-block;">
                                            Restablecer mi contraseña
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            <p style="color: #999; font-size: 14px; line-height: 1.5; margin: 20px 0;">
                                Si no puedes hacer clic en el botón, copia y pega este enlace en tu navegador:<br>
                                <a href="${resetUrl}" style="color: #667eea; word-break: break-all; text-decoration: none;">${resetUrl}</a>
                            </p>
                            <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 6px; padding: 15px; margin: 20px 0;">
                                <p style="color: #856404; font-size: 14px; margin: 0; font-weight: 500;">
                                    ⚠️ Este enlace expirará en 1 hora por tu seguridad.
                                </p>
                            </div>
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td style="background: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #eee;">
                            <p style="color: #999; font-size: 12px; margin: 0 0 5px 0;">
                                Si no solicitaste este restablecimiento, puedes ignorar este correo. Tu contraseña no será modificada.
                            </p>
                            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #eee;">
                                <p style="color: #666; font-size: 12px; margin: 0;">
                                    © 2025 Penguin Path • Plataforma Educativa de Linux
                                </p>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;

    if (this.useSendgrid) {
      const res = await sgMail.send({
        to: email,
        from,
        subject: 'Recuperación de contraseña - Penguin Path',
        html,
      });
      return res;
    }

    const result = await this.transporter.sendMail({
      from,
      to: email,
      subject: 'Recuperación de contraseña - Penguin Path',
      html,
    });
    const preview = nodemailer.getTestMessageUrl(result);
    if (preview) console.log(`🔍 Preview email: ${preview}`);
    return result;
  }
}
