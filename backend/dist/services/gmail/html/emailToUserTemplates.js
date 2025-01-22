"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userGmailDesign = void 0;
const dotenv_1 = require("../../../config/dotenv");
const thankYouForApplyingEmailTemplate = (applicantName, jobPosition) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank You Email</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f9f9f9;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: white;
      border: 1px solid #E2E6EA;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .header {
      background-color: #1C3F60;
      color: white;
      text-align: center;
      padding: 20px;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 20px;
      color: #333;
      line-height: 1.6;
    }
    .content h2 {
      color: #1C3F60;
      margin-bottom: 16px;
    }
    .content p {
      margin-bottom: 16px;
    }
    .content a {
      color: #1C3F60;
      text-decoration: none;
    }
    .content a:hover {
      text-decoration: underline;
    }
    .footer {
      background-color: #1C3F60;
      color: white;
      text-align: center;
      padding: 15px;
      font-size: 14px;
    }
    .footer a {
      color: white;
      text-decoration: underline;
    }
    .footer a:hover {
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header Section -->
    <div class="header">
      <h1>Thank You</h1>
    </div>
    <!-- Content Section -->
    <div class="content">
      <h2>Application Received</h2>
      <p>Dear ${applicantName},</p>
      <p>
        Thank you for applying for the <strong>${jobPosition}</strong> position at <strong>Alta Celestia</strong>.
        We are excited to receive your application and learn more about your skills and experiences.
      </p>
      <p>
        Our hiring team is currently reviewing all applications, and we aim to provide an update on your application status soon.
        If your profile aligns with our requirements, we will reach out to schedule the next steps.
      </p>
      <p>
        In the meantime, if you have any questions, feel free to contact us at 
        <a href="mailto:${dotenv_1.gmailCredentials.contactEmail}">${dotenv_1.gmailCredentials.contactEmail}</a>.
      </p>
      <p>Thank you once again for considering Alta Celestia for your career journey. We wish you the best!</p>
      <p>Warm regards,</p>
      <p><strong>The Alta Celestia Team</strong></p>
    </div>
    <!-- Footer Section -->
    <div class="footer">
      &copy; ${new Date().getFullYear()} Alta Celestia. All rights reserved.
    </div>
  </div>
</body>
</html>
`;
const rejectionEmailTemplate = (applicantName, jobPosition) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Application Update</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f9f9f9;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: white;
      border: 1px solid #E2E6EA;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .content {
      padding: 20px;
      color: #333;
      line-height: 1.6;
    }
    .content h2 {
      color: #1C3F60;
      margin-bottom: 16px;
    }
    .content p {
      margin-bottom: 16px;
    }
    .content a {
      color: #1C3F60;
      text-decoration: none;
    }
    .content a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Content Section -->
    <div class="content">
      <h2>Application Update</h2>
      <p>Dear ${applicantName},</p>
      <p>
        Thank you very much for your interest in the <strong>${jobPosition}</strong> position at <strong>Alta Celestia</strong> and for taking the time to submit your application.
      </p>
      <p>
        After careful consideration, we regret to inform you that we will not be proceeding with your application at this time. The decision was a difficult one due to the high caliber of applicants we received.
      </p>
      <p>
        We appreciate your efforts and are genuinely impressed with your background and experience. We encourage you to stay connected with us and consider applying for future opportunities that may better match your qualifications.
      </p>
      <p>
        In the meantime, should you have any questions or require feedback, feel free to reach out to us at 
        <a href="mailto:${dotenv_1.gmailCredentials.contactEmail}">${dotenv_1.gmailCredentials.contactEmail}</a>.
      </p>
      <p>Thank you once again for your interest in Alta Celestia, and we wish you the best of luck in your future career endeavors.</p>
      <p>Warm regards,</p>
      <p><strong>The Alta Celestia Team</strong></p>
    </div>
  </div>
</body>
</html>
`;
const interviewRejectionOutcomeEmailTemplate = (applicantName, jobPosition) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Application Update</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .content {
      padding: 20px;
      color: #333;
    }
    .content h2 {
      color: #1C3F60;
      margin-bottom: 16px;
    }
    .content p {
      margin-bottom: 16px;
      line-height: 1.6;
    }
    .cta a {
      background-color: #1C3F60;
      color: white;
      padding: 10px 20px;
      text-decoration: none;
      border-radius: 4px;
      font-weight: bold;
    }
    .cta a:hover {
      background-color: #162E45;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="content">
      <h2>Application Update</h2>
      <p>Dear ${applicantName},</p>
      <p>
        Thank you for your interest in the <strong>${jobPosition}</strong> position at <strong>Alta Celestia</strong> 
        and for the time you spent interviewing with us.
      </p>
      <p>
        After carefully reviewing the results of your interview, we regret to inform you that we will not be moving forward 
        with your application at this time. Please know that this decision was not made lightly, as we had many strong candidates to consider.
      </p>
      <p>
        We were genuinely impressed with your skills and experience, and while we won't be proceeding with your application for this role, 
        we encourage you to stay connected with us. Future opportunities may arise that better align with your qualifications, 
        and we would love to hear from you again.
      </p>
      <p>
        If you'd like to receive feedback on your interview or have any questions, don't hesitate to reach out to us at 
        <a href="mailto:${dotenv_1.gmailCredentials.contactEmail}" style="color: #1C3F60; text-decoration: none;">${dotenv_1.gmailCredentials.contactEmail}</a>.
      </p>
      <p>
        We appreciate your interest in Alta Celestia and wish you all the best in your job search and future career endeavors.
      </p>
      <p>Warm regards,</p>
      <p><strong>The Alta Celestia Team</strong></p>
      <div class="cta">
        <a href="mailto:${dotenv_1.gmailCredentials.contactEmail}">Contact Us</a>
      </div>
    </div>
  </div>
</body>
</html>

`;
const welcomeEmailTemplate = (applicantName, jobPosition) => `

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Alta Celestia</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .content {
      padding: 20px;
      color: #333;
    }
    .content h2 {
      color: #1C3F60;
      margin-bottom: 16px;
    }
    .content p {
      margin-bottom: 16px;
      line-height: 1.6;
    }
    .cta {
      margin-top: 20px;
    }
    .cta a {
      background-color: #1C3F60;
      color: white;
      padding: 10px 20px;
      text-decoration: none;
      border-radius: 4px;
      font-weight: bold;
    }
    .cta a:hover {
      background-color: #162E45;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="content">
      <h2>Welcome to Alta Celestia!</h2>
      <p>Dear ${applicantName},</p>
      <p>
        We are thrilled to officially welcome you to the Alta Celestia family as our new <strong>${jobPosition}</strong>! 
        Thank you for accepting our offer and placing your trust in us to be a part of your professional journey.
      </p>
      <p>
        At Alta Celestia, we believe that our team is our greatest asset, and we are excited to have you contribute your unique skills 
        and perspective to help us achieve new heights. We are confident that you will make a meaningful impact in your role.
      </p>
      <p>
        As we prepare for your first day, our team will be in touch with details about your onboarding process and any resources you may need. 
        Please feel free to reach out with any questions or concerns you might have in the meantime.
      </p>
      <p>
        Once again, welcome to Alta Celestia. We look forward to an exciting and rewarding journey together!
      </p>
      <p>Warm regards,</p>
      <p><strong>The Alta Celestia Team</strong></p>
      <div class="cta">
        <a href="mailto:careers@altacelestia.com">Contact Us</a>
      </div>
    </div>
  </div>
</body>
</html>
`;
exports.userGmailDesign = {
    'Thank You For Applying Email': (applicantName, jobPosition) => thankYouForApplyingEmailTemplate(applicantName, jobPosition),
    'Rejection Email': (applicantName, jobPosition) => rejectionEmailTemplate(applicantName, jobPosition),
    'Interview Rejection Email': (applicantName, jobPosition) => interviewRejectionOutcomeEmailTemplate(applicantName, jobPosition),
    'Welcome Email': (applicantName, jobPosition) => welcomeEmailTemplate(applicantName, jobPosition),
};
//# sourceMappingURL=emailToUserTemplates.js.map