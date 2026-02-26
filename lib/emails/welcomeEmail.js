export const welcomeEmailTemplate = (name) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>Welcome to BuyLog</title>
    </head>
    <body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,sans-serif;">
      
      <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
        <tr>
          <td align="center">
            
            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;padding:40px;">
              
              <!-- Logo -->
              <tr>
                <td align="center">
                <img src="https://buylogint.com/limiLogo.webp.png" width="120" alt="BuyLog Logo" />
                </td>
              </tr>
  
              <!-- Title -->
              <tr>
                <td style="padding-top:30px;text-align:center;">
                  <h2 style="color:#1a1a1a;">Welcome to BuyLog, ${name}! 🎉</h2>
                </td>
              </tr>
  
              <!-- Message -->
              <tr>
                <td style="padding-top:20px;color:#555;font-size:15px;line-height:24px;text-align:center;">
                  Your account is now ready to use.
                  <br /><br />
                  Start exploring products, connect with farmers, and grow your business.
                </td>
              </tr>
  
              <!-- Button -->
              <tr>
                <td align="center" style="padding-top:30px;">
                  <a href="https://buylogint.com/login"
                     style="background:#16a34a;color:#fff;padding:12px 25px;
                     text-decoration:none;border-radius:6px;font-weight:bold;">
                     Login to Your Account
                  </a>
                </td>
              </tr>
  
              <!-- Divider -->
              <tr>
                <td style="padding-top:40px;border-top:1px solid #eee;"></td>
              </tr>
  
              <!-- Social Links -->
              <tr>
                <td align="center" style="padding-top:20px;font-size:14px;color:#888;">
                  Follow us<br/><br/>
                  <a href="https://www.facebook.com/share/176PqcjERN/?mibextid=wwXIfr" style="margin:0 8px;">Facebook</a>
                  <a href="https://www.instagram.com/buylogint?igsh=Y2RrOW90cjJuOGF0&utm_source=qr" style="margin:0 8px;">Instagram</a>
                  <a href="https://x.com/@buy_log" style="margin:0 8px;">Twitter</a>
                </td>
              </tr>
  
              <!-- Footer -->
              <tr>
                <td align="center" style="padding-top:30px;font-size:12px;color:#aaa;">
                  © ${new Date().getFullYear()} BuyLog. All rights reserved.
                </td>
              </tr>
  
            </table>
          </td>
        </tr>
      </table>
  
    </body>
    </html>
    `;
  };