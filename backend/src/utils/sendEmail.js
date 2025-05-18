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
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

export const sendEmail = async ({
    to,
    subject,
    text,
    heading,
    body,
    buttonText,
    link,
    button2Text,
    link2,
    attachments = [],
    logo = null, // Use absolute URL or base64
    brandColor = '#2563eb',
    socialLinks = getDeveloper(true).socials,
}) => {
    // Validate email parameters
    if (!to || !subject || !heading || !body) {
        throw new Error('Missing required email parameters');
    }

    // Convert single email to array
    const recipients = Array.isArray(to) ? to : [to];

    // Generate social links HTML
    const socialLinksHTML = socialLinks.length > 0 ? `
        <div style="margin-top:1.5rem;">
            ${socialLinks.map(social => `
                <a href="${social.url}" target="_blank" style="text-decoration:none;margin-right:12px;">
                    <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" 
                        alt="${social.platform}" 
                        width="24" 
                        style="vertical-align:middle;">
                </a>
            `).join(" ")}
        </div>` : '';

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
            /* Your existing styles here */
        </style>
    </head>
    <body style="margin:0;padding:0;background:#f8fafc;">
        <table class="container" width="100%" border="0" cellpadding="0" cellspacing="0" 
            style="max-width:600px;margin:2rem auto;background:white;border-radius:8px;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);">
            <!-- Header -->
            <tr>
                <td style="padding:2rem;background:${brandColor};border-radius:8px 8px 0 0;">
                    ${logo ? `<img src="${logo}" alt="Company Logo" 
                        class="header-logo" 
                        style="max-width:200px;height:auto;">`: `
                        <div style="
                            font-size: 48px;
                            font-weight: bold;
                            font-family: 'Segoe UI', Arial, sans-serif;
                            color: #FFD700;
                            text-shadow: 2px 2px 4px rgba(255, 215, 0, 0.3), 
                                        -1px -1px 0 #FFC400;
                            background: linear-gradient(to bottom, #FFD700 0%, #FFC400 100%);
                            -webkit-background-clip: text;
                            background-clip: text;
                            -webkit-text-fill-color: transparent;
                            display: inline-block;
                            padding: 8px 16px;
                            border: 1px solid #FFD700;
                            border-radius: 5px;
                            letter-spacing: 1.5px;
                        ">Eventopia</div>
                    `}
                </td>
            </tr>
            
            <!-- Content -->
            <tr>
                <td style="padding:2rem;">
                    <h1 style="color:#1e293b;font-size:1.5rem;margin:0 0 1.5rem 0;">${heading}</h1>
                    <div style="color:#475569;line-height:1.6;font-size:16px;">
                        ${body}
                    </div>
                    
                    <!-- Action Buttons -->
                    <div style="
                        margin: 2rem 0;
                        display: flex;
                        gap: 1rem;
                        justify-content: space-around;
                        max-width: 420px;
                        width: 100%;
                        flex-wrap: wrap;
                    ">
                        ${link ? generateButton(link, buttonText, brandColor) : ''}
                        ${link2 ? generateButton(link2, button2Text, brandColor) : ''}
                    </div>
                    
                    <hr style="border:1px solid #e2e8f0;margin:2rem 0;">
                    
                    <!-- Footer -->
                    <div style="color:#64748b;font-size:14px;">
                        ${socialLinksHTML}
                        <p style="margin:1rem 0 0 0;font-size:12px;color:#94a3b8;">
                            This email was sent to ${recipients.join(', ')}. 
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
        to: recipients,
        subject,
        text: text || `${heading}\n\n${stripHtml(body).replace(/\n+/g, '\n')}\n${link ? `Action Link: ${link}` : ''}`,
        html: htmlContent,
        attachments,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent to:', recipients.join(', '), 'ID:', {
            messageId: info.messageId,
            accepted: info.accepted,
            rejected: info.rejected,
            response: info.response
        });
        return {
            success: true,
            messageId: info.messageId,
            accepted: info.accepted,
            rejected: info.rejected
        };
    } catch (error) {
        console.error('Email send error:', {
            error: error.message,
            recipients,
            subject
        });
        return {
            success: false,
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        };
    }
};

// Helper function to generate buttons
function generateButton(link, text, color) {
    return `
    <div style="margin:2rem 0;">
        <a href="${link}" 
            style="display:inline-block;
                padding:12px 24px;
                background:${color};
                color:white;
                text-decoration:none;
                border-radius:6px;
                font-weight:500;
                width: 100%;
                transition:transform 0.2s ease;">
            ${text || 'Take Action'}
        </a>
    </div>`;
}

// Helper to strip HTML tags
function stripHtml(html) {
    return html.replace(/<[^>]+>/g, '');
}

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

export const sendInvitationEmail = async ({
    to,
    subject = "You're Invited!",
    eventTitle = "",
    eventSubtitle = "",
    eventDate = "",
    eventName = "",
    eventDescription = "",
    eventTime = "7:00 PM",
    eventLocation = "",
    dressCode = "Business Formal",
    acceptButtonUrl = "#",
    declineButtonUrl = "#",
    responseDeadline = "",
    footerEmail = "events@company.com",
    brandColors = {
        primary: "#6f42c1",
        secondary: "#e83e8c",
        accent: "#20c997"
    }
}) => {
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8f9fa;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background: linear-gradient(15deg, #f8f9fa 65%, ${brandColors.secondary} 35%); min-height: 100vh;">
            <tr>
                <td align="center" valign="top" style="padding: 40px 20px;">
                    <table width="550" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08); position: relative;">             
                        <tr>
                            <td style="background: linear-gradient(45deg, ${brandColors.primary}, ${brandColors.secondary}); padding: 50px 40px 60px 40px; text-align: left; clip-path: polygon(0 0, 100% 0, 100% 80%, 0 100%);">
                                <h1 style="margin: 0; color: white; font-size: 36px; font-weight: 700; line-height: 1.2; max-width: 70%;">${eventTitle}</h1>
                                <div style="width: 50px; height: 4px; background-color: white; margin: 25px 0;"></div>
                                <p style="color: rgba(255,255,255,0.9); font-size: 16px; margin: 10px 0 0 0; max-width: 75%;">${eventSubtitle}</p>
                            </td>
                        </tr>
                        
                        <tr>
                            <td style="padding: 0;">
                                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                    <tr>
                                        <td width="8" style="background: linear-gradient(to bottom, ${brandColors.primary}, ${brandColors.secondary});"></td>
                                        <td style="padding: 40px 35px; position: relative;">
                                            <div style="position: absolute; top: -25px; right: 0%; background-color: ${brandColors.accent}; color: white; padding: 8px 20px; border-radius: 20px; font-weight: 600; font-size: 14px; box-shadow: 0 4px 12px rgba(32, 201, 151, 0.3); width: fit-content;">
                                                ${eventDate}
                                            </div>
                                            <br/>
                                            <h2 style="margin: 0 0 15px 0; color: #343a40; font-size: 24px; font-weight: 600;">${eventName}</h2>
                                            <p style="color: #6c757d; font-size: 16px; line-height: 1.7; margin-bottom: 30px;">
                                                ${eventDescription}
                                            </p>
                                            
                                            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 35px 0;">
                                                <tr>
                                                    <td width="33%" align="center" valign="top" style="padding: 0 10px;">
                                                        <div style="background-color: #f1e8ff; width: 60px; height: 60px; border-radius: 18px; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px auto;padding: 4px">
                                                            <span style="color: ${brandColors.primary}; font-size: 24px; margin: auto auto">⏱️</span>
                                                        </div>
                                                        <p style="margin: 0; color: #495057; font-size: 14px; font-weight: 500;">${eventTime}</p>
                                                    </td>
                                                    <td width="33%" align="center" valign="top" style="padding: 0 10px;">
                                                        <div style="background-color: #ffe0eb; width: 60px; height: 60px; border-radius: 18px; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px auto;padding: 4px">
                                                            <span style="color: ${brandColors.secondary}; font-size: 24px; margin: auto auto">📍</span>
                                                        </div>
                                                        <p style="margin: 0; color: #495057; font-size: 14px; font-weight: 500;">${eventLocation}</p>
                                                    </td>
                                                    <td width="33%" align="center" valign="top" style="padding: 0 10px;">
                                                        <div style="background-color: #d1f7eb; width: 60px; height: 60px; border-radius: 18px; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px auto;padding: 4px">
                                                            <span style="color: ${brandColors.accent}; font-size: 24px; margin: auto auto">👔</span>
                                                        </div>
                                                        <p style="margin: 0; color: #495057; font-size: 14px; font-weight: 500;">${dressCode}</p>
                                                    </td>
                                                </tr>
                                            </table>
                                            
                                            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 30px 0 10px 0;">
                                                <tr>
                                                    <td align="center">
                                                        ${acceptButtonUrl ? `<a href="${acceptButtonUrl}" style="background-color: ${brandColors.primary}; color: white; text-decoration: none; padding: 14px 30px; border-radius: 8px; font-weight: 600; display: inline-block; margin-right: 10px; font-size: 14px;">Accept</a>` : ''}
                                                        ${declineButtonUrl ? `<a href="${declineButtonUrl}" style="background-color: transparent; color: ${brandColors.primary}; text-decoration: none; padding: 13px 25px; border-radius: 8px; font-weight: 600; display: inline-block; border: 1px solid #dee2e6; font-size: 14px;">Decline</a>` : ''}
                                                    </td>
                                                </tr>
                                            </table>
                                            
                                            <p style="color: #adb5bd; font-size: 13px; margin: 25px 0 0 0; text-align: center;">
                                                Kindly respond by ${responseDeadline} | Parking validation available
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        
                        <tr>
                            <td style="background-color: #f8f9fa; padding: 25px 40px; text-align: center; border-top: 1px solid #e9ecef;">
                                <p style="margin: 0; color: #6c757d; font-size: 12px; line-height: 1.6; white-space: pre-line;">
                                    <a href="mailto:${footerEmail}" style="color: ${brandColors.primary}; text-decoration: none;">${footerEmail}</a>
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;

    const mailOptions = {
        from: `"${process.env.EMAIL_NAME || 'Event Manager'}" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html: htmlContent,
        text: `You're invited to ${eventName} on ${eventDate}. ${eventDescription} Location: ${eventLocation}. Dress Code: ${dressCode}. Respond by ${responseDeadline}.`
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Invitation sent:', {
            messageId: info.messageId,
            accepted: info.accepted,
            rejected: info.rejected,
            response: info.response
        });
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending invitation:', error);
        return { success: false, error: error.message };
    }
};