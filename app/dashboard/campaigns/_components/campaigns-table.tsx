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
import { CampaignActions } from './campaign-actions';
import { SendButton } from './send-button';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { BulkActions } from './bulk-actions';
import { Checkbox } from '@/components/ui/checkbox';
import { Tables } from '@/utils/database.types';
import { useCampaignFilters } from '@/hooks/use-campaign-filters';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown } from 'lucide-react';

// Helper function to get status badge styling
function getStatusBadge(status: string) {
  switch (status) {
    case 'draft':
      return <Badge variant="outline">Draft</Badge>;
    case 'scheduled':
      return <Badge variant="secondary">Scheduled</Badge>;
    case 'sending':
      return <Badge variant="secondary" className="bg-blue-500/15 text-blue-500">Sending</Badge>;
    case 'sent':
      return <Badge variant="secondary" className="bg-green-500/15 text-green-500">Sent</Badge>;
    case 'failed':
      return <Badge variant="secondary" className="bg-red-500/15 text-red-500">Failed</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

interface CampaignsTableProps {
  campaigns: Tables<'campaigns'>[];
}

export function CampaignsTable({ campaigns: initialCampaigns }: { campaigns: Campaign[] }) {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [{ status, search, sort, order }, setFilters] = useCampaignFilters();

  // Filter campaigns based on URL state
  const campaigns = initialCampaigns.filter(campaign => {
    if (status !== 'all' && campaign.status !== status) return false;
    if (search && !campaign.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }).sort((a, b) => {
    const modifier = order === 'asc' ? 1 : -1;
    if (sort === 'name') {
      return a.name.localeCompare(b.name) * modifier;
    }
    return (new Date(a[sort]).getTime() - new Date(b[sort]).getTime()) * modifier;
  });

  const handleRowSelect = (id: string, selected: boolean) => {
    setSelectedRows(prev => 
      selected 
        ? [...prev, id]
        : prev.filter(rowId => rowId !== id)
    );
  };

  const handleSelectAll = (selected: boolean) => {
    setSelectedRows(selected ? campaigns.map(c => c.id) : []);
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search campaigns..."
          value={search}
          onChange={(e) => setFilters({ search: e.target.value || null })}
          className="max-w-xs"
        />
        <Select
          value={status}
          onValueChange={(value) => setFilters({ status: value })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="sending">Sending</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={sort}
          onValueChange={(value) => setFilters({ sort: value })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created_at">Created Date</SelectItem>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="updated_at">Last Updated</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setFilters({ order: order === 'asc' ? 'desc' : 'asc' })}
        >
          {order === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
        </Button>
      </div>

      <BulkActions 
        selectedRows={selectedRows} 
        onSuccess={() => setSelectedRows([])}
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={
                    campaigns.length > 0 && selectedRows.length === campaigns.length
                  }
                  onCheckedChange={(checked) => handleSelectAll(!!checked)}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Opens</TableHead>
              <TableHead>Clicks</TableHead>
              <TableHead className="w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                  No campaigns found. Create your first campaign to get started.
                </TableCell>
              </TableRow>
            )}
            {campaigns.map((campaign) => (
              <TableRow key={campaign.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedRows.includes(campaign.id)}
                    onCheckedChange={(checked) => 
                      handleRowSelect(campaign.id, !!checked)
                    }
                    aria-label="Select row"
                  />
                </TableCell>
                <TableCell className="font-medium">
                  <Link 
                    href={`/dashboard/campaigns/${campaign.id}`}
                    className="hover:underline"
                  >
                    {campaign.name}
                  </Link>
                </TableCell>
                <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDistanceToNow(new Date(campaign.created_at), { addSuffix: true })}
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
                      <SendButton campaignId={campaign.id} />
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