interface Message {
  type: 'error' | 'success';
  message: string;
}

interface FormMessageProps {
  message?: Message | null;
}

export function FormMessage({ message }: FormMessageProps) {
  if (!message) return null;

  return (
    <div
      className={`p-3 rounded-md text-sm ${
        message.type === 'error'
          ? 'bg-destructive/15 text-destructive'
          : 'bg-emerald-500/15 text-emerald-500'
      }`}
    >
      {message.message}
    </div>
  );
}

export type { Message };