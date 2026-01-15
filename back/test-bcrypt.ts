import bcrypt from "bcryptjs";

async function testBcrypt() {
  const plainPassword = "DevPass!2025";
  const storedHash =
    "$2a$10$MqXwsz8q0AgXZnL.Om8ty.1f4WLx7zrYeWKDYeqIiAPW.4csNxyQS";

  console.log("Testing bcrypt directly:");
  console.log("Plain:", plainPassword);
  console.log("Hash:", storedHash);

  const result = await bcrypt.compare(plainPassword, storedHash);
  console.log("Result:", result);

  // Also test creating a new hash
  console.log("\nCreating new hash:");
  const newHash = await bcrypt.hash(plainPassword, 10);
  console.log("New hash:", newHash);

  const newResult = await bcrypt.compare(plainPassword, newHash);
  console.log("New hash comparison:", newResult);
}

testBcrypt().catch(console.error);
