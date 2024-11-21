'use server'

import { createServer } from '@/utils/supabase/server';
import { 
  SESClient, 
  VerifyDomainIdentityCommand,
  GetIdentityVerificationAttributesCommand, 
  VerifyDomainDkimCommand, 
  DeleteIdentityCommand,
  type VerificationStatus 
} from "@aws-sdk/client-ses";
import { type DNSRecord } from '../types';
import { type Json } from '@/utils/database.types';

// Define proper types for our DNS records
interface DomainVerificationResult {
  success: boolean;
  dnsRecords?: DNSRecord[];
  verificationToken?: string;
  error?: string;
}

const ses = new SESClient({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function verifyDomain(domain: string, save = false): Promise<DomainVerificationResult> {
  const supabase = await createServer();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }
  
  try {
    const verifyCommand = new VerifyDomainIdentityCommand({
      Domain: domain
    });
    
    const { VerificationToken } = await ses.send(verifyCommand);
    
    const verifyDkimCommand = new VerifyDomainDkimCommand({
      Domain: domain
    });

    const { DkimTokens = [] } = await ses.send(verifyDkimCommand);
    
    // Convert DNSRecord[] to Json type for database
    const dnsRecords: Json = DkimTokens.map(token => ({
      type: 'CNAME',
      host: `${token}._domainkey.${domain}`,
      value: `${token}.dkim.amazonses.com`,
      ttl: 3600,
      description: `DKIM record ${token}`
    })).concat([
      {
        type: 'TXT',
        host: `_amazonses.${domain}`,
        value: VerificationToken || '',
        ttl: 3600,
        description: 'Domain verification record'
      },
      {
        type: 'TXT',
        host: domain,
        value: 'v=spf1 include:amazonses.com ~all',
        ttl: 3600,
        description: 'SPF record to authorize Amazon SES'
      },
      {
        type: 'TXT',
        host: `_dmarc.${domain}`,
        value: `v=DMARC1; p=quarantine; pct=100; rua=mailto:dmarc-reports@${domain}`,
        ttl: 3600,
        description: 'DMARC policy'
      }
    ]);

    if (save) {
      const { error } = await supabase
        .from('domains')
        .insert({
          domain,
          dns_records: dnsRecords,
          status: 'verifying',
          user_id: user.id,
        });

      if (error) throw error;
    }

    return { 
      success: true, 
      dnsRecords: dnsRecords as unknown as DNSRecord[],
      verificationToken: VerificationToken 
    };

  } catch (error) {
    console.error('Domain verification error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to verify domain'
    };
  }
}

export async function saveDomain({
  domain,
  dnsRecords,
  status = 'verified'
}: {
  domain: string;
  dnsRecords: DNSRecord[];
  verificationToken: string;
  status?: 'verifying' | 'verified' | 'failed';
}) {
  const supabase = await createServer();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const { error } = await supabase
      .from('domains')
      .upsert({
        domain,
        dns_records: dnsRecords as unknown as Json,
        status,
        user_id: user.id,
        verified_at: status === 'verified' ? new Date().toISOString() : null
      });

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Save domain error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to save domain'
    };
  }
}

export async function getDomainStatus(domain: string): Promise<{
  success: boolean;
  status: VerificationStatus | null;
  error?: string;
}> {
  'use server'
  
  try {
    const command = new GetIdentityVerificationAttributesCommand({
      Identities: [domain]
    });
    
    const response = await ses.send(command);
    const status = response.VerificationAttributes?.[domain]?.VerificationStatus ?? null;

    if (status === 'Success') {
      const supabase = await createServer();
      await supabase
        .from('domains')
        .update({ 
          status: 'verified',
          verified_at: new Date().toISOString()
        })
        .eq('domain', domain);
    }

    return { success: true, status };
  } catch (error) {
    console.error('Domain status check error:', error);
    return { success: false, status: null };
  }
}

export async function cancelVerification(domain: string) {
  const supabase = await createServer();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    // First, delete from AWS SES
    const deleteIdentityCommand = new DeleteIdentityCommand({
      Identity: domain
    });
    
    await ses.send(deleteIdentityCommand);

    // Then remove from our database
    const { error } = await supabase
      .from('domains')
      .delete()
      .eq('domain', domain)
      .eq('user_id', user.id)
      .eq('status', 'verifying'); // Only allow canceling pending verifications

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Cancel verification error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to cancel verification'
    };
  }
} 