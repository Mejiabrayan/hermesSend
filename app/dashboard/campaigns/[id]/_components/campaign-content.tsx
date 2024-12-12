'use client';

import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Suspense, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { CampaignAnalytics } from './campaign-analytics';
import { CampaignTimeline } from './campaign-timeline';
import { CampaignRecipients } from './campaign-recipients';
import { CampaignWithSends } from '../types';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';
import type { Database } from '@/utils/database.types';
import { Button } from '@/components/ui/button';
import { Pencil, X } from 'lucide-react';
import { CampaignEditForm } from './campaign-edit-form';

type AnalyticsData = {
  analytics: Database['public']['Tables']['campaign_analytics']['Row'][];
  sends: Database['public']['Tables']['campaign_sends']['Row'][];
};

type DbCampaign = Database['public']['Tables']['campaigns']['Row'];
type DbCampaignSend = Database['public']['Tables']['campaign_sends']['Row'] & {
  contacts: Database['public']['Tables']['contacts']['Row'] | null;
};

async function getCampaignData(id: string) {
  const supabase = getSupabaseBrowserClient();
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
  return data as DbCampaign & { campaign_sends: DbCampaignSend[] };
}

async function getAnalyticsData(id: string): Promise<AnalyticsData> {
  const supabase = getSupabaseBrowserClient();
  const [analyticsResult, sendsResult] = await Promise.all([
    supabase
      .from('campaign_analytics')
      .select('*')
      .eq('campaign_id', id),
    supabase
      .from('campaign_sends')
      .select('*')
      .eq('campaign_id', id)
  ]);

  if (analyticsResult.error) throw analyticsResult.error;
  if (sendsResult.error) throw sendsResult.error;

  return {
    analytics: analyticsResult.data || [],
    sends: sendsResult.data || []
  };
}

export function CampaignContent({ campaignId }: { campaignId: string }) {
  const [isEditing, setIsEditing] = useState(false);
  const { data: campaignData, refetch } = useQuery({
    queryKey: ['campaign', campaignId],
    queryFn: () => getCampaignData(campaignId),
    staleTime: 1000 * 60,
  });

  const { data: analytics } = useQuery<AnalyticsData>({
    queryKey: ['campaign-analytics', campaignId],
    queryFn: () => getAnalyticsData(campaignId),
  });

  if (!campaignData) return null;

  const campaign: CampaignWithSends = {
    id: campaignData.id,
    name: campaignData.name,
    subject: campaignData.subject,
    content: campaignData.content,
    status: campaignData.status,
    created_at: campaignData.created_at,
    updated_at: campaignData.updated_at,
    sent_count: campaignData.sent_count,
    opens_count: campaignData.opens_count,
    clicks_count: campaignData.clicks_count,
    user_id: campaignData.user_id,
    schedule_at: campaignData.schedule_at,
    campaign_sends: campaignData.campaign_sends.map((send) => ({
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

  if (isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Edit Campaign</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(false)}
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>
        <CampaignEditForm
          campaign={campaignData}
          onCancelAction={() => setIsEditing(false)}
          onSuccessAction={() => {
            setIsEditing(false);
            refetch();
          }}
        />
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold'>{campaign.name}</h1>
          <p className='text-sm text-muted-foreground'>
            Created {format(new Date(campaign.created_at), 'PPP')}
          </p>
        </div>
        <div className='flex items-center gap-4'>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="text-muted-foreground hover:text-foreground"
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
          {campaign.schedule_at && (
            <div className='text-sm text-muted-foreground'>
              Scheduled for: {format(new Date(campaign.schedule_at), 'PPp')}
            </div>
          )}
          <div className='text-sm text-muted-foreground'>
            Status: <span className='capitalize'>{campaign.status}</span>
          </div>
        </div>
      </div>

      <Suspense fallback={<AnalyticsSkeleton />}>
        <CampaignAnalytics 
          campaignId={campaignId} 
          initialData={analytics || { analytics: [], sends: [] }} 
        />
      </Suspense>

      <Tabs defaultValue='recipients' className='space-y-4'>
        <TabsList>
          <TabsTrigger value='recipients'>
            Recipients ({campaign.campaign_sends.length})
          </TabsTrigger>
          <TabsTrigger value='timeline'>Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value='recipients' className='space-y-4'>
          <Suspense fallback={<div>Loading recipients...</div>}>
            <CampaignRecipients
              recipients={campaign.campaign_sends}
            />
          </Suspense>
        </TabsContent>

        <TabsContent value='timeline' className='space-y-4'>
          <Suspense fallback={<div>Loading timeline...</div>}>
            <CampaignTimeline
              campaignId={campaignId}
              analytics={analytics || { analytics: [], sends: [] }}
              campaign={campaign}
            />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
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