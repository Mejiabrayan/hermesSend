'use client';

import { Button } from '@/components/ui/button';
import { type ComponentProps } from 'react';
import { useFormStatus } from 'react-dom';
import { buttonStyles } from '@/utils/constant';

type Props = ComponentProps<typeof Button> & {
  pendingText?: string;
};

export function SubmitButton({
  children,
  pendingText = 'Submitting...',
  ...props
}: Props) {
  const { pending } = useFormStatus();

  return (
    <button
      className={buttonStyles}
      type='submit'
      aria-disabled={pending}
      {...props}
    >
      {pending ? pendingText : children}
    </button>
  );
}