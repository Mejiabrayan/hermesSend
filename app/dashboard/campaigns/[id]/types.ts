import { Tables } from '@/utils/database.types';

export type CampaignWithSends = Tables<'campaigns'> & {
  campaign_sends: Array<{
    id: string;
    status: string;
    contact_id: string;
    sent_at: string | null;
    contacts: {
      email: string;
      name: string | null;
    } | null;
  }>;
} 