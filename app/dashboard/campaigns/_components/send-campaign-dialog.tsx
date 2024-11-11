'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Send } from 'lucide-react';

interface SendCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaignId: string;
  campaignName: string;
  recipientCount?: number;
}

export function SendCampaignDialog({
  open,
  onOpenChangeAction,
  campaignId,
  campaignName,
}: SendCampaignDialogProps) {
  const [loading, setLoading] = useState(false);
  const [recipientCount, setRecipientCount] = useState(0);
  const { toast } = useToast();
  const router = useRouter();

  // Fetch recipient count when dialog opens
  useEffect(() => {
    if (open) {
      const fetchRecipients = async () => {
        try {
          const response = await fetch(`/api/campaigns/${campaignId}`);
          const data = await response.json();
          if (data.campaign?.campaign_sends) {
            setRecipientCount(data.campaign.campaign_sends.length);
          }
        } catch (error) {
          console.error('Failed to fetch recipients:', error);
        }
      };
      fetchRecipients();
    }
  }, [open, campaignId]);

  const handleSend = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/campaigns/${campaignId}/send`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to send campaign');

      toast({
        title: 'Campaign sending',    
        description: 'Your campaign is being sent to all recipients.',
      });
      
      router.refresh();
      onOpenChangeAction(false);
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to send campaign',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Campaign</DialogTitle>
          <DialogDescription>
            Are you sure you want to send &quot;{campaignName}&quot; to {recipientCount} recipients? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="rounded-lg border p-4 bg-zinc-950/50">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-full bg-zinc-900">
                <Send className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-medium">Ready to Send</h4>
                <p className="text-sm text-muted-foreground">
                  Campaign will be sent to {recipientCount} recipients
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant='outline'
            onClick={() => onOpenChangeAction(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            disabled={loading || recipientCount === 0}
          >
            {loading ? 'Sending...' : 'Send Campaign'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 