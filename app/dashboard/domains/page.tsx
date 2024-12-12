import { createServer } from '@/utils/supabase/server';
import { DomainOnboarding } from '../settings/_component/domain-onboarding';
import { DomainSettings } from '../settings/_component/domain-settings';
import { redirect } from 'next/navigation';
import type { Domain, DNSRecord } from '../settings/types';

export default async function DomainsPage() {
  const supabase = await createServer();
  
  // Check auth first
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    redirect('/sign-in');
  }

  // Get domains with proper typing
  const { data: dbDomains, error: domainsError } = await supabase
    .from('domains')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (domainsError) {
    console.error('Error fetching domains:', domainsError);
    throw domainsError;
  }

  // Transform domains to match the component's expected type
  const domains: Domain[] = (dbDomains || []).map(domain => {
    let parsedDnsRecords: DNSRecord[] | null = null;
    
    // Safely parse DNS records
    if (domain.dns_records) {
      try {
        // Handle both string and object cases
        if (typeof domain.dns_records === 'string') {
          parsedDnsRecords = JSON.parse(domain.dns_records);
        } else {
          // If it's already an object, cast it
          parsedDnsRecords = domain.dns_records as unknown as DNSRecord[];
        }
      } catch (error) {
        console.error('Error parsing DNS records:', error);
        parsedDnsRecords = null;
      }
    }

    return {
      id: domain.id,
      domain: domain.domain,
      status: domain.status,
      created_at: domain.created_at,
      updated_at: domain.updated_at,
      verified_at: domain.verified_at,
      user_id: domain.user_id,
      dkim_verified: domain.dkim_verified,
      spf_verified: domain.spf_verified,
      dmarc_verified: domain.dmarc_verified,
      dns_records: parsedDnsRecords
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Email Domains</h2>
        <p className="text-muted-foreground">
          Manage your email sending domains and DNS settings.
        </p>
      </div>

      {domains.length === 0 ? (
        <DomainOnboarding />
      ) : (
        <DomainSettings domains={domains} />
      )}
    </div>
  );
} 