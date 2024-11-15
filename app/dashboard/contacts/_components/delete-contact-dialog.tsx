"use client";

import { useState } from "react";
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
import { Tables } from "@/utils/database.types";
import { useRouter } from "next/navigation";
import { Trash } from "lucide-react";

interface DeleteContactDialogProps {
  contact: Tables<'contacts'>;
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
}

export function DeleteContactDialog({
  contact,
  open,
  onOpenChangeAction,
}: DeleteContactDialogProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/contacts/${contact.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete contact');

      toast({
        title: 'Contact deleted',
        description: 'The contact has been deleted successfully.',
      });

      router.refresh();
      onOpenChangeAction(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete contact',
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
          <DialogTitle>Delete Contact</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {contact.name || contact.email}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="rounded-lg border p-4 bg-destructive/10">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-full bg-destructive/20">
                <Trash className="h-4 w-4 text-destructive" />
              </div>
              <div>
                <h4 className="font-medium text-destructive">Warning</h4>
                <p className="text-sm text-muted-foreground">
                  This will permanently delete the contact and remove them from all campaigns.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChangeAction(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete Contact'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 