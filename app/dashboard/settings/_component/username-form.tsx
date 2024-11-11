'use client';

import { useQueryClient, useMutation } from '@tanstack/react-query';
import { updateUserProfile } from '@/utils/actions';
import { SubmitButton } from '@/components/submit-button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tables } from '@/utils/database.types';

type UserProfileQuery = {
  data: Tables<'users'> | null;
  error: string | null;
}

export function UsernameForm({ initialUsername }: { initialUsername: string }) {
  const queryClient = useQueryClient();

  const updateProfileMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return updateUserProfile(formData);
    },
    onMutate: async (newFormData) => {
      await queryClient.cancelQueries({ queryKey: ['userProfile'] });
      const previousProfile = queryClient.getQueryData<UserProfileQuery>(['userProfile']);
      
      queryClient.setQueryData<UserProfileQuery>(['userProfile'], (old) => ({
        ...old!,
        data: {
          ...old!.data!,
          username: newFormData.get('username')?.toString() || '',
        },
      }));

      return { previousProfile };
    },
    onError: (err, newFormData, context) => {
      if (context?.previousProfile) {
        queryClient.setQueryData(['userProfile'], context.previousProfile);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    updateProfileMutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <div className="flex gap-2">
          <Input
            id="username"
            name="username"
            defaultValue={initialUsername}
            required
            minLength={2}
          />
          <SubmitButton
            size="sm"
            pendingText='Saving...'
            disabled={updateProfileMutation.isPending}
          >
            Save
          </SubmitButton>
        </div>
      </div>
    </form>
  );
} 