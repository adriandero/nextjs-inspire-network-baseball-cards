export interface ProfileIdentifierTable {
  readonly id: string;
  readonly name: string;
  readonly profiles: string[]; // Array of UUIDs
}
