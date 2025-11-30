export interface SanityAsset {
  asset: {
    _id: string;
    url: string;
    metadata?: {
      dimensions?: {
        width: number;
        height: number;
      };
    };
  };
}

export interface SanitySlug {
  current: string;
  _type: "slug";
}
