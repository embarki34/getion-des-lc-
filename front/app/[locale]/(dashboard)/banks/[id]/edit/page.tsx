"use client";

import { BankForm } from "@/components/forms/BankForm";

export default function EditBankPage({ params }: { params: { id: string } }) {
  // Mock data
  const bank = {
    id: params.id,
    swiftCode: "BNAAAZDA",
    name: "Banque Nationale d'Algérie (BNA)",
    address: "8 Bd Ernesto Che Guevara, Alger",
    contactInfo: "+213 21 71 47 18",
    creditLinesCount: 8,
    createdAt: new Date(),
    updatedAt: new Date(),
    active: true,
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <BankForm initialData={bank} />
    </div>
  );
}
