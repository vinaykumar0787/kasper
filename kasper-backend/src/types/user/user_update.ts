import { KasperUser } from "./user";

export class KasperUserUpdate {
  public readonly name?: string;
  public readonly userRank?: number;

  constructor(
    raw: {
      name?: string;
      userRank?: number;
    },
    public readonly user: KasperUser,
  ) {
    this.name = raw.name;
    this.userRank= raw.userRank;
    this.user= user;
  }
}
