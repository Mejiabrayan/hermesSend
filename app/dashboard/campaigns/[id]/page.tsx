import { createServer } from '@/utils/supabase/server';
import { notFound, redirect } from 'next/navigation';
import {
  CampaignAnalytics,
  CampaignTimeline,
  CampaignRecipients,
} from './_components';
import { CampaignWithSends } from './types';
import { getCampaignAnalytics } from './actions';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { Database } from '@/utils/database.types';

type DbCampaign = Database['public']['Tables']['campaigns']['Row'];
type DbCampaignSend = Database['public']['Tables']['campaign_sends']['Row'] & {
  contacts: Database['public']['Tables']['contacts']['Row'] | null;
};

export default async function CampaignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServer();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    redirect('/sign-in');
  }

  try {
    const [campaignResult, analytics] = await Promise.all([
      supabase
        .from('campaigns')
        .select(
          `
          *,
          campaign_sends (
            *,
            contacts (*)
          )
        `
        )
        .eq('id', id)
        .single(),
      getCampaignAnalytics(id),
    ]);

    if (campaignResult.error || !campaignResult.data) {
      console.error('Campaign fetch error:', campaignResult.error);
      return notFound();
    }

    const campaign = campaignResult.data as DbCampaign & {
      campaign_sends: DbCampaignSend[];
    };

    const typedCampaign: CampaignWithSends = {
      id: campaign.id,
      name: campaign.name,
      subject: campaign.subject,
      content: campaign.content,
      status: campaign.status,
      created_at: campaign.created_at,
      updated_at: campaign.updated_at,
      sent_count: campaign.sent_count,
      opens_count: campaign.opens_count,
      clicks_count: campaign.clicks_count,
      user_id: campaign.user_id,
      schedule_at: campaign.schedule_at,
      campaign_sends: campaign.campaign_sends.map((send) => ({
        id: send.id,
        contact_id: send.contact_id,
        status: send.status,
        sent_at: send.sent_at,
        contacts: send.contacts && {
          id: send.contacts.id,
          email: send.contacts.email,
          name: send.contacts.name,
        },
      })),
    };

    return (
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold'>{typedCampaign.name}</h1>
            <p className='text-sm text-muted-foreground'>
              Created {format(new Date(typedCampaign.created_at), 'PPP')}
            </p>
          </div>
          <div className='flex items-center gap-4'>
            {typedCampaign.schedule_at && (
              <div className='text-sm text-muted-foreground'>
                Scheduled for:{' '}
                {format(new Date(typedCampaign.schedule_at), 'PPp')}
              </div>
            )}
            <div className='text-sm text-muted-foreground'>
              Status: <span className='capitalize'>{typedCampaign.status}</span>
            </div>
          </div>
        </div>

        <Suspense fallback={<AnalyticsSkeleton />}>
          <CampaignAnalytics campaignId={id} initialData={analytics} />
        </Suspense>

        <Tabs defaultValue='recipients' className='space-y-4'>
          <TabsList>
            <TabsTrigger value='recipients'>
              Recipients ({typedCampaign.campaign_sends.length})
            </TabsTrigger>
            <TabsTrigger value='timeline'>Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value='recipients' className='space-y-4'>
            <Suspense fallback={<div>Loading recipients...</div>}>
              <CampaignRecipients
                campaignId={id}
                recipients={typedCampaign.campaign_sends}
              />
            </Suspense>
          </TabsContent>

          <TabsContent value='timeline' className='space-y-4'>
            <Suspense fallback={<div>Loading timeline...</div>}>
              <CampaignTimeline
                campaignId={id}
                analytics={analytics}
                campaign={typedCampaign}
              />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    );
  } catch (error) {
    console.error('Campaign page error:', error);
    return notFound();
  }
}

function AnalyticsSkeleton() {
  return (
    <div className='grid gap-4 md:grid-cols-3'>
      {[...Array(3)].map((_, i) => (
        <div key={i} className='p-6 rounded-lg border'>
          <Skeleton className='h-4 w-24 mb-4' />
          <Skeleton className='h-8 w-16' />
        </div>
      ))}
    </div>
  );
}
