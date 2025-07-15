const verifyEmailTemplate = ({
  code,
  name,
}: {
  code?: string;
  name?: string;
}): string => {
  return `<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Scheherazade+New:wght@400;500;600;700&display=swap"
        rel="stylesheet">

    <style type="text/css">
        /* Some email clients will use these styles */
        body,
        table,
        td,
        p,
        a,
        li,
        blockquote {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }



        img {
            -ms-interpolation-mode: bicubic;
            border: 0;
        }

        body {
            margin: 0;
            padding: 0;
        }
    </style>
</head>

<body style="margin: 0; padding: 0; background-color: #ffffff; font-family: Arial, sans-serif;">
    <!-- Main Table -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%"
        style="max-width: 800px; margin: 0 auto; padding: 10px;">
        <!-- Header with Logo -->
        <tr>
            <td align="center" bgcolor="#000000" style="padding: 20px 0; border-radius: 10px; margin: 5px;">
                <img src="https://kuponna.vercel.app/brand/kuponna-brand-white-yellow.png" alt="Kuponna Logo"
                    style="display: block; width: 150px; max-width: 90%;">
            </td>
        </tr>
        <tr style="height: 15px;">

        </tr>

        <!-- Hero Section -->
        <tr>
            <td>
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-radius: 20px;">
                    <tr>
                        <td style="padding: 0; width: 100%; background-color: #FBFBFB;" align="center">
                            <img src="./assets/images/verifyEmail.png"
                                alt="Woman in green athletic wear"
                                style="display: block; width: 100%;  height: auto;">
                        </td>
                    </tr>
                </table>
            </td>
        </tr>

        <!-- Welcome Message -->
        <tr>
            <td style="padding: 20px 0px;">
                <p style="margin: 0; font-size: 30px; color: #333333;">Dear ${name}</p>
                <p style="margin: 15px 0; font-size: 16px; line-height: 24px; color: #333333;">Welcome to Kuponna! Please verify your email address by clicking the link below:</p>

            <p style="margin: 40px 0px; text-align: center;"><span style="padding: 20px 40px; background: #E0E0E0; font-size: 25px;"> ${code} </span></p>


                <p style="margin: 15px 0; font-size: 16px; line-height: 24px; color: #333333;">If you didn’t sign up, please ignore this email.</p>

                <p style="margin: 15px 0; font-size: 16px; line-height: 24px; color: #333333;">Thanks,</p>
                <p style="margin: 5px 0; font-size: 16px; line-height: 24px; color: #333333;">Kuponna Team</p>
            </td>
        </tr>

        <tr style="height: 20px;">
        </tr>

     

        <!-- Social Media Links -->
        <tr>
            <td align="center" style="padding: 20px;">
                <table border="0" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="padding: 0 10px;">
                            <a href="#" style="text-decoration: none;">
                                <img src="https://cdn-icons-png.flaticon.com/512/145/145802.png" alt="Facebook"
                                    width="30" height="30" style="display: block;">
                            </a>
                        </td>
                        <td style="padding: 0 10px;">
                            <a href="#" style="text-decoration: none;">
                                <img src="https://cdn-icons-png.flaticon.com/512/145/145805.png" alt="Instagram"
                                    width="30" height="30" style="display: block;">
                            </a>
                        </td>
                        <td style="padding: 0 10px;">
                            <a href="#" style="text-decoration: none;">
                                <img src="https://cdn-icons-png.flaticon.com/512/145/145807.png" alt="LinkedIn"
                                    width="30" height="30" style="display: block;">
                            </a>
                        </td>
                        <td style="padding: 0 10px;">
                            <a href="#" style="text-decoration: none;">
                                <img src="https://cdn-icons-png.flaticon.com/512/145/145812.png" alt="YouTube"
                                    width="30" height="30" style="display: block;">
                            </a>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>

        <!-- Footer -->
        <tr>
            <td align="center" style="padding: 10px 20px 30px; font-size: 14px; line-height: 20px; color: #666666;">
                <p style="margin: 0 0 10px;">
                    <a href="mailto:Support@Kuponna.com"
                        style="color: #0056D2; text-decoration: none;">Support@Kuponna.com</a>
                    |
                    <a href="tel:+18889987673" style="color: #0056D2; text-decoration: none;">(888) MY-Kuponna</a>
                </p>
                <p style="margin: 0 0 10px;">© 2025 Kuponna, All rights reserved.</p>
                <p style="margin: 0 0 10px;">Miami, FL 33101</p>
                <p style="margin: 20px 0 0;">
                    The email was sent to [Insert User Email]. To no longer receive these <br> emails,
                    <a href="#" style="color: #0056D2; text-decoration: none;">unsubscribe</a> here.
                </p>
            </td>
        </tr>
    </table>
</body>

</html>`;
};

export default verifyEmailTemplate;
