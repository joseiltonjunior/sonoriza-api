export type Role = 'ADMIN' | 'USER'

export class User {
  constructor(
    public readonly id: string,
    public name: string,
    public email: string,
    public password: string,
    public role: Role = 'USER',

    public createdAt: Date = new Date(),
  ) {}
}
