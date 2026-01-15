import { BcryptPasswordHashingService } from "../src/identity/infrastructure/services/BcryptPasswordHashingService";
import { Password } from "../src/identity/domain/value-objects/Password";

describe("BcryptPasswordHashingService", () => {
  let hashingService: BcryptPasswordHashingService;

  beforeEach(() => {
    hashingService = new BcryptPasswordHashingService(10);
  });

  it("should hash a password correctly", async () => {
    const plainPassword = Password.create("TestPassword123!");
    const hashedPassword = await hashingService.hash(plainPassword);

    expect(hashedPassword.getValue()).not.toBe(plainPassword.getValue());
    expect(hashedPassword.isHashed()).toBe(true);
  });

  it("should compare a plain password with its hash correctly", async () => {
    const plainPassword = Password.create("TestPassword123!");
    const hashedPassword = await hashingService.hash(plainPassword);

    const isValid = await hashingService.compare(plainPassword, hashedPassword);
    expect(isValid).toBe(true);
  });

  it("should return false for incorrect password", async () => {
    const plainPassword = Password.create("TestPassword123!");
    const wrongPassword = Password.create("WrongPassword123!");
    const hashedPassword = await hashingService.hash(plainPassword);

    const isValid = await hashingService.compare(wrongPassword, hashedPassword);
    expect(isValid).toBe(false);
  });
});
