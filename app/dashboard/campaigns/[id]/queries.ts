import { createServer } from '@/utils/supabase/server';
import { Database } from '@/utils/database.types';

type DbCampaign = Database['public']['Tables']['campaigns']['Row'];
type DbCampaignSend = Database['public']['Tables']['campaign_sends']['Row'] & {
  contacts: Database['public']['Tables']['contacts']['Row'] | null;
};

export async function getCampaign(id: string) {
  const supabase = await createServer();
  const { data, error } = await supabase
    .from('campaigns')
    .select(`
      *,
      campaign_sends (
        *,
        contacts (*)
      )
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  if (!data) throw new Error('Campaign not found');

  return data as DbCampaign & {
    campaign_sends: DbCampaignSend[];
  };
} 