import { SwiftMT700Generator } from "../../../src/bank-swift/infrastructure/swift/SwiftMT700Generator";
import { SwiftMT700DTO } from "../../../src/bank-swift/application/dto/SwiftMessageDTO";

describe("SwiftMT700Generator", () => {
  let generator: SwiftMT700Generator;

  beforeEach(() => {
    generator = new SwiftMT700Generator();
  });

  it("should generate valid MT700 message", () => {
    const data: SwiftMT700DTO = {
      referenceDossier: "LC2024001",
      applicantName: "CONDOR ELECTRONICS",
      applicantAddress: "BORDJ BOU ARRERIDJ, ALGERIA",
      beneficiaryName: "SAMSUNG ELECTRONICS",
      beneficiaryAddress: "SEOUL, SOUTH KOREA",
      amount: 500000,
      currency: "USD",
      expiryDate: "2024-12-31T00:00:00Z",
      description: "ELECTRONIC COMPONENTS",
      issuingBankSwift: "BARCDZAL",
      advisingBankSwift: "BNPAFRPP",
    };

    const message = generator.generate(data);

    expect(message).toContain(":20:LC2024001");
    expect(message).toContain(":50:CONDOR ELECTRONICS");
    expect(message).toContain(":59:SAMSUNG ELECTRONICS");
    expect(message).toContain(":32B:USD500000.00");
    expect(message).toContain(":45A:ELECTRONIC COMPONENTS");
    expect(message).toContain("IRREVOCABLE");
  });
});
