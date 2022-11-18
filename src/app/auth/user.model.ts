export class User {
  constructor(
    public username: string,
    public email: string,
    public role: string,
    public token: string,
    public id: string
  ) {}
}
