'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface BulkActionsProps {
  selectedRows: string[];
  onSuccess?: () => void;
}

export function BulkActions({ selectedRows, onSuccess }: BulkActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleBulkDelete = async () => {
    setLoading(true);
    try {
      // Delete each selected campaign
      await Promise.all(
        selectedRows.map((id) =>
          fetch(`/api/campaigns/${id}`, {
            method: 'DELETE',
          })
        )
      );

      toast({
        title: 'Campaigns deleted',
        description: `Successfully deleted ${selectedRows.length} campaigns.`,
      });
      
      onSuccess?.();
      router.refresh();
      setShowDeleteDialog(false);
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to delete campaigns',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (selectedRows.length === 0) return null;

  return (
    <>
      <div className="flex items-center gap-2 p-4 bg-zinc-900 rounded-lg">
        <p className="text-sm">
          <span className="font-medium">{selectedRows.length}</span> items selected
        </p>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setShowDeleteDialog(true)}
        >
          <Trash className="h-4 w-4 mr-2" />
          Delete Selected
        </Button>
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Campaigns</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedRows.length} campaigns? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleBulkDelete}
              disabled={loading}
            >
              {loading ? 'Deleting...' : 'Delete Campaigns'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 