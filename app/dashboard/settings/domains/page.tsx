import { createServer } from '@/utils/supabase/server';
import { DomainOnboarding } from '../_component/domain-onboarding';
import { DomainSettings } from '../_component/domain-settings';

export default async function DomainsPage() {
  const supabase = await createServer();
  const { data: domains } = await supabase
    .from('domains')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Email Domains</h2>
        <p className="text-muted-foreground">
          Manage your email sending domains and DNS settings.
        </p>
      </div>

      {domains?.length === 0 ? (
        <DomainOnboarding />
      ) : (
        <DomainSettings domains={domains} />
      )}
    </div>
  );
} 