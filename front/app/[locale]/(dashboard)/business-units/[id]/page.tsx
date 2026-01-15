"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { BusinessUnit, Supplier, User } from "@/lib/types/models";
import { BusinessUnitsService } from "@/lib/services/business-units.service";
import { SuppliersService } from "@/lib/services/suppliers.service";
import { UsersService } from "@/lib/services/users.service";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { DataTable } from "@/components/tables/DataTable";
import { getColumns as getSupplierColumns } from "../../suppliers/columns";
import { getColumns as getUserColumns } from "../../users/columns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function BusinessUnitDetailsPage() {
    const params = useParams();
    const id = params.id as string;
    const locale = useLocale();

    const commonT = useTranslations("Common");
    const buT = useTranslations("BusinessUnits");
    const usersT = useTranslations("Users");
    const suppliersT = useTranslations("Suppliers");
    const companiesT = useTranslations("Companies"); // Need this for supplier columns header

    const [businessUnit, setBusinessUnit] = React.useState<BusinessUnit | null>(null);
    const [users, setUsers] = React.useState<User[]>([]);
    const [suppliers, setSuppliers] = React.useState<Supplier[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [buData, usersData, suppliersData] = await Promise.all([
                    BusinessUnitsService.getBusinessUnitById(id),
                    UsersService.getUsers({ businessUnitId: id }),
                    SuppliersService.getSuppliers({ businessUnitId: id })
                ]);

                setBusinessUnit(buData);
                setUsers(usersData);
                setSuppliers(suppliersData);
            } catch (err) {
                console.error("Error fetching business unit details:", err);
                console.error("Error details:", {
                    message: err instanceof Error ? err.message : String(err),
                    businessUnitId: id
                });
                setError(err instanceof Error ? err.message : "Failed to load business unit details");
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    // Columns Configuration
    const supplierColumns = React.useMemo(() => getSupplierColumns(suppliersT, commonT, companiesT), [suppliersT, commonT, companiesT]);
    const userColumns = React.useMemo(() => getUserColumns(usersT, commonT, locale), [usersT, commonT, locale]);

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (error || !businessUnit) {
        return (
            <div className="flex bg-background h-full flex-col items-center justify-center space-y-4 p-8">
                <p className="text-destructive">{error || "Business Unit not found"}</p>
                <Link href="/business-units">
                    <Button variant="outline">
                        <ArrowLeft className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
                        {commonT("back")}
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center space-x-4">
                <Link href="/business-units">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h2 className="text-3xl font-bold tracking-tight">{businessUnit.name}</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>{buT("description")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm text-muted-foreground">
                            {businessUnit.description || "-"}
                        </div>
                        <Separator className="my-4" />
                        <div className="grid gap-2 text-sm">
                            <div className="flex justify-between">
                                <span className="font-medium text-muted-foreground">{commonT("code")}:</span>
                                <span>{businessUnit.code}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-muted-foreground">{buT("company")}:</span>
                                <Link href={`/companies/${businessUnit.companyId}`} className="text-blue-600 hover:underline">
                                    {businessUnit.companyName}
                                </Link>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="users" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="users">{usersT("title")}</TabsTrigger>
                    <TabsTrigger value="suppliers">{suppliersT("title")}</TabsTrigger>
                </TabsList>
                <TabsContent value="users" className="space-y-4">
                    <DataTable columns={userColumns} data={users} searchKey="name" />
                </TabsContent>
                <TabsContent value="suppliers" className="space-y-4">
                    <DataTable columns={supplierColumns} data={suppliers} searchKey="name" />
                </TabsContent>
            </Tabs>
        </div>
    );
}
