import { User } from "../../domain/user";
import { CreateUserInput, LoginUserInput } from "./user-input-dto";
import { CreateUserOutput, LoginUserOutput } from "./user-output-dto";
import { UserPort } from "./user-port";
import { Email } from "../../domain/value-objects/Email";
import { Password } from "../../domain/value-objects/Password";

export async function createUserAccount(
  createUserInput: CreateUserInput,
  userPort: UserPort
) {
  const { name, email, phone, password } = createUserInput;
  const id = Math.random().toString();

  User.validateUserInfo(id, name, email, phone, password);

  const emailVO = Email.create(email);
  const passwordVO = Password.create(password);

  const user = new User(id, name, emailVO, phone, passwordVO);

  return await userPort.save(
    new CreateUserOutput(
      user.id,
      user.name,
      user.email.getValue(),
      user.password.getValue()
    )
  );
}

export async function loginUser(
  loginUserInput: LoginUserInput,
  userPort: UserPort
) {
  const { email, password } = loginUserInput;
  const loginUserOutput = await userPort.verifyUserCredentials(email, password);
  return loginUserOutput;
}
