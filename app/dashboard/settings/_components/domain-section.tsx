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

interface DomainSectionProps {
  domains: Tables<'domains'>[];
}

export function DomainSection({ domains }: DomainSectionProps) {
  const [newDomain, setNewDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
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
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Email Domains</h3>
        <p className="text-sm text-muted-foreground">
          Add and verify your email sending domains.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
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
    </div>
  );
} 