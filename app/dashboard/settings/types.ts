export interface DNSRecord {
  type: string;
  host: string;
  value: string;
  ttl: number;
  description?: string;
}

export interface Domain {
  id: string;
  domain: string;
  status: string;
  created_at: string | null;
  updated_at: string | null;
  verified_at: string | null;
  user_id: string;
  dkim_verified: boolean | null;
  spf_verified: boolean | null;
  dmarc_verified: boolean | null;
  dns_records: DNSRecord[] | null;
} 