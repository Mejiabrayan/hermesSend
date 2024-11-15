import { SESClient, SendEmailCommand, SendBulkTemplatedEmailCommand } from "@aws-sdk/client-ses";

interface SendResult {
  success: boolean;
  messageId?: string;
  error?: any;
}

interface CampaignRecipient {
  email: string;
  id: string;
}

export class SESService {
  private static client = new SESClient({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  // Validate email format
  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Single email send with validation
  static async sendEmail({
    from = "noreply@hermessend.xyz",
    to,
    subject,
    html,
    messageId,
  }: {
    from?: string;
    to: string | string[];
    subject: string;
    html: string;
    messageId?: string;
  }): Promise<SendResult> {
    try {
      // Validate inputs
      const toAddresses = Array.isArray(to) ? to : [to];
      const invalidEmails = toAddresses.filter(email => !this.isValidEmail(email));
      
      if (invalidEmails.length > 0) {
        return {
          success: false,
          error: `Invalid email addresses: ${invalidEmails.join(', ')}`
        };
      }

      if (!subject.trim()) {
        return {
          success: false,
          error: 'Subject cannot be empty'
        };
      }

      if (!html.trim()) {
        return {
          success: false,
          error: 'Email content cannot be empty'
        };
      }

      const command = new SendEmailCommand({
        Source: from,
        Destination: { ToAddresses: toAddresses },
        Message: {
          Subject: { Data: subject },
          Body: { Html: { Data: html } },
        },
      });

      const response = await this.client.send(command);
      return { success: true, messageId: response.MessageId };
    } catch (error: any) {
      console.error('SES Error:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to send email'
      };
    }
  }

  // Simplified campaign send with better error handling
  static async sendCampaign({
    from = "noreply@hermessend.xyz",
    recipients,
    subject,
    content,
    campaignId,
  }: {
    from?: string;
    recipients: CampaignRecipient[];
    subject: string;
    content: string;
    campaignId: string;
  }) {
    try {
      // Validate recipients
      const validRecipients = recipients.filter(r => this.isValidEmail(r.email));
      
      if (validRecipients.length === 0) {
        return {
          success: false,
          error: 'No valid recipients',
          invalidRecipients: recipients.length
        };
      }

      // Split into chunks of 50 (SES limit)
      const chunkSize = 50;
      const chunks = [];
      for (let i = 0; i < validRecipients.length; i += chunkSize) {
        chunks.push(validRecipients.slice(i, i + chunkSize));
      }

      let successfulSends = 0;
      let failedSends = 0;

      // Process chunks sequentially to avoid rate limits
      for (const chunk of chunks) {
        try {
          const command = new SendEmailCommand({
            Source: from,
            Destination: {
              ToAddresses: chunk.map(r => r.email),
            },
            Message: {
              Subject: { Data: subject },
              Body: { 
                Html: { Data: content },
                Text: { Data: content.replace(/<[^>]*>/g, '') }
              }
            },
            ConfigurationSetName: 'hermessend-email-events',
            Tags: [
              {
                Name: 'campaignId',
                Value: campaignId
              }
            ]
          });

          await this.client.send(command);
          successfulSends += chunk.length;

          // Add delay between chunks to avoid throttling
          if (chunks.length > 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }

        } catch (error) {
          console.error('Chunk send error:', error);
          failedSends += chunk.length;
        }
      }

      return {
        success: successfulSends > 0,
        totalRecipients: validRecipients.length,
        successfulSends,
        failedSends,
        invalidRecipients: recipients.length - validRecipients.length
      };

    } catch (error) {
      console.error('Campaign send error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send campaign',
        totalRecipients: recipients.length,
        successfulSends: 0,
        failedSends: recipients.length,
        invalidRecipients: 0
      };
    }
  }

  // Test email with validation
  static async sendTestEmail(toEmail: string): Promise<SendResult> {
    if (!this.isValidEmail(toEmail)) {
      return {
        success: false,
        error: 'Invalid email address'
      };
    }

    return this.sendEmail({
      to: toEmail,
      subject: "Test Email from HermesSend",
      html: `
        <h1>Test Email</h1>
        <p>This is a test email from your SES setup.</p>
        <p>If you're seeing this, your email sending is working!</p>
        <p>Sent at: ${new Date().toISOString()}</p>
      `,
    });
  }
} 