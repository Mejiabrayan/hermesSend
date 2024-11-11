import { createServer } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { 
  AtSignIcon, 
  UsersIcon, 
  TrendingUpIcon, 
  BarChartIcon,
  PlusIcon,
  ArrowUpIcon,
  ArrowDownIcon 
} from 'lucide-react';

export default async function Page() {
  const supabase = await createServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/sign-in');
  }

  // Fetch recent campaigns and stats
  const { data: recentCampaigns } = await supabase
    .from('campaigns')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <div className='space-y-8'>
      {/* Header Section */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold'>Welcome back!</h1>
          <p className='text-muted-foreground'>
            Here&apos;s what&apos;s happening with your campaigns
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/campaigns/new" className="flex items-center gap-2">
            <PlusIcon className="w-4 h-4" />
            New Campaign
          </Link>
        </Button>
      </div>

      {/* Stats Overview */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Campaigns
            </CardTitle>
            <AtSignIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Subscribers
            </CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,350</div>
            <div className="flex items-center text-xs text-emerald-500">
              <ArrowUpIcon className="h-3 w-3 mr-1" />
              +180 new
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Open Rate
            </CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32.9%</div>
            <div className="flex items-center text-xs text-red-500">
              <ArrowDownIcon className="h-3 w-3 mr-1" />
              -4.1% from last week
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Click Rate
            </CardTitle>
            <BarChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.3%</div>
            <div className="flex items-center text-xs text-emerald-500">
              <ArrowUpIcon className="h-3 w-3 mr-1" />
              +2.4% from last week
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Campaigns */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Campaigns</CardTitle>
            <Button variant="ghost" asChild>
              <Link href="/dashboard/campaigns">View all</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recentCampaigns?.length === 0 ? (
            <div className='text-center py-8'>
              <div className='rounded-full bg-zinc-900 w-12 h-12 flex items-center justify-center mx-auto mb-4'>
                <AtSignIcon className='w-6 h-6 text-zinc-400' />
              </div>
              <h3 className='text-lg font-semibold mb-2'>No campaigns yet</h3>
              <p className='text-zinc-400 mb-4 max-w-sm mx-auto'>
                Create your first campaign to start reaching your audience
              </p>
              <Button asChild>
                <Link href="/dashboard/campaigns/new">Create Campaign</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentCampaigns?.map((campaign) => (
                <div 
                  key={campaign.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <Link 
                      href={`/dashboard/campaigns/${campaign.id}`}
                      className="font-medium hover:underline"
                    >
                      {campaign.name}
                    </Link>
                    <div className="text-sm text-muted-foreground">
                      {new Date(campaign.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-medium">{campaign.opens_count || 0} opens</div>
                      <div className="text-sm text-muted-foreground">
                        {campaign.clicks_count || 0} clicks
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
