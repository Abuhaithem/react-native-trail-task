import {Interest} from '../../domain/entities/Interest';

export class InterestModel {
  constructor(
    public id: number,
    public name: string,
    public type: string,
    public match: number,
    public color: string,
    public avatar: string | null,
    public existing: boolean,
  ) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.match = match;
    this.color = color;
    this.avatar = avatar;
    this.existing = existing;
  }

  static fromJson(json: any): InterestModel {
    return new InterestModel(
      json.id,
      json.name,
      json.type,
      json.match,
      json.color,
      json.avatar ?? null,
      json.existing,
    );
  }

  toEntity(): Interest {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      match: this.match,
      color: this.color,
      avatar: this.avatar,
      existing: this.existing,
    };
  }
}
