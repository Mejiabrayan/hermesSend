'use server'

import { createServer } from '@/utils/supabase/server';
import { Tables } from '@/utils/database.types';

export async function getCampaignAnalytics(campaignId: string) {
  const supabase = await createServer();
  
  const [analyticsResponse, sendsResponse] = await Promise.all([
    supabase
      .from('campaign_analytics')
      .select('*')
      .eq('campaign_id', campaignId),
    supabase
      .from('campaign_sends')
      .select('*')
      .eq('campaign_id', campaignId)
  ]);

  return {
    analytics: analyticsResponse.data as Tables<'campaign_analytics'>[],
    sends: sendsResponse.data as Tables<'campaign_sends'>[]
  };
} 