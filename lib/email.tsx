import nodemailer from "nodemailer"

const host = process.env.SMTP_HOST
const port = Number(process.env.SMTP_PORT || 587)
const user = process.env.SMTP_USER
const pass = process.env.SMTP_PASS
const from = process.env.SMTP_FROM

if (!host || !user || !pass || !from) {
  console.error("Missing SMTP configuration:", { host: !!host, user: !!user, pass: !!pass, from: !!from })
  throw new Error("Missing SMTP configuration (SMTP_HOST, SMTP_USER, SMTP_PASS, SMTP_FROM)")
}

export const transporter = nodemailer.createTransport({
  host,
  port,
  secure: port === 465, // true for 465, false for other ports
  auth: { 
    user, 
    pass 
  },
  tls: {
    rejectUnauthorized: false // This helps with self-signed certificates
  }
})

export async function sendOtpEmail(to: string, code: string) {
  try {
    console.log("Attempting to send email to:", to)
    
    const appUrl = process.env.APP_BASE_URL || ""
    const html = `
      <div style="font-family:system-ui, -apple-system, Segoe UI, Roboto; line-height:1.6;">
        <h2 style="margin:0 0 8px;">Your verification code</h2>
        <p>Use this code to continue signing in:</p>
        <p style="font-size:28px; font-weight:700; letter-spacing:6px; margin:12px 0;">${code}</p>
        <p>This code expires in 10 minutes.</p>
        ${appUrl ? `<p><a href="${appUrl}" target="_blank" rel="noreferrer">Open the app</a></p>` : ""}
      </div>
    `
    
    const result = await transporter.sendMail({
      to,
      from,
      subject: "Your verification code",
      html,
    })
    
    console.log("Email sent successfully:", result.messageId)
    return result
  } catch (error) {
    console.error("Email sending failed:", error)
    throw new Error(`SMTP Error: ${error instanceof Error ? error.message : 'Unknown email error'}`)
  }
}
