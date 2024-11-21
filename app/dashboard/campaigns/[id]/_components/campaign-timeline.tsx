'use client';

import { Tables } from '@/utils/database.types';
import { format } from 'date-fns';
import { Mail, MousePointerClick, Eye } from 'lucide-react';
import { CampaignWithSends } from '../types';

interface TimelineEvent {
  type: 'send' | 'open' | 'click';
  timestamp: string;
  icon: JSX.Element;
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
      type: 'send',
      timestamp: campaign.created_at,
      icon: <Mail className="h-4 w-4" />,
      description: 'Campaign created'
    },
    // Opens
    ...analytics.analytics
      .filter(a => a.opened_at)
      .map(a => ({
        type: 'open' as const,
        timestamp: a.opened_at!,
        icon: <Eye className="h-4 w-4" />,
        description: 'Email opened'
      })),
    // Clicks
    ...analytics.analytics
      .filter(a => a.clicked_at)
      .map(a => ({
        type: 'click' as const,
        timestamp: a.clicked_at!,
        icon: <MousePointerClick className="h-4 w-4" />,
        description: 'Link clicked'
      }))
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="space-y-4">
      {events.map((event, index) => (
        <div key={index} className="flex gap-4 items-start">
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