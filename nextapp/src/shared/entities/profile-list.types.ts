export type ProfileListOptions = {
  search?: string;
  group?: string;
  sort?: "id" | "name-asc" | "name-desc";
};

export function normalizeProfileSearch(search = ""): string {
  return search.trim().toLowerCase();
}

export function profileListKey(options: ProfileListOptions): string {
  return JSON.stringify([
    normalizeProfileSearch(options.search),
    options.group || "",
    options.sort || "id",
  ]);
}
