'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { Mail, MousePointerClick, Eye } from 'lucide-react';
import { getCampaignAnalytics } from '../actions';
import { Tables } from '@/utils/database.types';

interface CampaignAnalyticsProps {
  campaignId: string;
  initialData: {
    analytics: Tables<'campaign_analytics'>[];
    sends: Tables<'campaign_sends'>[];
  };
}

export function CampaignAnalytics({ campaignId, initialData }: CampaignAnalyticsProps) {
  const { data } = useQuery({
    queryKey: ['campaign-analytics', campaignId],
    queryFn: () => getCampaignAnalytics(campaignId),
    initialData,
    refetchInterval: 30000, // Refresh every 30 seconds
    staleTime: 10000, // Consider data fresh for 10 seconds
  });

  const stats = {
    sent: data.sends.length,
    delivered: data.sends.filter(s => s.status === 'delivered').length,
    opens: data.analytics.filter(a => a.opened_at).length,
    clicks: data.analytics.filter(a => a.clicked_at).length,
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Delivered</CardTitle>
          <Mail className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.delivered}</div>
          <p className="text-xs text-muted-foreground">
            out of {stats.sent} sent
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Opens</CardTitle>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.opens}</div>
          <p className="text-xs text-muted-foreground">
            {stats.delivered > 0 
              ? `${((stats.opens / stats.delivered) * 100).toFixed(1)}% open rate`
              : 'No deliveries yet'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Clicks</CardTitle>
          <MousePointerClick className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.clicks}</div>
          <p className="text-xs text-muted-foreground">
            {stats.opens > 0 
              ? `${((stats.clicks / stats.opens) * 100).toFixed(1)}% click rate`
              : 'No opens yet'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 