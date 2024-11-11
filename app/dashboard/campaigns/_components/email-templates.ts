export const emailTemplates = {
  welcome: {
    name: "Welcome Email",
    content: `
      <h2>Welcome to Our Community!</h2>
      <p>Hi {{name}},</p>
      <p>We're excited to have you on board. Here's what you can expect:</p>
      <ul>
        <li>Regular updates about our products</li>
        <li>Exclusive offers for subscribers</li>
        <li>Tips and best practices</li>
      </ul>
      <p>Best regards,<br>The Team</p>
    `,
  },
  newsletter: {
    name: "Newsletter",
    content: `
      <h2>{{newsletter_title}}</h2>
      <p>Hi {{name}},</p>
      <p>Here's what's new this week:</p>
      <ul>
        <li>Update 1</li>
        <li>Update 2</li>
        <li>Update 3</li>
      </ul>
      <p>Stay tuned for more updates!</p>
    `,
  },
  announcement: {
    name: "Product Announcement",
    content: `
      <h2>Exciting News!</h2>
      <p>Hi {{name}},</p>
      <p>We're thrilled to announce our latest feature:</p>
      <div style="padding: 20px; background: #f5f5f5; border-radius: 5px; margin: 20px 0;">
        <h3>{{announcement_title}}</h3>
        <p>{{announcement_description}}</p>
      </div>
      <p>Try it out and let us know what you think!</p>
    `,
  },
} as const; 