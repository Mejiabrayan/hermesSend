'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { verifyDomain } from '../domains/actions';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/copy-button";
import { useQuery } from '@tanstack/react-query';
import { Database } from '@/utils/database.types';

// Use the database type as base
type DbDomain = Database['public']['Tables']['domains']['Row'];

interface DNSRecord {
  type: string;
  host: string;
  value: string;
  ttl: number;
  description?: string;
}

// Extend the database type with parsed DNS records
interface Domain extends Omit<DbDomain, 'dns_records'> {
  dns_records: DNSRecord[] | null;
}

interface DomainSettingsProps {
  domains: Domain[];
}

export function DomainSettings({ domains: initialDomains }: DomainSettingsProps) {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const { data: domains } = useQuery({
    queryKey: ['domains'],
    queryFn: async () => {
      const response = await fetch('/api/domains');
      if (!response.ok) throw new Error('Failed to fetch domains');
      const data = await response.json();
      return data.map((domain: DbDomain) => {
        let parsedDnsRecords: DNSRecord[] | null = null;
        try {
          if (domain.dns_records) {
            const records = typeof domain.dns_records === 'string' 
              ? JSON.parse(domain.dns_records) 
              : domain.dns_records;
              
            // Validate that records is an array and each record has the required properties
            if (Array.isArray(records) && records.every(record => 
              typeof record === 'object' && record !== null &&
              'type' in record && 'host' in record && 
              'value' in record && 'ttl' in record
            )) {
              parsedDnsRecords = records as DNSRecord[];
            }
          }
        } catch (error) {
          console.error('Error parsing DNS records:', error);
        }
        return {
          ...domain,
          dns_records: parsedDnsRecords,
          // Ensure status is properly set
          status: domain.dkim_verified && domain.spf_verified && domain.dmarc_verified 
            ? 'verified' 
            : domain.status
        };
      });
    },
    initialData: initialDomains,
    refetchInterval: 10000 // Check every 10 seconds
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await verifyDomain(domain);
      if (!result.success) throw new Error(result.error);

      toast({
        title: 'Domain added',
        description: 'Please add the DNS records to verify your domain.',
      });

      setDomain('');
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to add domain',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Domain Settings</CardTitle>
          <CardDescription>
            Add and verify your domain to send emails from your own domain
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex gap-4">
            <Input
              placeholder="yourdomain.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="max-w-sm"
            />
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Domain'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {domains.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Domains</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Domain</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Verification</TableHead>
                  <TableHead>DNS Records</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {domains.map((domain: Domain) => (
                  <TableRow key={domain.id}>
                    <TableCell>{domain.domain}</TableCell>
                    <TableCell>
                      <Badge
                        variant={domain.status === 'verified' ? 'default' : 'secondary'}
                      >
                        {domain.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <Badge variant={domain.dkim_verified ? 'default' : 'secondary'}>
                            DKIM
                          </Badge>
                          <Badge variant={domain.spf_verified ? 'default' : 'secondary'}>
                            SPF
                          </Badge>
                          <Badge variant={domain.dmarc_verified ? 'default' : 'secondary'}>
                            DMARC
                          </Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {domain.dns_records?.map((record, i) => (
                        <div key={i} className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{record.type}</Badge>
                          <span className="text-sm">{record.host}</span>
                          <CopyButton value={record.value} />
                        </div>
                      ))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 