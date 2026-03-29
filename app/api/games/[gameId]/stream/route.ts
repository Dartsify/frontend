import { getToken } from "@/lib/fastapi/auth";
import { buildApiUrl } from "@/utils/requests";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ gameId: string }> },
) {
  const { gameId } = await params;
  const token = await getToken();

  if (!token) {
    return new Response("No auth token found", { status: 401 });
  }

  const upstream = await fetch(buildApiUrl(`/games/${gameId}/stream`), {
    method: "GET",
    headers: {
      accept: "text/event-stream",
      authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!upstream.ok) {
    const body = await upstream.text();
    return new Response(body || `HTTP ${upstream.status}`, {
      status: upstream.status,
    });
  }

  return new Response(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
