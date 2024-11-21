import { getUserProfile } from '@/utils/actions';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UsernameForm } from './username-form';

export async function SettingsForm() {
  const { data } = await getUserProfile();

  return (
    <div className='max-w-[800px]'>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold tracking-tight'>Account Settings</h1>
        <p className='text-muted-foreground'>
          Manage your account settings and preferences.
        </p>
      </div>

      <div className='space-y-8'>
        {/* Username Section */}
        <div className='border-b pb-8'>
          <div className='space-y-2 mb-4'>
            <Label className='text-base font-semibold'>Username</Label>
            <p className='text-sm text-muted-foreground'>
              This is your public display name.
            </p>
          </div>
          <div className='max-w-md'>
            <UsernameForm initialUsername={data?.username || ''} />
          </div>
        </div>

        {/* Email Section */}
        <div className='space-y-2'>
          <div className='space-y-2 mb-4'>
            <Label className='text-base font-semibold'>Email</Label>
            <p className='text-sm text-muted-foreground'>
              Your email address is used for notifications and sign-in.
            </p>
          </div>
          <Input
            id='email'
            type='email'
            defaultValue={data?.email || ''}
            disabled
            className='max-w-md bg-muted'
          />
        </div>
      </div>
    </div>
  );
}
