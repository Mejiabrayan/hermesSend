import { createServer } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import { 
  CampaignAnalytics, 
  CampaignTimeline, 
  CampaignRecipients 
} from './_components';
import { CampaignWithSends } from './types';
import { getCampaignAnalytics } from './actions';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from 'date-fns';

export default async function CampaignPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createServer();

  const [campaign, analytics] = await Promise.all([
    supabase
      .from('campaigns')
      .select(`
        *,
        campaign_sends(
          id,
          status,
          contact_id,
          sent_at,
          contacts(
            email,
            name
          )
        )
      `)
      .eq('id', params.id)
      .single(),
    getCampaignAnalytics(params.id)
  ]);

  if (!campaign.data) {
    notFound();
  }

  const typedCampaign = campaign.data as CampaignWithSends;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{typedCampaign.name}</h1>
          <p className="text-sm text-muted-foreground">
            Created {format(new Date(typedCampaign.created_at), 'PPP')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground">
            Status: <span className="capitalize">{typedCampaign.status}</span>
          </div>
        </div>
      </div>

      <Suspense fallback={<AnalyticsSkeleton />}>
        <CampaignAnalytics 
          campaignId={params.id} 
          initialData={analytics}
        />
      </Suspense>

      <Tabs defaultValue="recipients" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recipients">Recipients</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>
        
        <TabsContent value="recipients" className="space-y-4">
          <Suspense fallback={<div>Loading recipients...</div>}>
            <CampaignRecipients 
              campaignId={params.id}
              recipients={typedCampaign.campaign_sends}
            />
          </Suspense>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Suspense fallback={<div>Loading timeline...</div>}>
            <CampaignTimeline 
              campaignId={params.id}
              analytics={analytics}
              campaign={typedCampaign}
            />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AnalyticsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="p-6 rounded-lg border">
          <Skeleton className="h-4 w-24 mb-4" />
          <Skeleton className="h-8 w-16" />
        </div>
      ))}
    </div>
  );
} 