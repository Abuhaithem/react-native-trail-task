/**
 * Interest representing an interest from the autocomplete API.
 */
export interface Interest {
  id: number;
  name: string;
  type: string;
  match: number;
  color: string;
  avatar: string | null;
  existing: boolean;
}
