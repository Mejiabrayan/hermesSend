'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, BarChart, MousePointerClick, Pencil, Send, Trash } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { CampaignEditForm } from './campaign-edit-form';
import { CampaignWithSends } from '../types';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { DeleteCampaignDialog } from '../../_components/delete-campaign-dialog';

export function CampaignDetail({ campaign }: { campaign: CampaignWithSends }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleResend = async () => {
    if (!confirm('Are you sure you want to resend this campaign?')) return;
    
    setIsResending(true);
    try {
      const response = await fetch(`/api/campaigns/${campaign.id}/resend`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to resend campaign');

      toast({
        title: 'Campaign resent',
        description: 'Your campaign is being sent to all recipients.',
      });
      
      router.refresh();
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to resend campaign',
        variant: 'destructive',
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleSend = async () => {
    if (!confirm('Are you sure you want to send this campaign?')) return;
    
    setIsSending(true);
    try {
      const response = await fetch(`/api/campaigns/${campaign.id}/send`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to send campaign');

      toast({
        title: 'Campaign sending',
        description: 'Your campaign is being sent to all recipients.',
      });
      
      router.refresh();
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to send campaign',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/campaigns">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{campaign.name}</h1>
            <p className="text-sm text-muted-foreground">
              Created {formatDistanceToNow(new Date(campaign.created_at), { addSuffix: true })}
            </p>
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
                onClick={handleSend}
                disabled={isSending}
              >
                <Send className="w-4 h-4 mr-2" />
                {isSending ? 'Sending...' : 'Send Campaign'}
              </Button>
            </>
          )}
          {['sent', 'failed'].includes(campaign.status) && (
            <Button 
              onClick={handleResend}
              disabled={isResending}
            >
              <Send className="w-4 h-4 mr-2" />
              {isResending ? 'Resending...' : 'Resend Campaign'}
            </Button>
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

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recipients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaign.campaign_sends?.length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Opens</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaign.opens_count || 0}</div>
            <p className="text-xs text-muted-foreground">
              {campaign.campaign_sends?.length
                ? `${Math.round(
                    ((campaign.opens_count || 0) /
                      campaign.campaign_sends.length) *
                      100
                  )}% open rate`
                : 'No recipients'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clicks</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaign.clicks_count || 0}</div>
            <p className="text-xs text-muted-foreground">
              {campaign.opens_count
                ? `${Math.round(
                    ((campaign.clicks_count || 0) / (campaign.opens_count || 1)) *
                      100
                  )}% click rate`
                : 'No opens'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Details */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Campaign Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium">Status</div>
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
            <div>
              <div className="text-sm font-medium">Subject</div>
              <p className="text-sm text-muted-foreground">{campaign.subject}</p>
            </div>
            <div>
              <div className="text-sm font-medium">Content Preview</div>
              <div className="mt-2 rounded-md border p-4">
                <div
                  className="prose prose-sm prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: campaign.content }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recipients</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {campaign.campaign_sends?.map((send) => (
              <div
                key={send.id}
                className="flex items-center justify-between py-2"
              >
                <div>
                  <div className="font-medium">
                    {send.contacts?.name || 'No name'}
                  </div>
                  <div className="text-sm text-muted-foreground">
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
          </CardContent>
        </Card>
      </div>

      <DeleteCampaignDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        campaignId={campaign.id}
        campaignName={campaign.name}
      />
    </div>
  );
} 