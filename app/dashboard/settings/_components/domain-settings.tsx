'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CopyButton } from '@/components/copy-button';
import { Badge } from '@/components/ui/badge';
import { Tables } from '@/utils/database.types';
import { useRouter } from 'next/navigation';

interface DomainSettingsProps {
  domains: Tables<'domains'>[];
}

export function DomainSettings({ domains }: DomainSettingsProps) {
  const [newDomain, setNewDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (domains.length > 0) {
        toast({
          title: 'Domain limit reached',
          description: 'Free plan allows only one domain. Please upgrade for more.',
          variant: 'destructive',
        });
        return;
      }

      const response = await fetch('/api/domains', {
        method: 'POST',
        body: JSON.stringify({ domain: newDomain }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to add domain');

      toast({
        title: 'Domain added',
        description: 'Please verify your domain by adding the DNS records.',
      });

      setNewDomain('');
      router.refresh();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add domain',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Domains</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleAddDomain} className="flex gap-2">
          <Input
            placeholder="mydomain.com"
            value={newDomain}
            onChange={(e) => setNewDomain(e.target.value)}
          />
          <Button type="submit" disabled={loading}>
            Add Domain
          </Button>
        </form>

        <div className="space-y-4">
          {domains.map((domain) => (
            <div key={domain.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{domain.domain}</h3>
                <Badge variant={domain.status === 'verified' ? 'default' : 'secondary'}>
                  {domain.status}
                </Badge>
              </div>
              {domain.dns_records && (
                <div className="space-y-2">
                  {(domain.dns_records as any[]).map((record) => (
                    <div key={record.type} className="text-sm">
                      <div className="flex items-center justify-between">
                        <span>{record.type}</span>
                        <CopyButton value={record.value} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 