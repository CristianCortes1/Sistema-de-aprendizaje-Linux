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
      console.log('🔧 Configurando Gmail SMTP...');
      
      this.transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true para 465, false para 587
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
        // Configuración optimizada para Gmail
        connectionTimeout: 30000,
        greetingTimeout: 20000,
        socketTimeout: 45000,
        tls: {
          rejectUnauthorized: false
        }
      });
      
      await this.transporter.verify();
      this.ready = true;
      console.log('✅ Gmail SMTP configurado correctamente');
      
    } catch (err: any) {
      console.error('❌ Error inicializando Gmail:', err?.message);
      this.ready = false;
    }
  }

  private ensureReady() {
    if (!this.ready) {
      throw new Error('Gmail transporter no está inicializado. Verifica tu configuración.');
    }
  }

  async sendConfirmationEmail(
    email: string,
    confirmationToken: string,
    username: string,
  ) {
    // No bloquear si el transporter no está listo
    if (!this.ready) {
      console.warn('⚠️ Email transporter no está listo. Email no será enviado.');
      return;
    }

    const confirmUrl = `${process.env.FRONTEND_URL}/confirm-email?token=${confirmationToken}`;
    const from =
      process.env.EMAIL_FROM ||
      '"Penguin Path" <noreply@penguinpath.duckdns.org>';

    const text = `
Hola ${username},

Gracias por registrarte en Penguin Path.

Para activar tu cuenta, haz clic en el siguiente enlace:
${confirmUrl}

Este enlace es válido por 24 horas.

Si no creaste esta cuenta, ignora este mensaje.

Saludos,
El equipo de Penguin Path
`;

    const html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirma tu cuenta</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 1px solid #dddddd;">
                    <tr>
                        <td style="background-color: #5865f2; padding: 20px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Penguin Path</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 30px;">
                            <h2 style="color: #333333; margin: 0 0 15px 0; font-size: 20px;">Hola ${username},</h2>
                            <p style="color: #555555; line-height: 1.6; margin: 0 0 15px 0; font-size: 15px;">
                                Gracias por registrarte en Penguin Path. Para activar tu cuenta, por favor haz clic en el botón de abajo.
                            </p>
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 25px 0;">
                                <tr>
                                    <td align="center">
                                        <a href="${confirmUrl}" style="background-color: #5865f2; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-size: 15px; display: inline-block;">Activar mi cuenta</a>
                                    </td>
                                </tr>
                            </table>
                            <p style="color: #777777; font-size: 13px; line-height: 1.5; margin: 15px 0;">
                                O copia y pega este enlace en tu navegador:<br>
                                <span style="color: #5865f2; word-break: break-all;">${confirmUrl}</span>
                            </p>
                            <p style="color: #777777; font-size: 13px; margin: 15px 0 0 0;">
                                Este enlace es válido por 24 horas. Si no creaste esta cuenta, puedes ignorar este mensaje.
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color: #f9f9f9; padding: 15px; text-align: center; border-top: 1px solid #dddddd;">
                            <p style="color: #888888; font-size: 12px; margin: 0;">
                                © 2025 Penguin Path - Plataforma Educativa
                            </p>
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
      text,
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
    // No bloquear si el transporter no está listo
    if (!this.ready) {
      console.warn('⚠️ Email transporter no está listo. Email no será enviado.');
      return;
    }

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const from =
      process.env.AWS_SES_FROM_EMAIL ||
      process.env.EMAIL_FROM ||
      '"Penguin Path 🐧" <noreply@penguinpath.app>';

    const text = `
Hola ${username},

Recibimos una solicitud para restablecer tu contraseña en Penguin Path.

Para crear una nueva contraseña, haz clic en el siguiente enlace:
${resetUrl}

Este enlace es válido por 1 hora.

Si no solicitaste este cambio, ignora este mensaje y tu contraseña no será modificada.

Saludos,
El equipo de Penguin Path
`;

    const html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Restablece tu contraseña</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 1px solid #dddddd;">
                    <tr>
                        <td style="background-color: #5865f2; padding: 20px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Penguin Path</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 30px;">
                            <h2 style="color: #333333; margin: 0 0 15px 0; font-size: 20px;">Hola ${username},</h2>
                            <p style="color: #555555; line-height: 1.6; margin: 0 0 15px 0; font-size: 15px;">
                                Recibimos una solicitud para restablecer tu contraseña. Haz clic en el botón de abajo para continuar.
                            </p>
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 25px 0;">
                                <tr>
                                    <td align="center">
                                        <a href="${resetUrl}" style="background-color: #5865f2; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-size: 15px; display: inline-block;">Restablecer contraseña</a>
                                    </td>
                                </tr>
                            </table>
                            <p style="color: #777777; font-size: 13px; line-height: 1.5; margin: 15px 0;">
                                O copia y pega este enlace en tu navegador:<br>
                                <span style="color: #5865f2; word-break: break-all;">${resetUrl}</span>
                            </p>
                            <p style="color: #999999; font-size: 13px; margin: 15px 0 0 0;">
                                Este enlace es válido por 1 hora. Si no solicitaste este cambio, ignora este mensaje.
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color: #f9f9f9; padding: 15px; text-align: center; border-top: 1px solid #dddddd;">
                            <p style="color: #888888; font-size: 12px; margin: 0;">
                                © 2025 Penguin Path - Plataforma Educativa
                            </p>
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
      text,
      html,
    });
    const preview = nodemailer.getTestMessageUrl(result);
    if (preview) console.log(`🔍 Preview email: ${preview}`);
    return result;
  }
}
