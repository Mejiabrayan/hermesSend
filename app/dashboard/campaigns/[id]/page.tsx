import { createServer } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import { CampaignDetail } from './_components/campaign-detail';
import type { CampaignWithSends } from './types';

export default async function CampaignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createServer();
  const { id } = await params;

  const { data: campaign } = await supabase
    .from('campaigns')
    .select(`
      *,
      campaign_sends(
        id,
        status,
        contact_id,
        contacts(
          email,
          name
        )
      )
    `)
    .eq('id', id)
    .single();

  if (!campaign) {
    notFound();
  }

  const typedCampaign = campaign as CampaignWithSends;

  return <CampaignDetail campaign={typedCampaign} />;
} 