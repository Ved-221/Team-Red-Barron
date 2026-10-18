"use server";

import { createClient } from "@/lib/supabase/server";
import nodemailer from "nodemailer";

export interface ContactTransmissionPayload {
  inquiry_type: string;
  name: string;
  email: string;
  organization?: string;
  message: string;
}

const TARGET_MARKETING_EMAIL = "redbaron.marketingexec@gmail.com";

export async function submitContactTransmission(payload: ContactTransmissionPayload) {
  const supabase = await createClient();

  // 1. Always save transmission directly to Supabase PostgreSQL database
  try {
    const { error: dbError } = await supabase.from("contact_messages").insert({
      inquiry_type: payload.inquiry_type,
      name: payload.name,
      email: payload.email,
      organization: payload.organization || null,
      message: payload.message,
      target_email: TARGET_MARKETING_EMAIL,
    });

    if (dbError) {
      console.error("Failed to store message in Supabase contact_messages:", dbError);
    }
  } catch (dbErr) {
    console.error("Database insert error:", dbErr);
  }

  // 2. Dispatch via Nodemailer if SMTP credentials are configured in environment
  let serverDispatched = false;
  const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER;
  const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;

  if (smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: `"TRB Transmission" <${smtpUser}>`,
        to: TARGET_MARKETING_EMAIL,
        replyTo: payload.email,
        subject: `[TRB Transmission] ${payload.inquiry_type} - ${payload.name}`,
        text: `New Transmission Received from Team Red Baron Website\n\n` +
              `Inquiry Type: ${payload.inquiry_type}\n` +
              `Sender Name: ${payload.name}\n` +
              `Sender Email: ${payload.email}\n` +
              `Organization: ${payload.organization || "N/A"}\n\n` +
              `Message Details:\n${payload.message}\n\n` +
              `Transmitted At: ${new Date().toLocaleString()}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 24px; background: #0c0d10; color: #f5f5f5; border: 1px solid #de1615; border-radius: 16px;">
            <div style="margin-bottom: 16px;">
              <span style="font-size: 11px; font-weight: bold; color: #de1615; letter-spacing: 2px; text-transform: uppercase;">Team Red Baron Telemetry</span>
              <h2 style="color: #ffffff; margin: 4px 0 0 0; font-size: 20px;">New Transmission Received</h2>
            </div>
            <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 16px 0;" />
            <table style="width: 100%; font-size: 14px; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <td style="color: #ff6534; font-weight: bold; width: 150px; padding: 6px 0;">Inquiry Type:</td>
                <td style="color: #ffffff; padding: 6px 0;">${payload.inquiry_type}</td>
              </tr>
              <tr>
                <td style="color: #ff6534; font-weight: bold; padding: 6px 0;">Sender Name:</td>
                <td style="color: #ffffff; padding: 6px 0;">${payload.name}</td>
              </tr>
              <tr>
                <td style="color: #ff6534; font-weight: bold; padding: 6px 0;">Sender Email:</td>
                <td style="color: #ffffff; padding: 6px 0;"><a href="mailto:${payload.email}" style="color: #de1615; text-decoration: underline;">${payload.email}</a></td>
              </tr>
              <tr>
                <td style="color: #ff6534; font-weight: bold; padding: 6px 0;">Organization:</td>
                <td style="color: #ffffff; padding: 6px 0;">${payload.organization || "N/A"}</td>
              </tr>
            </table>
            <div style="background: rgba(255,255,255,0.04); border-left: 3px solid #de1615; padding: 14px 16px; border-radius: 6px; margin-bottom: 20px;">
              <p style="margin: 0; color: #e2e2e2; line-height: 1.6; white-space: pre-wrap; font-size: 14px;">${payload.message}</p>
            </div>
            <div style="font-size: 11px; color: #888888; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 12px;">
              Delivered directly to: <strong>${TARGET_MARKETING_EMAIL}</strong>
            </div>
          </div>
        `,
      });
      serverDispatched = true;
    } catch (err) {
      console.error("Nodemailer dispatch error:", err);
    }
  }

  return {
    success: true,
    serverDispatched,
    targetEmail: TARGET_MARKETING_EMAIL,
  };
}
