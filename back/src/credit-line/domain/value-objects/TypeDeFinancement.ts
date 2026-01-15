export enum TypeDeFinancementEnum {
  LC = "LC",
  AVANCE_SUR_STOCK = "AVANCE_SUR_STOCK",
  AVANCE_SUR_FACTURE = "AVANCE_SUR_FACTURE",
  REMISE_DOCUMENTAIRE = "REMISE_DOCUMENTAIRE",
  CMT = "CMT",
}

export class TypeDeFinancement {
  constructor(public readonly value: TypeDeFinancementEnum) {}

  public static create(value: string): TypeDeFinancement {
    if (
      !Object.values(TypeDeFinancementEnum).includes(
        value as TypeDeFinancementEnum
      )
    ) {
      throw new Error(`Invalid financing type: ${value}`);
    }
    return new TypeDeFinancement(value as TypeDeFinancementEnum);
  }
}
