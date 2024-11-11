'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export function SendButton({ campaignId }: { campaignId: string }) {
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSend = async () => {
    if (!confirm('Are you sure you want to send this campaign?')) return;
    
    setIsSending(true);
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

  return (
    <Button
      size="sm"
      onClick={handleSend}
      disabled={isSending}
    >
      <Send className="w-4 h-4 mr-2" />
      {isSending ? 'Sending...' : 'Send'}
    </Button>
  );
} 