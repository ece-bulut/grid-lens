import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
  external?: boolean;
};

export function ActionLink({ href, children, variant = "primary", className, external }: Props) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className={cn(
        "group inline-flex h-10 items-center gap-2 rounded-md px-4 text-sm font-medium transition-colors duration-200 ease-out",
        variant === "primary" && "bg-zinc-100 text-zinc-950 hover:bg-white",
        variant === "secondary" && "border border-zinc-800 text-zinc-300 hover:border-zinc-600 hover:text-white",
        className,
      )}
    >
      {children}
    </a>
  );
}
