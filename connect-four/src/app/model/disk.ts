export type Disk = {
  id: number;
  color: string;
}
let idCounter: number = 0;
export function getNextId(): number{
  return idCounter++;
}
