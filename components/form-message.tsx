import { cn } from "@/lib/utils";

export type Message = {
  type: "error" | "success";
  message: string;
} | null;

export function FormMessage({ message }: { message: Message }) {
  if (!message) return null;

  return (
    <p
      className={cn(
        "text-sm text-center p-2 rounded-md border",
        message.type === "error"
          ? "text-rose-400 border-rose-400 bg-rose-900/20"
          : "text-emerald-400 border-emerald-400 bg-emerald-900/20"
      )}
      role="alert"
    >
      {message.message}
    </p>
  );
}