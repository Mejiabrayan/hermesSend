'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Save, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Tables } from '@/utils/database.types';
import { RichTextEditor } from '../../_components/rich-text-editor';
import { RecipientSelector } from '../../_components/recipient-selector';

interface CampaignEditFormProps {
  campaign: Tables<'campaigns'> & {
    campaign_sends?: {
      contact_id: string;
    }[];
  };
  onCancelAction: () => void;
}

export function CampaignEditForm({ campaign, onCancelAction }: CampaignEditFormProps) {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState(campaign.content);
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>(
    campaign.campaign_sends?.map(send => send.contact_id) || []
  );
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const response = await fetch(`/api/campaigns/${campaign.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          name: formData.get('name'),
          subject: formData.get('subject'),
          content: content,
          recipients: selectedRecipients,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to update campaign');

      toast({
        title: 'Campaign updated',
        description: 'Your changes have been saved.',
      });

      router.refresh();
      onCancelAction();
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to update campaign',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Campaign Name
              </label>
              <Input 
                id="name" 
                name="name" 
                defaultValue={campaign.name}
                required 
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">
                Email Subject
              </label>
              <Input 
                id="subject" 
                name="subject" 
                defaultValue={campaign.subject}
                required 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Recipients
              </label>
              <RecipientSelector
                selectedRecipients={selectedRecipients}
                onRecipientsChange={setSelectedRecipients}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="write">
            <TabsList className="mb-4">
              <TabsTrigger value="write">Write</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            
            <TabsContent value="write">
              <RichTextEditor 
                content={content}
                onChangeAction={setContent}
              />
            </TabsContent>
            
            <TabsContent value="preview">
              <div 
                className="prose prose-invert max-w-none min-h-[400px] p-4 border rounded-lg"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button 
          type="button" 
          variant="outline"
          onClick={onCancelAction}
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
} 