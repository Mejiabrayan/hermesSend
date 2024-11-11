'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Users, 
  BarChart, 
  MousePointerClick, 
  Pencil, 
  Send, 
  Trash,
  Mail,
  Clock,
  Search
} from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { CampaignEditForm } from './campaign-edit-form';
import { CampaignWithSends } from '../types';
import { DeleteCampaignDialog } from '../../_components/delete-campaign-dialog';
import { SendCampaignDialog } from '../../_components/send-campaign-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';

export function CampaignDetail({ campaign }: { campaign: CampaignWithSends }) {
  const [isEditing, setIsEditing] = useState(false);
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRecipients = campaign.campaign_sends?.filter(send => {
    const searchLower = searchQuery.toLowerCase();
    return (
      send.contacts?.email.toLowerCase().includes(searchLower) ||
      (send.contacts?.name?.toLowerCase() || '').includes(searchLower)
    );
  });

  if (isEditing) {
    return (
      <div className="space-y-6">
        <CampaignEditForm 
          campaign={campaign} 
          onCancelAction={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/campaigns">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{campaign.name}</h1>
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
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <Clock className="h-4 w-4" />
              Created {formatDistanceToNow(new Date(campaign.created_at), { addSuffix: true })}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {campaign.status === 'draft' && (
            <>
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="w-4 h-4 mr-2" />
                Edit Campaign
              </Button>
              <Button 
                onClick={() => setShowSendDialog(true)}
              >
                <Send className="w-4 h-4 mr-2" />
                Send Campaign
              </Button>
            </>
          )}
          <Button 
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash className="w-4 h-4 mr-2" />
            Delete Campaign
          </Button>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-12">
        {/* Left Column */}
        <div className="col-span-8 space-y-6">
          {/* Campaign Details */}
          <Card>
            <CardHeader>
              <CardTitle>Campaign Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium">Subject</div>
                <div className="flex items-center gap-2 mt-1">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">{campaign.subject}</p>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium mb-2">Content Preview</div>
                <div className="mt-2 rounded-md border p-6 bg-zinc-950/50">
                  <div
                    className="prose prose-sm prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: campaign.content }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="col-span-4 space-y-6">
          {/* Stats Overview */}
          <div className="grid gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-medium">Recipients</h3>
                  </div>
                  <div className="text-2xl font-bold">
                    {campaign.campaign_sends?.length || 0}
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-medium">Opens</h3>
                  </div>
                  <div className="text-2xl font-bold">
                    {campaign.opens_count || 0}
                    <span className="text-xs text-muted-foreground ml-2">
                      {campaign.campaign_sends?.length
                        ? `${Math.round(
                            ((campaign.opens_count || 0) /
                              campaign.campaign_sends.length) *
                              100
                          )}%`
                        : '0%'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MousePointerClick className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-medium">Clicks</h3>
                  </div>
                  <div className="text-2xl font-bold">
                    {campaign.clicks_count || 0}
                    <span className="text-xs text-muted-foreground ml-2">
                      {campaign.opens_count
                        ? `${Math.round(
                            ((campaign.clicks_count || 0) / (campaign.opens_count || 1)) *
                              100
                          )}%`
                        : '0%'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recipients List */}
          <Card>
            <CardHeader>
              <CardTitle>Recipients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search recipients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-2">
                  {filteredRecipients?.map((send) => (
                    <div
                      key={send.id}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/50"
                    >
                      <div>
                        <div className="font-medium text-sm">
                          {send.contacts?.name || 'No name'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {send.contacts?.email}
                        </div>
                      </div>
                      <Badge
                        variant={
                          send.status === 'sent'
                            ? 'default'
                            : send.status === 'failed'
                            ? 'destructive'
                            : 'secondary'
                        }
                      >
                        {send.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      <SendCampaignDialog
        open={showSendDialog}
        onOpenChange={setShowSendDialog}
        campaignId={campaign.id}
        campaignName={campaign.name}
        recipientCount={campaign.campaign_sends?.length || 0}
      />

      <DeleteCampaignDialog
        open={showDeleteDialog}
        onOpenChangeAction={setShowDeleteDialog}
        campaignId={campaign.id}
        campaignName={campaign.name}
      />
    </div>
  );
} 