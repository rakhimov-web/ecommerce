import type { ReactNode } from "react";
export function Badge({ children }: { children: ReactNode }) {
  return <span className="badge type-caption-sm">{children}</span>;
}
