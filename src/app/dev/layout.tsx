import { inter, oswald } from "@/lib/fonts";
import "../globals.css";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <body className={`${inter.variable} ${oswald.variable}`}>{children}</body>
    </html>
  );
}
