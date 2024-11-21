import { createServer } from '@/utils/supabase/server';
import { notFound, redirect } from 'next/navigation';
import { CampaignContent } from './_components/campaign-content';
import { getCampaign } from './queries';
import { getCampaignAnalytics } from './actions';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';

export default async function CampaignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServer();
  const queryClient = new QueryClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    redirect('/sign-in');
  }

  try {
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: ['campaign', id],
        queryFn: () => getCampaign(id),
      }),
      queryClient.prefetchQuery({
        queryKey: ['campaign-analytics', id],
        queryFn: () => getCampaignAnalytics(id),
      }),
    ]);

    const campaign = await queryClient.getQueryData(['campaign', id]);
    if (!campaign) {
      return notFound();
    }

    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <CampaignContent campaignId={id} />
      </HydrationBoundary>
    );
  } catch (error) {
    console.error('Campaign page error:', error);
    return notFound();
  }
}
