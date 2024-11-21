'use client';

import { useQueryClient, useMutation } from '@tanstack/react-query';
import { updateUserProfile } from '@/utils/actions';
import { SubmitButton } from '@/components/submit-button';
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';

export function UsernameForm({ initialUsername }: { initialUsername: string }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const updateProfileMutation = useMutation({
    mutationFn: async (username: string) => {
      const formData = new FormData();
      formData.append('username', username);
      const result = await updateUserProfile(formData);
      if (result.error) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      toast({
        title: 'Username updated',
        description: 'Your username has been updated successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update username. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    if (username === initialUsername) {
      toast({
        title: 'No changes',
        description: 'Username is the same as before.',
      });
      return;
    }
    updateProfileMutation.mutate(username);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex gap-2">
        <Input
          id="username"
          name="username"
          defaultValue={initialUsername}
          required
          minLength={2}
          placeholder="Enter username"
        />
        <SubmitButton
          size="sm"
          pendingText='Saving...'
          disabled={updateProfileMutation.isPending}
        >
          Save
        </SubmitButton>
      </div>
    </form>
  );
} 