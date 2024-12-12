'use client';

import { Tables } from '@/utils/database.types';
import { format } from 'date-fns';
import { Mail, MousePointerClick, Eye } from 'lucide-react';
import { CampaignWithSends } from '../types';
import * as React from 'react';

interface TimelineEvent {
  id: string;
  type: 'send' | 'open' | 'click';
  timestamp: string;
  icon: React.ReactNode;
  description: string;
}

interface CampaignTimelineProps {
  campaignId: string;
  analytics: {
    analytics: Tables<'campaign_analytics'>[];
    sends: Tables<'campaign_sends'>[];
  };
  campaign: CampaignWithSends;
}

export function CampaignTimeline({ analytics, campaign }: CampaignTimelineProps) {
  const events: TimelineEvent[] = [
    // Campaign creation
    {
      id: `campaign-creation-${campaign.id}`,
      type: 'send' as const,
      timestamp: campaign.created_at,
      icon: <Mail className="h-4 w-4" />,
      description: 'Campaign created'
    },
    // Opens
    ...analytics.analytics
      .filter(a => a.opened_at)
      .map(a => ({
        id: `open-${a.id}`,
        type: 'open' as const,
        timestamp: a.opened_at!,
        icon: <Eye className="h-4 w-4" />,
        description: 'Email opened'
      })),
    // Clicks
    ...analytics.analytics
      .filter(a => a.clicked_at)
      .map(a => ({
        id: `click-${a.id}`,
        type: 'click' as const,
        timestamp: a.clicked_at!,
        icon: <MousePointerClick className="h-4 w-4" />,
        description: 'Link clicked'
      }))
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div key={event.id} className="flex gap-4 items-start">
          <div className="mt-1 p-2 rounded-full bg-zinc-950/50">
            {event.icon}
          </div>
          <div>
            <p className="font-medium">{event.description}</p>
            <time className="text-sm text-muted-foreground">
              {format(new Date(event.timestamp), 'PPp')}
            </time>
          </div>
        </div>
      ))}
    </div>
  );
}