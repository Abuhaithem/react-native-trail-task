import {Interest} from '../../domain/entities/Interest';
import {InterestRepository} from '../../domain/repositories/InterestRepository';
import {InterestRemoteDataSource} from '../datasource/searchDataSource';
import {InterestModel} from '../models/InterestModel';

export class InterestRepositoryImpl extends InterestRepository {
  private readonly remoteDataSource: InterestRemoteDataSource;

  constructor(remoteDataSource: InterestRemoteDataSource) {
    super();
    this.remoteDataSource = remoteDataSource;
  }

  async fetchInterests(
    query: string,
    limit = 15,
    from = 0,
  ): Promise<Interest[]> {
    try {
      const jsonList = await this.remoteDataSource.fetchInterests(
        query,
        limit,
        from,
      );
      return jsonList.map(json => InterestModel.fromJson(json).toEntity());
    } catch (error) {
      console.error(
        '[InterestRepositoryImpl] Error fetching interests:',
        error,
      );
      return [];
    }
  }
}
