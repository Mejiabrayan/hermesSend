'use client';

import { useState } from 'react';
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
import { useQuery } from '@tanstack/react-query';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';

interface SendCampaignDialogProps {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  campaignId: string;
  campaignName: string;
}

async function getCampaignRecipients(campaignId: string) {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from('campaign_sends')
    .select(`
      id,
      contact_id,
      contacts (
        id,
        email,
        name
      )
    `)
    .eq('campaign_id', campaignId);

  if (error) throw error;
  return data || [];
}

export function SendCampaignDialog({
  open,
  onOpenChangeAction,
  campaignId,
  campaignName,
}: SendCampaignDialogProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const { data: recipients = [] } = useQuery({
    queryKey: ['campaign-recipients', campaignId],
    queryFn: () => getCampaignRecipients(campaignId),
    enabled: open, // Only fetch when dialog is open
  });

  const handleSend = async () => {
    if (recipients.length === 0) {
      toast({
        title: 'Error',
        description: 'No recipients selected',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/campaigns/${campaignId}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      toast({
        title: 'Campaign Sent',    
        description: `Successfully sent to ${data.successfulSends} recipients${
          data.failedSends > 0 ? `, ${data.failedSends} failed` : ''
        }`,
      });
      
      router.refresh();
      onOpenChangeAction(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to send campaign',
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
            Send &quot;{campaignName}&quot; to {recipients.length} recipients?
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border p-4 bg-zinc-950/50">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-full bg-zinc-900">
              <Send className="h-4 w-4" />
            </div>
            <div>
              <h4 className="font-medium">Ready to Send</h4>
              <p className="text-sm text-muted-foreground">
                Campaign will be sent to {recipients.length} recipients via AWS SES
              </p>
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
            disabled={loading || recipients.length === 0}
          >
            {loading ? 'Sending...' : 'Send Campaign'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 