'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface DeleteCampaignDialogProps {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  campaignId: string;
  campaignName: string;
  onSuccess?: () => void;
}

export function DeleteCampaignDialog({
  open,
  onOpenChangeAction,
  campaignId,
  campaignName,
  onSuccess,
}: DeleteCampaignDialogProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/campaigns/${campaignId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete campaign');

      toast({
        title: 'Campaign deleted',
        description: 'The campaign has been deleted successfully.',
      });

      onSuccess?.();
      router.refresh();
      onOpenChangeAction(false);

      // If we're on the campaign detail page, redirect to the campaigns list
      if (window.location.pathname.includes(campaignId)) {
        router.push('/dashboard/campaigns');
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to delete campaign',
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
          <DialogTitle>Delete Campaign</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete &quot;{campaignName}&quot;? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant='outline'
            onClick={() => onOpenChangeAction(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant='destructive'
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete Campaign'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
