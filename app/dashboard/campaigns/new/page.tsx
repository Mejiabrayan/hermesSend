'use client';

import { Suspense } from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Send, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { RichTextEditor } from '../_components/rich-text-editor';
import { RecipientSelector } from '../_components/recipient-selector';
import { useQueryStates } from 'nuqs';
import { parseAsString } from 'nuqs';

function NewCampaignForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const router = useRouter();
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [{ step }, setStep] = useQueryStates({
    step: parseAsString.withDefault('write'),
  }, {
    history: 'replace',
    shallow: true,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>, shouldSend = false) => {
    e.preventDefault();
    setLoading(true);

    try {
      const form = e.currentTarget instanceof HTMLFormElement 
        ? e.currentTarget 
        : e.currentTarget.closest('form');
      
      if (!form) {
        throw new Error('Form not found');
      }

      const formData = new FormData(form);
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.get('name'),
          subject: formData.get('subject'),
          content,
          recipients: selectedRecipients,
          sendImmediately: shouldSend,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create campaign');
      }

      toast({
        title: shouldSend ? 'Campaign created and sent!' : 'Campaign created!',
        description: shouldSend 
          ? `Successfully sent to ${data.successfulSends} recipients`
          : 'Your campaign has been created successfully.',
      });

      router.push('/dashboard/campaigns');
      router.refresh();

    } catch (error) {
      console.error('Campaign creation error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create campaign',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const canSend = selectedRecipients.length > 0 && content.trim().length > 0;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/campaigns">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Create New Campaign</h1>
          <p className="text-sm text-muted-foreground">
            Create and send emails to your audience
          </p>
        </div>
      </div>

      <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-4 max-w-xl">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Campaign Name
                </label>
                <Input 
                  id="name" 
                  name="name" 
                  placeholder="Q4 Newsletter"
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
                  placeholder="Your Next Newsletter Is Here!"
                  required 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Recipients
                </label>
                <RecipientSelector
                  selectedRecipients={selectedRecipients}
                  onRecipientsChangeAction={setSelectedRecipients}
                />
                {selectedRecipients.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {selectedRecipients.length} recipients selected
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <Tabs value={step} onValueChange={(value) => setStep({ step: value })}>
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
            asChild
          >
            <Link href="/dashboard/campaigns">Cancel</Link>
          </Button>
          <Button 
            type="submit" 
            variant="outline"
            disabled={loading}
          >
            Save as Draft
          </Button>
          <Button 
            type="button"
            disabled={loading || !canSend}
            onClick={(e) => handleSubmit(e, true)}
            title={!canSend ? "Add content and recipients to send" : "Create and send campaign"}
          >
            <Send className="w-4 h-4 mr-2" />
            {loading ? 'Sending...' : 'Create & Send'}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function NewCampaignPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewCampaignForm />
    </Suspense>
  );
} 