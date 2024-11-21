import { Database } from '@/utils/database.types';

type DbCampaign = Database['public']['Tables']['campaigns']['Row'];

export type CampaignWithSends = Pick<
  DbCampaign,
  | 'id'
  | 'name'
  | 'subject'
  | 'content'
  | 'status'
  | 'created_at'
  | 'updated_at'
  | 'sent_count'
  | 'opens_count'
  | 'clicks_count'
  | 'user_id'
  | 'schedule_at'
> & {
  campaign_sends: Array<{
    id: string;
    contact_id: string;
    status: string;
    sent_at: string | null;
    contacts: Pick<Database['public']['Tables']['contacts']['Row'], 'id' | 'email' | 'name'> | null;
  }>;
}; 