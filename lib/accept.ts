type ContentVariant = "html" | "markdown";

type AcceptEntry = {
  mediaRange: string;
  q: number;
  specificity: number;
  order: number;
};

const SUPPORTED_VARIANTS = ["text/markdown", "text/html"] as const;

export function negotiateContentVariant(acceptHeader: string | null) {
  if (!acceptHeader || acceptHeader.trim() === "") {
    return "html" as ContentVariant;
  }

  const entries = parseAcceptHeader(acceptHeader);

  if (entries.length === 0) {
    return null;
  }

  const ranked = SUPPORTED_VARIANTS.map((variant) => ({
    variant: variant === "text/markdown" ? "markdown" : "html",
    match: bestMatchForVariant(variant, entries),
  })).filter((candidate) => candidate.match !== null);

  if (ranked.length === 0) {
    return null;
  }

  ranked.sort((a, b) => {
    if (a.match!.q !== b.match!.q) {
      return b.match!.q - a.match!.q;
    }

    if (a.match!.specificity !== b.match!.specificity) {
      return b.match!.specificity - a.match!.specificity;
    }

    if (a.match!.order !== b.match!.order) {
      return a.match!.order - b.match!.order;
    }

    return a.variant === "html" ? -1 : 1;
  });

  return ranked[0].variant as ContentVariant;
}

function parseAcceptHeader(header: string) {
  return header
    .split(",")
    .map((part, order): AcceptEntry | null => {
      const [rawMediaRange, ...rawParameters] = part.trim().split(";");
      const mediaRange = rawMediaRange.toLowerCase();

      if (!mediaRange.includes("/")) {
        return null;
      }

      const qParameter = rawParameters
        .map((parameter) => parameter.trim())
        .find((parameter) => parameter.toLowerCase().startsWith("q="));
      const q = qParameter ? Number(qParameter.slice(2)) : 1;

      if (!Number.isFinite(q) || q <= 0) {
        return null;
      }

      return {
        mediaRange,
        q,
        specificity:
          mediaRange === "*/*" ? 0 : mediaRange.endsWith("/*") ? 1 : 2,
        order,
      };
    })
    .filter((entry): entry is AcceptEntry => entry !== null);
}

function bestMatchForVariant(
  variant: (typeof SUPPORTED_VARIANTS)[number],
  entries: AcceptEntry[],
) {
  const [variantType, variantSubtype] = variant.split("/");
  const matches = entries
    .map((entry) => {
      if (variant === "text/html" && entry.mediaRange === "text/plain") {
        return { ...entry, mediaRange: "text/html", specificity: 0 };
      }

      return entry;
    })
    .filter((entry) => {
      const [entryType, entrySubtype] = entry.mediaRange.split("/");

      return (
        entry.mediaRange === "*/*" ||
        (entryType === variantType &&
          (entrySubtype === "*" || entrySubtype === variantSubtype))
      );
    });

  if (matches.length === 0) {
    return null;
  }

  return matches.sort((a, b) => {
    if (a.q !== b.q) {
      return b.q - a.q;
    }

    if (a.specificity !== b.specificity) {
      return b.specificity - a.specificity;
    }

    return a.order - b.order;
  })[0];
}
