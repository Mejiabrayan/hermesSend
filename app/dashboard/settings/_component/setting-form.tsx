import { getUserProfile, updateUserProfile, updateAvatarAction } from '@/utils/actions';
import { SubmitButton } from '@/components/submit-button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from 'lucide-react';
import Image from 'next/image';

export async function SettingsForm() {
  const { data } = await getUserProfile();

  return (
    <div className="max-w-[600px] mx-auto space-y-6">
      {/* Profile Section */}
      <div className="space-y-6">
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-24 w-24 rounded-full overflow-hidden bg-white/10">
            {data?.photo_url ? (
              <Image
                src={data.photo_url}
                alt="Profile"
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <User className="h-12 w-12" />
              </div>
            )}
          </div>
          <form action={updateAvatarAction}>
            <div className="flex flex-col items-center gap-2">
              <Input
                id="avatar"
                name="avatar"
                type="file"
                accept="image/*"
                required
                className="w-full"
              />
              <SubmitButton
                size="sm"
                variant="default"
                pendingText='Uploading...'
                className="w-1/2"
              >
                Upload new photo
              </SubmitButton>
            </div>
          </form>
        </div>

        <div className="border-t" />

        {/* Profile Information */}
        <form action={updateUserProfile} className='space-y-4'>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="flex gap-2">
              <Input
                id="username"
                name="username"
                defaultValue={data?.username || ''}
                required
                minLength={2}
              />
              <SubmitButton
                size="sm"
                pendingText='Saving...'
              >
                Save
              </SubmitButton>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              defaultValue={data?.email || ''}
              disabled
            />
          </div>
        </form>
      </div>

      {/* Preferences Section */}
      <div className="space-y-6">
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium">Preferences</h3>
          <p className="text-sm text-muted-foreground">
            Customize your experience.
          </p>
        </div>
        <form className="space-y-4">
          {/* Add preference controls here */}
        </form>
      </div>

      {/* Security Section */}
      <div className="space-y-6">
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium">Security</h3>
          <p className="text-sm text-muted-foreground">
            Update your password and security settings.
          </p>
        </div>
        <form className="space-y-4">
          {/* Add security controls here */}
        </form>
      </div>

      {/* Notifications Section */}
      <div className="space-y-6">
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium">Notifications</h3>
          <p className="text-sm text-muted-foreground">
            Manage your notification preferences.
          </p>
        </div>
        <form className="space-y-4">
          {/* Add notification controls here */}
        </form>
      </div>

      {/* Danger Zone */}
      <div className="space-y-6">
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-destructive">Danger Zone</h3>
          <p className="text-sm text-muted-foreground">
            Permanently delete your account and all of your content.
          </p>
        </div>
        <form className="space-y-4">
          {/* Add danger zone controls here */}
        </form>
      </div>
    </div>
  );
}
