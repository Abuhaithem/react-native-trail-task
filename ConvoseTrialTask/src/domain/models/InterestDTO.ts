/**
 * DTO representing an interest from the autocomplete API.
 */
export interface InterestDTO {
  id: number;
  name: string; // Includes primary and optional secondary search terms
  type: string;
  match: number; // Popularity count
  color: string;
  avatar: string | null;
  existing: boolean;
}
