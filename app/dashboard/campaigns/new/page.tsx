'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Wand2, Send, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NewCampaign() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.get('name'),
          subject: formData.get('subject'),
          content: content,
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
        title: 'Campaign created!',
        description: 'Your campaign has been created successfully.',
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

  const handleAIAssist = async () => {
    // We'll implement this later
    toast({
      title: "Coming soon!",
      description: "AI assistance will be available soon.",
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
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
                      placeholder="Q4 Newsletter"
                      required 
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                      Email Subject
                    </label>
                    <div className="flex gap-2">
                      <Input 
                        id="subject" 
                        name="subject" 
                        placeholder="Your Next Newsletter Is Here!"
                        required 
                      />
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={handleAIAssist}
                      >
                        <Wand2 className="w-4 h-4" />
                      </Button>
                    </div>
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
                  
                  <TabsContent value="write" className="space-y-4">
                    <div className="flex gap-2 mb-2">
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={handleAIAssist}
                      >
                        <Wand2 className="w-4 h-4 mr-2" />
                        AI Assist
                      </Button>
                    </div>
                    <Textarea 
                      id="content" 
                      name="content" 
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Write your email content here..."
                      className="min-h-[400px]"
                      required 
                    />
                  </TabsContent>
                  
                  <TabsContent value="preview">
                    <div className="prose prose-invert max-w-none min-h-[400px] p-4 border rounded-lg">
                      {content || <p className="text-muted-foreground">Your preview will appear here...</p>}
                    </div>
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
              <Button type="submit" disabled={loading}>
                <Send className="w-4 h-4 mr-2" />
                {loading ? 'Creating...' : 'Create Campaign'}
              </Button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6 ring-1 ring-blue-500 rounded-lg bg-blue-500/10">
              <h3 className="font-semibold mb-4">Tips for Great Campaigns</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>• Keep your subject lines clear and engaging</li>
                <li>• Personalize content for better engagement</li>
                <li>• Use a clear call-to-action</li>
                <li>• Test your emails before sending</li>
                <li>• Optimize for mobile devices</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">Campaign Settings</h3>
              <p className="text-sm text-muted-foreground">
                Additional settings will be available soon...
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 