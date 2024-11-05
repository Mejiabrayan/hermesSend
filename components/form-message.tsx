import { cn } from "@/lib/utils";

export type Message = {
  type: "error" | "success";
  message: string;
} | null;

export function FormMessage({ message }: { message: Message }) {
  if (!message) return null;

  return (
    <div
      className={cn(
        "p-3 text-sm rounded-lg border",
        message.type === "error"
          ? "bg-red-500/10 text-red-400 border-red-500/20"
          : "bg-green-500/10 text-green-400 border-green-500/20"
      )}
      role="alert"
    >
      {message.message}
    </div>
  );
}