"use client";

import { CompanyForm } from "@/components/forms/CompanyForm";

export default function EditCompanyPage({
  params,
}: {
  params: { id: string };
}) {
  // Mock data
  const company = {
    id: params.id,
    code: "GROUPE-A",
    name: "Groupe Industriel Alpha",
    businessUnitsCount: 5,
    usersCount: 120,
    suppliersCount: 45,
    banksCount: 3,
    isActive: true,
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <CompanyForm initialData={company} />
    </div>
  );
}
