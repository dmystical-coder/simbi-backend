const studySessionCompleted = `       
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Simbi Study Streak Update</title>
    <style type="text/css">
        /* Reset styles */
        body, table, td, p, a, li, blockquote {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
            margin: 0;
            padding: 0;
        }
        
        body {
            font-family: 'Arial', sans-serif;
            width: 100% !important;
            height: 100% !important;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
        }
        
        /* Ensure tables don't overflow container */
        table {
            border-spacing: 0;
            border-collapse: collapse;
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }
        
        img {
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
            -ms-interpolation-mode: bicubic;
        }
        
        /* Main container styles */
        .main-container {
            max-width: 600px;
            margin: 0 auto;
            background: linear-gradient(135deg, #a68bdb 0%, #f8c897 100%);
            border-radius: 20px;
            overflow: hidden;
        }
        
        /* Header styles */
        .header {
            padding: 30px 20px 10px;
            text-align: center;
        }
        
        .logo-icon {
            display: inline-block;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background-color: #332121;
            margin-right: 10px;
            vertical-align: middle;
        }
        
        .logo-text {
            display: inline-block;
            color: #000000;
            font-size: 32px;
            font-weight: bold;
            vertical-align: middle;
        }
        
        /* Content styles */
        .content {
            padding: 20px 20px 30px;
            text-align: center;
        }
        
        .streak-banner {
            background-color: rgba(255, 255, 255, 0.25);
            border-radius: 12px;
            padding: 12px 15px;
            margin-bottom: 25px;
            display: inline-block;
        }
        
        .streak-text {
            color: #000000;
            font-size: 18px;
            font-weight: bold;
        }
        
        .lightning {
            font-size: 24px;
            vertical-align: middle;
        }
        
        .message {
            color: #000000;
            font-size: 20px;
            line-height: 1.5;
            margin-bottom: 30px;
        }
        
        .character-container {
            padding: 15px 0;
            text-align: center;
        }
        
        .button-container {
            text-align: center;
            padding: 20px 0;
        }
        
        .cta-button {
            display: inline-block;
            background-color: #5e44ad;
            color: #ffffff !important;
            font-size: 16px;
            font-weight: bold;
            text-decoration: none;
            padding: 15px 30px;
            border-radius: 30px;
            text-align: center;
        }
        
        /* Footer styles */
        .footer {
            background-color: rgba(255, 255, 255, 0.3);
            padding: 20px;
            text-align: center;
        }
        
        .social-links {
            margin-bottom: 15px;
        }
        
        .social-icon {
            display: inline-block;
            width: 32px;
            height: 32px;
            background-color: #5e44ad;
            border-radius: 50%;
            margin: 0 5px;
            text-align: center;
            vertical-align: middle;
        }
        
        .footer-text {
            color: #333333;
            font-size: 12px;
            line-height: 1.5;
        }
        
        /* Responsive styles */
        @media screen and (max-width: 600px) {
            .main-container {
                width: 100% !important;
                border-radius: 0;
            }
            
            .logo-text {
                font-size: 28px;
            }
            
            .message {
                font-size: 18px;
            }
        }
    </style>
</head>
<body>
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="min-width: 100%; background-color: #f4f4f4;">
        <tr>
            <td align="center" valign="top" style="padding: 20px 10px;">
                <!-- Main Container -->
                <table class="main-container" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px;">
                    <!-- Header -->
                    <tr>
                        <td class="header">
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td align="left">
                                        <div style="display: flex; align-items: center;">
                                            <img src="https://ik.imagekit.io/5hv70bbh5/Frame_1321314433-removebg-preview.png?updatedAt=1747252578885" alt="SIMBI" width="40" height="40" style="border-radius: 50%; margin-right: 10px;">
                                            <span style="color: #000000; font-size: 26px; font-weight: bold;">SIMBI Alert!</span>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td class="content">
                            <!-- Streak Banner -->
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td align="center">
                                        <div class="streak-banner">
                                            <span class="streak-text">STREAK MODE: ACTIVATED ⚡</span>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Message -->
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td align="center">
                                        <p class="message">You've smashed {{studySession}} study session! I've notified the Study gods—they're impressed.</p>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Character Image -->
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td class="character-container" align="center">
                                        <div style="position: relative; z-index: 2; width: 100%; text-align: center;">
                                            <img src="https://ik.imagekit.io/5hv70bbh5/simbi_avater-removebg-preview.png?updatedAt=1747468736711" alt="Simbi Character" width="180" style="border: none; display: block; margin: 0 auto;">
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- CTA Button -->
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td class="button-container">
                                        <a href="#" class="cta-button">CONTINUE YOUR STREAK</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td class="footer">
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                <!-- Social Links -->
                                <tr>
                                    <td class="social-links" align="center">
                                        <a href="#" style="text-decoration: none;"><div class="social-icon"></div></a>
                                        <a href="#" style="text-decoration: none;"><div class="social-icon"></div></a>
                                        <a href="#" style="text-decoration: none;"><div class="social-icon"></div></a>
                                    </td>
                                </tr>
                                
                                <!-- Footer Text -->
                                <tr>
                                    <td align="center">
                                        <p class="footer-text">© 2025 Simbi AI. All rights reserved.</p>
                                        <p class="footer-text">123 Study Street, Learning City, SC 12345</p>
                                        <p class="footer-text"><a href="#" style="color: #333333;">Update preferences</a> | <a href="#" style="color: #333333;">Unsubscribe</a></p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;

export default studySessionCompleted;