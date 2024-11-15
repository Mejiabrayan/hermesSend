import { SESClient, VerifyDomainIdentityCommand, VerifyDomainDkimCommand } from "@aws-sdk/client-ses";

export class SESVerification {
  private static client = new SESClient({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  static async verifyDomain(domain: string) {
    try {
      // Verify domain identity
      const verifyDomainCommand = new VerifyDomainIdentityCommand({
        Domain: domain
      });
      const { VerificationToken } = await this.client.send(verifyDomainCommand);

      // Get DKIM tokens
      const verifyDkimCommand = new VerifyDomainDkimCommand({
        Domain: domain
      });
      const { DkimTokens } = await this.client.send(verifyDkimCommand);

      return {
        verificationToken: VerificationToken,
        dkimTokens: DkimTokens
      };
    } catch (error) {
      console.error('Failed to verify domain:', error);
      throw error;
    }
  }
} 