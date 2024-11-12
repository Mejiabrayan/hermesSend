import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { CampaignsTable } from './_components/campaigns-table';
import { Skeleton } from '@/components/ui/skeleton';
import { createServer } from '@/utils/supabase/server';

// Loading skeleton component
function CampaignsTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
      <div className="rounded-lg border">
        <div className="p-4">
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
                <Skeleton className="h-8 w-[100px]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Static header component
function CampaignsHeader() {
  return (
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
  );
}

// Async server component for data fetching
async function CampaignsData() {
  const supabase = await createServer();
  const { data: campaigns } = await supabase
    .from('campaigns')
    .select('*')
    .order('created_at', { ascending: false });

  return <CampaignsTable campaigns={campaigns || []} />;
}

// Main page component
export default function CampaignsPage() {
  return (
    <div className="space-y-6">
      <CampaignsHeader />
      <Suspense fallback={<CampaignsTableSkeleton />}>
        <CampaignsData />
      </Suspense>
    </div>
  );
} 