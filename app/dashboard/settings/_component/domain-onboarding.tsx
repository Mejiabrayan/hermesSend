'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  CheckCircle2,
  Circle,
  CircleDot,
  Info,
  Mail,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tables } from '@/utils/database.types';
import { verifyDomain, getDomainStatus, saveDomain } from '../domains/actions';
import { CopyButton } from '@/components/copy-button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { parseAsString } from 'nuqs';
import { useQueryState } from 'nuqs';
import { type DNSRecord } from '../types';
import { toast } from '@/hooks/use-toast';

interface DomainOnboardingProps {
  domain?: Tables<'domains'>;
  initialVerificationStatus?: string | null;
  initialDomain?: string;
}

type Step = 'input' | 'records' | 'verify' | 'complete';

interface DomainData {
  name: string;
  dnsRecords: DNSRecord[];
  verificationToken?: string;
}

// Add a helper component for DNS records table
function DNSRecordsTable({ records }: { records: DNSRecord[] }) {
  return (
    <div className='rounded-lg border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Host</TableHead>
            <TableHead>Value / Points to</TableHead>
            <TableHead>TTL</TableHead>
            <TableHead className='w-[100px]'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record, i) => (
            <TableRow key={i}>
              <TableCell>
                <Badge variant='outline'>{record.type}</Badge>
              </TableCell>
              <TableCell>
                <div className='flex items-center gap-2'>
                  <code className='relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm'>
                    {record.host}
                  </code>
                  <div className="text-muted-foreground hover:text-foreground">
                    <CopyButton 
                      value={record.host} 
                      variant="outline"
                      size="sm"
                    />
                  </div>
                </div>
              </TableCell>
              <TableCell className='font-mono text-sm'>
                <div className='flex items-center gap-2'>
                  <span className='truncate max-w-[300px]'>{record.value}</span>
                  <div className="text-muted-foreground hover:text-foreground">
                    <CopyButton 
                      value={record.value} 
                      variant="outline"
                      size="sm"
                    />
                  </div>
                </div>
              </TableCell>
              <TableCell>{record.ttl}s</TableCell>
              <TableCell>
                <div className='flex items-center gap-2'>
                  <Button
                    variant='ghost'
                    size='icon'
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `Type: ${record.type}\nHost: ${record.host}\nValue: ${record.value}\nTTL: ${record.ttl}`
                      );
                      toast({
                        title: 'Copied',
                        description: 'DNS record copied to clipboard',
                      });
                    }}
                  >
                    <Copy className='h-4 w-4' />
                  </Button>
                  {record.description && (
                    <Button
                      variant='ghost'
                      size='icon'
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => {
                        toast({
                          title: 'Info',
                          description: record.description,
                        });
                      }}
                    >
                      <Info className='h-4 w-4' />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function DomainOnboarding({
  domain,
  initialVerificationStatus,
  initialDomain,
}: DomainOnboardingProps) {
  const [currentStep, setCurrentStep] = useState<Step>(() => {
    if (
      domain?.status === 'verified' ||
      initialVerificationStatus === 'Success'
    ) {
      return 'complete';
    }
    if (domain?.status === 'verifying') {
      return 'verify';
    }
    return 'input';
  });

  const [domainData, setDomainData] = useState({
    name: domain?.domain || initialDomain || '',
    dnsRecords: (domain?.dns_records as unknown as DNSRecord[]) || [],
  });

  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const [domainState, setDomainState] = useQueryState(
    'verifying_domain',
    parseAsString.withDefault('')
  );

  const [testEmail, setTestEmail] = useState('');
  const [sendingTest, setSendingTest] = useState(false);

  const steps = [
    { id: 'input', label: 'Add Domain' },
    { id: 'records', label: 'DNS Records' },
    { id: 'verify', label: 'Verify' },
    { id: 'complete', label: 'Complete' },
  ];

  // Use this instead of local state
  useEffect(() => {
    if (domainState) {
      setDomainData((prev: DomainData) => ({
        ...prev,
        name: domainState,
      }));
      setCurrentStep('verify');
    }
  }, [domainState]);

  // Modified to save domain status immediately
  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await verifyDomain(domainData.name, true);
      if (!result.success) throw new Error(result.error);

      if (result.dnsRecords) {
        setDomainData((prev) => ({
          ...prev,
          dnsRecords: result.dnsRecords as DNSRecord[],
          verificationToken: result.verificationToken || undefined,
        }));

        await saveDomain({
          domain: domainData.name,
          dnsRecords: result.dnsRecords as DNSRecord[],
          verificationToken: result.verificationToken || '',
          status: 'verifying',
        });

        setCurrentStep('records');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to generate DNS records',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Modified to handle background verification better
  const handleContinueInBackground = () => {
    setDomainState(domainData.name);
    router.push('/dashboard');
  };

  const handleBack = (step: Step) => {
    setCurrentStep(step);
  };

  const { data: domainStatus } = useQuery({
    queryKey: ['domain-status', domainData.name],
    queryFn: async () => {
      const response = await fetch(
        `/api/domains/status?domain=${domainData.name}`
      );
      if (!response.ok) throw new Error('Failed to check domain status');
      const data = await response.json();
      return data.status;
    },
    enabled: currentStep === 'verify',
    refetchInterval: 5000,
    retry: true,
    retryDelay: 2000,
  });

  // Watch for status changes
  useEffect(() => {
    if (domainStatus === 'verified') {
      setCurrentStep('complete');
      toast({
        title: 'Domain Verified!',
        description: 'Your domain has been successfully verified.',
      });
    } else if (domainStatus === 'failed') {
      toast({
        title: 'Verification Failed',
        description: 'Please check your DNS records and try again.',
        variant: 'destructive',
      });
    }
  }, [domainStatus, toast]);

  const { data: verificationStatus } = useQuery({
    queryKey: ['domain-verification', domainData.name],
    queryFn: async () => {
      const result = await getDomainStatus(domainData.name);
      if (result.success && result.status === 'Success') {
        // Update database and UI immediately when verified
        await saveDomain({
          domain: domainData.name,
          dnsRecords: domainData.dnsRecords,
          verificationToken: '',
          status: 'verified',
        });

        // Move to complete step when verified
        setCurrentStep('complete');
        toast({
          title: 'Domain Verified!',
          description: 'Your domain has been successfully verified.',
        });
      }
      return result.status;
    },
    enabled: currentStep === 'verify' || currentStep === 'records',
    refetchInterval: 2000, // Check every 2 seconds
    retry: true,
    retryDelay: 1000,
  });

  // Watch for verification status changes
  useEffect(() => {
    if (verificationStatus === 'Success') {
      setCurrentStep('verify');
    }
  }, [verificationStatus]);

  const handleTestEmail = async () => {
    if (!testEmail) {
      toast({
        title: 'Error',
        description: 'Please enter a recipient email address',
        variant: 'destructive',
      });
      return;
    }

    setSendingTest(true);
    try {
      const response = await fetch('/api/email/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientEmail: testEmail,
          domain: domainData.name,
        }),
      });

      if (!response.ok) throw new Error('Failed to send test email');

      toast({
        title: 'Test Email Sent!',
        description: `Check ${testEmail} for the test email`,
      });
      setTestEmail('');
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to send test email',
        variant: 'destructive',
      });
    } finally {
      setSendingTest(false);
    }
  };

  return (
    <div className='space-y-8'>
      {/* Progress Steps */}
      <div className='flex justify-between'>
        {steps.map((step, i) => (
          <div key={step.id} className='flex items-center'>
            <div className='flex flex-col items-center'>
              {currentStep === step.id ? (
                <CircleDot className='h-6 w-6 text-primary' />
              ) : currentStep === 'complete' &&
                steps.findIndex((s) => s.id === currentStep) >= i ? (
                <CheckCircle2 className='h-6 w-6 text-primary' />
              ) : (
                <Circle className='h-6 w-6 text-muted-foreground' />
              )}
              <span
                className={cn(
                  'text-sm mt-2',
                  currentStep === step.id
                    ? 'text-primary font-medium'
                    : 'text-muted-foreground'
                )}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className='w-full mx-4 h-[2px] bg-border' />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card>
        {currentStep === 'input' && (
          <>
            <CardHeader>
              <CardTitle>Add Your Domain</CardTitle>
              <CardDescription>
                Enter your domain name to start the verification process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddDomain} className='space-y-4'>
                <Input
                  placeholder='yourdomain.com'
                  value={domainData.name}
                  onChange={(e) =>
                    setDomainData((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
                <Button type='submit' disabled={loading}>
                  {loading ? 'Generating Records...' : 'Continue'}
                </Button>
              </form>
            </CardContent>
          </>
        )}

        {currentStep === 'records' && (
          <>
            <CardHeader>
              <CardTitle>Add DNS Records</CardTitle>
              <CardDescription>
                Add these records to your domain&apos;s DNS settings
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <DNSRecordsTable records={domainData.dnsRecords} />

              <Alert>
                <Info className='h-4 w-4' />
                <AlertTitle>DNS Propagation</AlertTitle>
                <AlertDescription className='space-y-4'>
                  <p>
                    DNS changes can take up to 48 hours to propagate worldwide.
                    However, it usually takes 15-30 minutes.
                  </p>
                  <div className='flex flex-col space-y-2'>
                    <p className='font-medium'>Common DNS providers:</p>
                    <div className='flex flex-wrap gap-2'>
                      {[
                        {
                          name: 'GoDaddy',
                          url: 'https://dcc.godaddy.com/manage-dns',
                        },
                        {
                          name: 'Namecheap',
                          url: 'https://ap.www.namecheap.com/domains/domaincontrolpanel',
                        },
                        {
                          name: 'Cloudflare',
                          url: 'https://dash.cloudflare.com',
                        },
                        {
                          name: 'Route53',
                          url: 'https://console.aws.amazon.com/route53',
                        },
                      ].map((provider) => (
                        <Button
                          key={provider.name}
                          variant='outline'
                          size='sm'
                          onClick={() => window.open(provider.url, '_blank')}
                        >
                          {provider.name}
                          <ExternalLink className='ml-2 h-3 w-3' />
                        </Button>
                      ))}
                    </div>
                  </div>
                </AlertDescription>
              </Alert>

              <div className='flex justify-between'>
                <Button
                  variant='outline'
                  onClick={() => handleBack('input')}
                  disabled={loading}
                >
                  Back
                </Button>
                <Button
                  onClick={() => setCurrentStep('verify')}
                  disabled={loading}
                >
                  I&apos;ve added these records
                </Button>
              </div>
            </CardContent>
          </>
        )}

        {currentStep === 'verify' && (
          <>
            <CardHeader>
              <CardTitle>
                {verificationStatus === 'Success'
                  ? 'Domain Verified!'
                  : 'Verifying Domain'}
              </CardTitle>
              <CardDescription>
                {verificationStatus === 'Success'
                  ? 'Your domain has been successfully verified'
                  : "We're verifying your domain ownership"}
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='flex flex-col items-center justify-center p-6 space-y-4 text-center'>
                {verificationStatus === 'Success' ? (
                  <>
                    <div className='h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center'>
                      <CheckCircle2 className='h-8 w-8 text-green-500' />
                    </div>
                    <div>
                      <p className='font-medium text-lg'>
                        Verification Complete!
                      </p>
                      <p className='text-sm text-muted-foreground mt-1'>
                        You can now send emails from @{domainData.name}
                      </p>
                    </div>
                    <Button
                      className='mt-4'
                      onClick={() => setCurrentStep('complete')}
                    >
                      Complete Setup
                    </Button>
                  </>
                ) : (
                  <>
                    <div className='relative'>
                      <div className='h-16 w-16 animate-spin rounded-full border-b-2 border-primary'></div>
                      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
                        <Mail className='h-6 w-6 text-muted-foreground' />
                      </div>
                    </div>
                    <div>
                      <p className='font-medium'>
                        Waiting for DNS Verification
                      </p>
                      <p className='text-sm text-muted-foreground mt-1'>
                        This usually takes 15-30 minutes
                      </p>
                    </div>
                  </>
                )}
              </div>

              {verificationStatus !== 'Success' && (
                <>
                  <Alert>
                    <Info className='h-4 w-4' />
                    <AlertTitle>Automatic Verification</AlertTitle>
                    <AlertDescription>
                      We&apos;ll automatically detect when your domain is
                      verified
                    </AlertDescription>
                  </Alert>

                  <div className='flex justify-between'>
                    <Button
                      variant='outline'
                      onClick={() => handleBack('records')}
                    >
                      Back to DNS Records
                    </Button>
                    <Button
                      variant='outline'
                      onClick={handleContinueInBackground}
                    >
                      Continue in Background
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </>
        )}

        {currentStep === 'complete' && (
          <>
            <CardHeader>
              <CardTitle>Domain Verified!</CardTitle>
              <CardDescription>Your domain is ready to use</CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='flex items-center gap-2 text-primary'>
                <CheckCircle2 className='h-5 w-5' />
                <span>You can now send emails from {domainData.name}</span>
              </div>

              <div className='space-y-4'>
                <div className='rounded-lg border p-4'>
                  <h3 className='font-medium mb-2'>Send a test email</h3>
                  <div className='space-y-4'>
                    <Input
                      placeholder='Enter recipient email'
                      type='email'
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                    />
                    <div className='text-sm text-muted-foreground'>
                      We&apos;ll send a test email from noreply@
                      {domainData.name}
                    </div>
                    <Button onClick={handleTestEmail} disabled={sendingTest}>
                      {sendingTest ? 'Sending...' : 'Send Test Email'}
                    </Button>
                  </div>
                </div>

                <div className='flex justify-between'>
                  <Button
                    variant='outline'
                    onClick={() => router.push('/dashboard/settings')}
                  >
                    Back to Settings
                  </Button>
                  <Button
                    onClick={() => router.push('/dashboard/campaigns/new')}
                  >
                    Create First Campaign
                  </Button>
                </div>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}
