import {InterestDTO} from '../models/InterestDTO';
import {InterestRemoteDataSource} from '../../data/searchDataSource';

export class GetSearchInterests {
  constructor(private readonly searchDataSource: InterestRemoteDataSource) {}

  /**
   * Fetch interests based on a query and limit.
   * @param query The search keyword (optional).
   * @param limit Number of results to return.
   * @returns A promise resolving to an array of InterestDTO.
   */
  public async fetch(
    query: string = '',
    limit: number = 15,
  ): Promise<InterestDTO[]> {
    try {
      return await this.searchDataSource.fetchInterests(query, limit);
    } catch (error) {
      console.error('Error fetching interests:', error);
      return [];
    }
  }
}
