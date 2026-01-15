"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Company, BusinessUnit } from "@/lib/types/models";
import { CompaniesService } from "@/lib/services/companies.service";
import { BusinessUnitsService } from "@/lib/services/business-units.service";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { DataTable } from "@/components/tables/DataTable";
import { getColumns as getBUColumns } from "../../business-units/columns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function CompanyDetailsPage() {
    const params = useParams();
    const id = params.id as string;

    const t = useTranslations("Companies");
    const commonT = useTranslations("Common");
    const buT = useTranslations("BusinessUnits");
    const usersT = useTranslations("Users");
    const suppliersT = useTranslations("Suppliers");

    const [company, setCompany] = React.useState<Company | null>(null);
    const [businessUnits, setBusinessUnits] = React.useState<BusinessUnit[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [companyData, buData] = await Promise.all([
                    CompaniesService.getCompanyById(id),
                    BusinessUnitsService.getBusinessUnits(id)
                ]);

                setCompany(companyData);
                setBusinessUnits(buData);
            } catch (err) {
                console.error("Error fetching company details:", err);
                setError("Failed to load company details");
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (error || !company) {
        return (
            <div className="flex bg-background h-full flex-col items-center justify-center space-y-4 p-8">
                <p className="text-destructive">{error || "Company not found"}</p>
                <Link href="/companies">
                    <Button variant="outline">
                        <ArrowLeft className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
                        {commonT("back")}
                    </Button>
                </Link>
            </div>
        );
    }

    // We reuse BU columns but we might want to hide the Company Name column since we are in the Company Details
    // Filter out 'companyName' column if possible or just show it (it will be redundant but active)
    const columns = getBUColumns(buT, commonT, usersT, suppliersT).filter(col =>
        // @ts-ignore
        col.accessorKey !== "companyName"
    );

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center space-x-4">
                <Link href="/companies">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h2 className="text-3xl font-bold tracking-tight">{company.name}</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>{t("description")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm text-muted-foreground">
                            {company.description || "-"}
                        </div>
                        <Separator className="my-4" />
                        <div className="grid gap-2 text-sm">
                            <div className="flex justify-between">
                                <span className="font-medium text-muted-foreground">{commonT("code")}:</span>
                                <span>{company.code}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-muted-foreground">{commonT("address")}:</span>
                                <span>{company.address || "-"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-muted-foreground">{commonT("contact")}:</span>
                                <span>{company.contactInfo || "-"}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">{t("businessUnits")}</h3>
                    {/* Add New BU button specific to this company if needed, pre-selecting company */}
                </div>
                <DataTable columns={columns} data={businessUnits} searchKey="name" />
            </div>
        </div>
    );
}
