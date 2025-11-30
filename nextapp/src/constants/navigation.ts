export const NAV_ITEMS = [
  { href: "/", label: "Home", external: false },
  { href: "/browse", label: "Browse Cards", external: false },
  {
    href: "/deckbuilder",
    label: "Deck Builder",
    external: false,
  },
  {
    href: "https://www.inspirenetworkllc.com/",
    label: "About us",
    external: true,
  },
] as const;

export type NavItem = (typeof NAV_ITEMS)[number];

export const PROFILE_ROUTES = {
  TUG_CARD: (uuid: string) => `/tugcards/${uuid}`,
  LOGOUT: "/auth/logout",
} as const;

export const ERROR_MESSAGES = {
  NO_PROFILE:
    "You don't have a TUG Card assigned - Ask an administrator for access",
  MISSING_BASEBALL_CARD: "Missing Baseball Card",
} as const;
