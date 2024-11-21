export interface DNSRecord {
  type: 'TXT' | 'MX' | 'CNAME';
  host: string;
  value: string;
  ttl: number;
  description: string;
}

export type DomainStatus = 'verifying' | 'verified' | 'failed' | 'pending';

export interface DomainData {
  name: string;
  dnsRecords: DNSRecord[];
  verificationToken?: string;
} 