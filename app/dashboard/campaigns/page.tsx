import { createServer } from '@/utils/supabase/server';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { CampaignsTable } from './_components/campaigns-table';

export default async function CampaignsPage() {
  const supabase = await createServer();
  const { data: campaigns } = await supabase
    .from('campaigns')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Campaigns</h1>
          <p className="text-sm text-muted-foreground">
            Create and manage your email campaigns
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/campaigns/new" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>New Campaign</span>
          </Link>
        </Button>
      </div>

      <CampaignsTable campaigns={campaigns || []} />
    </div>
  );
} 