export interface SendCampaignParams {
  from: string;
  recipients: Array<{
    id: string;
    email: string;
    name?: string | undefined;
  }>;
  subject: string;
  content: string;
  campaignId: string;
  userId: string;
}

export class SESService {
  static async sendCampaign(params: SendCampaignParams): Promise<void> {
    // ... implementation
  }
} 