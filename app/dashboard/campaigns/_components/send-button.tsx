'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { SendCampaignDialog } from './send-campaign-dialog';

interface SendButtonProps {
  campaignId: string;
  campaignName: string;
  recipientCount?: number;
}

export function SendButton({ campaignId, campaignName, recipientCount = 0 }: SendButtonProps) {
  const [showSendDialog, setShowSendDialog] = useState(false);

  return (
    <>
      <Button
        size="sm"
        onClick={() => setShowSendDialog(true)}
      >
        <Send className="w-4 h-4 mr-2" />
        Send
      </Button>

      <SendCampaignDialog
        open={showSendDialog}
        onOpenChange={setShowSendDialog}
        campaignId={campaignId}
        campaignName={campaignName}
        recipientCount={recipientCount}
      />
    </>
  );
} 