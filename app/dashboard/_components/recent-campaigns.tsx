'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

interface Campaign {
  id: string;
  name: string;
  status: string;
  sent_count: number | null;
  opens_count: number | null;
  clicks_count: number | null;
  created_at: string;
}

interface RecentCampaignsProps {
  campaigns: Campaign[];
}

export function RecentCampaigns({ campaigns }: RecentCampaignsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Campaigns</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <Link
              key={campaign.id}
              href={`/dashboard/campaigns/${campaign.id}`}
              className="block"
            >
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/50">
                <div>
                  <div className="font-medium">{campaign.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(campaign.created_at), { addSuffix: true })}
                  </div>
                </div>
                <Badge variant={campaign.status === 'sent' ? 'default' : 'secondary'}>
                  {campaign.status}
                </Badge>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 