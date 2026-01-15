import { SwiftMT700DTO } from '../../application/dto/SwiftMessageDTO';

/**
 * SWIFT MT700 Template Generator
 * Generates a SWIFT MT700 message (Issue of a Documentary Credit)
 */
export class SwiftMT700Generator {
  generate(data: SwiftMT700DTO): string {
    const lines: string[] = [];

    // Header
    lines.push('{1:F01' + data.issuingBankSwift + '0000000000}');
    lines.push('{2:O7001200' + this.formatDate(new Date()) + data.issuingBankSwift + '0000000000}');
    lines.push('{4:');

    // Field 27: Sequence of Total
    lines.push(':27:1/1');

    // Field 40A: Form of Documentary Credit
    lines.push(':40A:IRREVOCABLE');

    // Field 20: Documentary Credit Number
    lines.push(`:20:${data.referenceDossier}`);

    // Field 31C: Date of Issue
    lines.push(`:31C:${this.formatDate(new Date())}`);

    // Field 31D: Date and Place of Expiry
    lines.push(
      `:31D:${this.formatDate(new Date(data.expiryDate))} ${data.beneficiaryAddress.split(',')[0]}`
    );

    // Field 50: Applicant
    lines.push(`:50:${data.applicantName}`);
    lines.push(data.applicantAddress);

    // Field 59: Beneficiary
    lines.push(`:59:${data.beneficiaryName}`);
    lines.push(data.beneficiaryAddress);

    // Field 32B: Currency Code, Amount
    lines.push(`:32B:${data.currency}${data.amount.toFixed(2)}`);

    // Field 41D: Available With... By...
    lines.push(':41D:ANY BANK');
    lines.push('BY NEGOTIATION');

    // Field 45A: Description of Goods
    lines.push(':45A:' + data.description);

    // Field 46A: Documents Required
    lines.push(':46A:');
    lines.push('+ COMMERCIAL INVOICE IN TRIPLICATE');
    lines.push('+ PACKING LIST');
    lines.push('+ BILL OF LADING');

    // Field 47A: Additional Conditions
    lines.push(':47A:');
    lines.push('ALL DOCUMENTS MUST BE PRESENTED WITHIN 21 DAYS');

    // Field 71B: Charges
    lines.push(':71B:ALL CHARGES OUTSIDE ISSUING BANK ARE FOR BENEFICIARY');

    // Field 48: Period for Presentation
    lines.push(':48:21 DAYS AFTER SHIPMENT DATE');

    // Field 49: Confirmation Instructions
    lines.push(':49:WITHOUT');

    // Trailer
    lines.push('-}');

    return lines.join('\n');
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear().toString().slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  }
}
