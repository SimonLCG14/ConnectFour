export enum PlayerId {
  ONE,
  TWO,
}

export interface Player {
  id: PlayerId;
  name: string;
  color: string;
}
