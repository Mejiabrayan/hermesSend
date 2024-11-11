'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { formatDistanceToNow } from 'date-fns';
import { CampaignActions } from './campaign-actions';
import { SendButton } from './send-button';
import { BulkActions } from './bulk-actions';
import { useCampaignFilters } from '@/hooks/use-campaign-filters';
import { Tables } from '@/utils/database.types';

type SortableFields = 'name' | 'created_at' | 'updated_at';

type CampaignWithSends = Tables<'campaigns'> & {
  campaign_sends?: {
    id: string;
    contact_id: string;
  }[];
};

export function CampaignsTable({ campaigns: initialCampaigns }: { campaigns: CampaignWithSends[] }) {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [{ status, search, sort, order }] = useCampaignFilters();

  // Filter and sort campaigns
  const campaigns = initialCampaigns
    .filter((campaign) => {
      if (status !== 'all' && campaign.status !== status) return false;
      if (search && !campaign.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      const modifier = order === 'asc' ? 1 : -1;
      if (sort === 'name') {
        return a.name.localeCompare(b.name) * modifier;
      }
      // Type assertion for sortable fields
      const sortField = sort as SortableFields;
      return (new Date(a[sortField]).getTime() - new Date(b[sortField]).getTime()) * modifier;
    });

  return (
    <div className="space-y-4">
      {selectedRows.length > 0 && (
        <BulkActions
          selectedRows={selectedRows}
          onSuccess={() => setSelectedRows([])}
        />
      )}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    campaigns.length > 0 &&
                    selectedRows.length === campaigns.length
                  }
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedRows(campaigns.map((c) => c.id));
                    } else {
                      setSelectedRows([]);
                    }
                  }}
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Opens</TableHead>
              <TableHead>Clicks</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.map((campaign) => (
              <TableRow key={campaign.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedRows.includes(campaign.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedRows([...selectedRows, campaign.id]);
                      } else {
                        setSelectedRows(
                          selectedRows.filter((id) => id !== campaign.id)
                        );
                      }
                    }}
                  />
                </TableCell>
                <TableCell>{campaign.name}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      campaign.status === 'sent'
                        ? 'default'
                        : campaign.status === 'failed'
                        ? 'destructive'
                        : 'secondary'
                    }
                  >
                    {campaign.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(campaign.created_at), {
                    addSuffix: true,
                  })}
                </TableCell>
                <TableCell>{campaign.opens_count || 0}</TableCell>
                <TableCell>{campaign.clicks_count || 0}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <CampaignActions 
                      campaignId={campaign.id} 
                      campaignName={campaign.name}
                    />
                    {campaign.status === 'draft' && (
                      <SendButton 
                        campaignId={campaign.id} 
                        campaignName={campaign.name}
                        recipientCount={campaign.campaign_sends?.length || 0}
                      />
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 