import {AUTH_TOKEN} from '@env';
import {CONFIG} from '../config';

/**
 * API Response structure
 */
interface AutocompleteResponse {
  autocomplete: any[]; // raw interest data (DTOs)
  pages_left: number;
}

export class InterestRemoteDataSource {
  private readonly apiUrl: string;

  constructor(apiUrl = CONFIG.DEFAULT_API_URL) {
    this.apiUrl = apiUrl;
  }

  /**
   * Fetch interests from the API.
   * @param query Search term
   * @param limit Number of interests to fetch
   * @param from Pagination offset
   * @returns Promise of InterestModel[] (DTOs)
   */
  async fetchInterests(
    query = '',
    limit = CONFIG.DEFAULT_LIMIT,
    from = 0,
  ): Promise<any[]> {
    try {
      const url = `${this.apiUrl}?q=${encodeURIComponent(
        query,
      )}&limit=${limit}&from=${from}`;
      const response = await this.fetchWithTimeout(url);

      if (!response.ok) {
        throw new Error(
          `HTTP Error: ${response.status} - ${response.statusText}`,
        );
      }

      const data: AutocompleteResponse = await response.json();

      if (!Array.isArray(data.autocomplete)) {
        throw new Error('Unexpected API response format');
      }

      return data.autocomplete;
    } catch (error) {
      this.handleError('fetchInterests', error);
      return [];
    }
  }

  /**
   * Performs fetch with a timeout.
   */
  private async fetchWithTimeout(url: string): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      CONFIG.REQUEST_TIMEOUT,
    );

    try {
      return await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: AUTH_TOKEN,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Logs and handles errors.
   */
  private handleError(method: string, error: unknown): void {
    console.error(`[InterestRemoteDataSource] Error in ${method}:`, error);
  }
}
