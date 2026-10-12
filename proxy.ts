import { NextRequest, NextResponse } from "next/server";
import { negotiateContentVariant } from "./lib/accept";
import { markdownForPath, notFoundMarkdown } from "./lib/siteContent";

const VARY_HEADER = "Accept, Accept-Encoding";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Next.js still invokes Proxy for /_next/data, even when excluded below.
  if (pathname.startsWith("/_next")) {
    return NextResponse.next();
  }

  const markdown = markdownForPath(pathname);
  const contentVariant = negotiateContentVariant(request.headers.get("accept"));

  if (!markdown) {
    if (contentVariant === "html") {
      const response = NextResponse.next();
      response.headers.set("Vary", VARY_HEADER);
      return response;
    }

    return markdownResponse(notFoundMarkdown(pathname), 404);
  }

  if (contentVariant === "markdown") {
    return markdownResponse(markdown, 200);
  }

  if (contentVariant === null) {
    return new NextResponse(
      "Not acceptable. Request text/html or text/markdown.",
      {
        status: 406,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          Vary: VARY_HEADER,
        },
      },
    );
  }

  const response = NextResponse.next();
  response.headers.set("Vary", VARY_HEADER);
  return response;
}

function markdownResponse(body: string, status: number) {
  return new NextResponse(body, {
    status,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      Vary: VARY_HEADER,
    },
  });
}

export const config = {
  matcher: "/((?!_next|_vercel|.*\\.).*)",
};
