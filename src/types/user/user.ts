export class KasperUser {
  public readonly id!: number;
  public readonly uniqueId!: string;
  public readonly name!: string;
  public readonly userRank!: number;
  public readonly createdDate!: Date;

  constructor(
    raw: {
      id: number;
      name: string;
      userRank: number;
      createdDate: Date;
    },
  ) {
    this.id = raw.id;
    this.name = raw.name;
    this.userRank= raw.userRank;
    this.createdDate= new Date();
  }
}
