import { getStoreAiSummary } from "@/lib/seo/json-ld";

export function GET() {
  const body = getStoreAiSummary();

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
