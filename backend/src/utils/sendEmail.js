import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const memberSocial = [
    {
        name: "Jatin Vishwakarma",
        socials: [
            { platform: "instagram", url: "https://www.instagram.com/__jatin__2002" },
            { platform: "github", url: "https://github.com/jatin7425" },
            { platform: "linkedin", url: "https://www.linkedin.com/in/jatin7425" }
        ]
    },
    {
        name: "Faizal Ahmed",
        socials: [
            { platform: "instagram", url: "https://www.instagram.com/faizal_noob_" },
            { platform: "github", url: "https://github.com/Faizal-16" },
            { platform: "linkedin", url: "https://www.linkedin.com/in/faizal-ahmed-a689052a5/" }
        ]
    }
];


function getDeveloper(random = false) {
    if (random) {
        const randomIndex = Math.floor(Math.random() * memberSocial.length);
        return memberSocial[randomIndex];
    }
    return memberSocial;
}


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendEmail = async ({
    to,
    subject,
    text,
    heading,
    body,
    buttonText,
    link,
    attachments = [],
    logo,
    brandColor = '#2563eb',
    socialLinks = getDeveloper(true).socials,
}) => {
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Template</title>
        <style>
            @media only screen and (max-width: 600px) {
                .container {
                    width: 100% !important;
                }
                .header-logo { 
                    max-width: 180px !important; 
                }
            }
        </style>
    </head>
    <body style="margin:0;padding:0;background:#f8fafc;">
        <table class="container" width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width:600px;margin:2rem auto;background:white;border-radius:8px;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);">
            <!-- Header -->
            <tr>
                <td style="padding:2rem;background:${brandColor};border-radius:8px 8px 0 0;">
                    <img src="../assets/logoNobg.png" alt="Company Logo" class="header-logo" style="max-width:200px;height:auto;">
                </td>
            </tr>
            
            <!-- Content -->
            <tr>
                <td style="padding:2rem;">
                    <h1 style="color:#1e293b;font-size:1.5rem;margin:0 0 1.5rem 0;">${heading}</h1>
                    <div style="color:#475569;line-height:1.6;font-size:16px;">
                        ${body}
                    </div>
                    
                    ${link ? `
                    <div style="margin:2rem 0;">
                        <a href="${link}" 
                            style="display:inline-block;padding:12px 24px;background:${brandColor};color:white;text-decoration:none;border-radius:6px;font-weight:500;transition:transform 0.2s ease;">
                            ${buttonText || 'Take Action'}
                        </a>
                    </div>` : ''}
                    
                    <hr style="border:1px solid #e2e8f0;margin:2rem 0;">
                    
                    <!-- Footer -->
                    <div style="color:#64748b;font-size:14px;">
                        <p style="margin:0.5rem 0;">Need help? <a href="mailto:eventopia959@gmail.com" style="color:${brandColor};">Contact our support team</a></p>
                        <p style="margin:0.5rem 0;">${new Date().getFullYear()} © Your Company Name. All rights reserved.</p>
                        
                        ${Object.keys(socialLinks).length > 0 ? `
                        <div style="margin-top:1.5rem;">
                            ${Object.entries(socialLinks).map(([platform, url]) => `
                                <a href="${url}" target="_blank" style="text-decoration:none;margin-right:12px;">
                                    <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="${platform}" width="24" style="vertical-align:middle;">
                                </a>
                            `).join('')}
                        </div>` : ''}
                        
                        <p style="margin:1rem 0 0 0;font-size:12px;color:#94a3b8;">
                            This email was sent to ${Array.isArray(to) ? to.join(', ') : to}. 
                            <a href="#" style="color:${brandColor};">Unsubscribe</a> 
                            | <a href="#" style="color:${brandColor};">View in browser</a>
                        </p>
                    </div>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;

    const mailOptions = {
        from: `"${process.env.EMAIL_NAME || 'Eventopia'}" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text: text || `${heading}\n\n${body.replace(/<[^>]+>/g, '')}\n${link ? `Action Link: ${link}` : ''}`,
        html: htmlContent,
        attachments,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Email send error:', error);
        return { success: false, error: error.message };
    }
};

export const sendContactEmail = async ({ name, email, message }) => {
    const mailOptions = {
        from: `"EventManager Contact" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER, // Send to yourself
        subject: `New Contact Message from ${name}`,
        html: `
      <h2>You have a new contact message</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong><br>${message}</p>
    `
    };

    await transporter.sendMail(mailOptions);
};