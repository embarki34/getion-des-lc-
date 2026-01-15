import { Email } from "./value-objects/Email";
import { Password } from "./value-objects/Password";

export class User {
  constructor(
    public id: string,
    public name: string,
    public email: Email,
    public phone: string,
    public password: Password
  ) {}

  static validateUserInfo(
    id: string,
    name: string,
    email: string,
    phone: string,
    password: string
  ) {
    if (!name || !phone || !email || !password) {
      throw new Error("name and phone and email and password must be provided");
    }
  }
}
