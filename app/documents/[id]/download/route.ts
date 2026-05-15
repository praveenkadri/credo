import { NextResponse } from "next/server";

import { createDocumentSignedUrl } from "@/lib/data/document-access";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const url = new URL(request.url);
  const download = url.searchParams.get("download") === "1";

  try {
    const result = await createDocumentSignedUrl(id, {
      expiresInSeconds: 60,
      download,
    });

    return NextResponse.redirect(result.signedUrl, 302);
  } catch {
    return new NextResponse("Document file unavailable.", { status: 404 });
  }
}
