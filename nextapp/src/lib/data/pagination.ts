import { CursorPage } from "@/src/shared/entities/pagination.types";

export const DEFAULT_PAGE_SIZE = 50;
export const MAX_PAGE_SIZE = 100;

export function parsePaginationParams(searchParams: URLSearchParams): {
  limit: number;
  cursor: string | null;
} {
  const rawLimit = searchParams.get("limit");
  const limit = rawLimit === null ? DEFAULT_PAGE_SIZE : Number(rawLimit);
  if (!Number.isInteger(limit) || limit < 1 || limit > MAX_PAGE_SIZE) {
    throw new Error(`limit must be an integer between 1 and ${MAX_PAGE_SIZE}`);
  }
  const cursor = searchParams.get("cursor");
  if (cursor !== null && !cursor.trim()) throw new Error("cursor must not be empty");
  return { limit, cursor };
}

export function encodeCursor(id: string): string {
  return Buffer.from(id, "utf8").toString("base64url");
}

export function decodeCursor(cursor: string | null): string | null {
  if (cursor === null) return null;
  try {
    const decoded = Buffer.from(cursor, "base64url").toString("utf8");
    if (!decoded || !/^[A-Za-z0-9._-]+$/.test(decoded)) throw new Error();
    return decoded;
  } catch {
    throw new Error("cursor is invalid");
  }
}

export function toCursorPage<T extends { _id: string }>(items: T[], limit: number): CursorPage<T> {
  const hasMore = items.length > limit;
  const data = items.slice(0, limit);
  return {
    data,
    hasMore,
    nextCursor: hasMore && data.length ? encodeCursor(data[data.length - 1]._id) : null,
  };
}
