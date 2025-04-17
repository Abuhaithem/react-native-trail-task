import {Interest} from '../entities/Interest';

export abstract class InterestRepository {
  abstract fetchInterests(
    query: string,
    limit?: number,
    from?: number,
  ): Promise<Interest[]>;
}
