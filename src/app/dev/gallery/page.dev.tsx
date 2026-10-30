import { notFound } from "next/navigation";
export const dynamicParams = false;
export function generateStaticParams() {
  return [];
}
export default async function Page() {
  if (process.env.NODE_ENV === "production") notFound();
  const { Gallery } = await import("@/components/dev/Gallery");
  return <Gallery />;
}
