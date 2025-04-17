import {Interest} from '../entities/Interest';
import {InterestRepository} from '../repositories/InterestRepository';

export class GetSearchInterests {
  private readonly interestRepository: InterestRepository;

  constructor(interestRepository: InterestRepository) {
    this.interestRepository = interestRepository;
  }

  /**
   * Fetch and return a list of interest entities
   * @param query Search term
   * @param limit Number of interests to fetch
   * @param from Pagination offset
   * @returns Promise<Interest[]>
   */
  async fetch(
    query: string = '',
    limit: number = 15,
    from: number = 0,
  ): Promise<Interest[]> {
    return await this.interestRepository.fetchInterests(query, limit, from);
  }
}
