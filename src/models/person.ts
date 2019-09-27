export interface IPerson {
  _key?: string;
  _id?: string;
  _rev?: string;
  surName: string;
  givenName: string;
  nickName?: string;
  birthName?: string;
  sex: string;
  birthDate: Date;
  birthPlace: string;
  dead: boolean;
  deathDate?: Date;
  deathPlace?: string;
  lastUpdated: Date;
  attr?: any
}

