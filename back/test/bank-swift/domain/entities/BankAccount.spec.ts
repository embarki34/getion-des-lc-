import { BankAccount } from '../../../../src/bank-swift/domain/entities/BankAccount';

describe('BankAccount Domain Entity', () => {
  const validProps = {
    id: '123',
    accountNumber: '12345678', // 8 chars, numeric
    keyAccount: 'KEY1', // alphanumeric
    currency: 'USD',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    isActive: true,
    createdBy: 'admin',
    updatedBy: 'admin',
    deletedBy: null,
  };

  it('should create a valid BankAccount', () => {
    const account = BankAccount.create(validProps);
    expect(account).toBeDefined();
    expect(account.id).toBe('123');
    expect(account.swiftIdentifier).toBe('KEY112345678');
  });

  it('should throw error for invalid account number', () => {
    expect(() => {
      BankAccount.create({
        ...validProps,
        accountNumber: '123', // Too short
      });
    }).toThrow(/Invalid Account Number/);

    expect(() => {
      BankAccount.create({
        ...validProps,
        accountNumber: '123a4567', // Non numeric
      });
    }).toThrow(/Invalid Account Number/);
  });

  it('should throw error for invalid key account', () => {
    expect(() => {
      BankAccount.create({
        ...validProps,
        keyAccount: 'K', // Too short
      });
    }).toThrow(/Invalid Key Account/);
  });

  it('should update identity immutably', () => {
    const account = BankAccount.create(validProps);
    // Wait a tick to ensure time change if needed, or just check object identity
    const newAccount = account.updatedIdentity('user2', '87654321');

    expect(newAccount).not.toBe(account); // Different instance
    expect(newAccount.accountNumber).toBe('87654321');
    expect(newAccount.keyAccount).toBe(validProps.keyAccount); // Unchanged
    expect(newAccount.updatedBy).toBe('user2');
    // expect(newAccount.updatedAt.getTime()).toBeGreaterThanOrEqual(account.updatedAt.getTime());

    // Original should remain unchanged
    expect(account.accountNumber).toBe('12345678');
  });

  it('should compute swiftIdentifier correctly', () => {
    const account = BankAccount.create({
      ...validProps,
      accountNumber: '100200300',
      keyAccount: 'myKey',
    });
    // Expected: MYKEY100200300 (Uppercased)
    expect(account.swiftIdentifier).toBe('MYKEY100200300');
    expect(account.isValidSwiftIdentifier()).toBe(true);
  });
});
