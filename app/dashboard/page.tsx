import { createServer } from '@/utils/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Users, BarChart3, MousePointerClick } from 'lucide-react';
import { 
  RecentCampaigns, 
  TopContacts, 
  EngagementChart 
} from './_components';
import { Tables } from '@/utils/database.types';

type CampaignData = Pick<
  Tables<'campaigns'>,
  'id' | 'name' | 'status' | 'sent_count' | 'opens_count' | 'clicks_count' | 'created_at'
>;

export default async function DashboardPage() {
  const supabase = await createServer();

  const [campaignsResponse, contactsResponse, analyticsResponse] = await Promise.all([
    supabase
      .from('campaigns')
      .select('id, name, status, sent_count, opens_count, clicks_count, created_at')
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('contacts')
      .select('*')
      .limit(5),
    supabase
      .from('campaign_analytics')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)
  ]);

  const campaigns = (campaignsResponse.data || []) as CampaignData[];
  const contacts = (contactsResponse.data || []) as Tables<'contacts'>[];
  const analytics = (analyticsResponse.data || []) as Tables<'campaign_analytics'>[];

  const stats = {
    totalCampaigns: campaigns.length,
    totalContacts: contacts.length,
    totalOpens: analytics.filter(a => a.opened_at).length,
    totalClicks: analytics.filter(a => a.clicked_at).length,
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your email marketing performance
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Campaigns
            </CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCampaigns}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Contacts
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalContacts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Email Opens
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOpens}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Link Clicks
            </CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClicks}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <RecentCampaigns campaigns={campaigns} />
            <TopContacts contacts={contacts} />
          </div>
        </TabsContent>

        <TabsContent value="engagement">
          <Card>
            <CardHeader>
              <CardTitle>Engagement Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <EngagementChart analytics={analytics} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

