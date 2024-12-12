'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { SendCampaignDialog } from './send-campaign-dialog';

interface SendButtonProps {
  campaignId: string;
  campaignName: string;
  recipientCount: number;
}

export function SendButton({ campaignId, campaignName, recipientCount }: SendButtonProps) {
  const [showSendDialog, setShowSendDialog] = useState(false);

  return (
    <>
      <Button
        size="sm"
        onClick={() => setShowSendDialog(true)}
        disabled={recipientCount === 0}
        title={recipientCount === 0 ? "Add recipients to send campaign" : "Send campaign"}
      >
        <Send className="w-4 h-4 mr-2" />
        Send {recipientCount > 0 && `(${recipientCount})`}
      </Button>

      <SendCampaignDialog
        open={showSendDialog}
        onOpenChangeAction={setShowSendDialog}
        campaignId={campaignId}
        campaignName={campaignName}
      />
    </>
  );
}