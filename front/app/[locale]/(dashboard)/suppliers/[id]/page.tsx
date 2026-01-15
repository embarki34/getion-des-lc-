"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Supplier } from "@/lib/types/models";
import { SuppliersService } from "@/lib/services/suppliers.service";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function SupplierDetailsPage() {
    const params = useParams();
    const id = params.id as string;

    const commonT = useTranslations("Common");
    const suppliersT = useTranslations("Suppliers");
    // const companiesT = useTranslations("Companies");

    const [supplier, setSupplier] = React.useState<Supplier | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const data = await SuppliersService.getSupplierById(id);
                setSupplier(data);
            } catch (err) {
                console.error("Error fetching supplier details:", err);
                setError(err instanceof Error ? err.message : "Failed to load supplier details");
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

    if (error || !supplier) {
        return (
            <div className="flex bg-background h-full flex-col items-center justify-center space-y-4 p-8">
                <p className="text-destructive">{error || "Supplier not found"}</p>
                <Link href="/suppliers">
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
                <Link href="/suppliers">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h2 className="text-3xl font-bold tracking-tight">{supplier.name}</h2>
                <Badge variant={supplier.isActive ? "default" : "secondary"}>
                    {supplier.isActive ? commonT("active") : commonT("inactive")}
                </Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>{commonT("description")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 text-sm">
                            <div className="flex justify-between">
                                <span className="font-medium text-muted-foreground">{commonT("code")}:</span>
                                <span>{supplier.code}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between">
                                <span className="font-medium text-muted-foreground">{commonT("address")}:</span>
                                <span className="text-right text-muted-foreground">{supplier.address || "-"}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between">
                                <span className="font-medium text-muted-foreground">{commonT("contact")}:</span>
                                <span>{supplier.contactInfo || "-"}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between">
                                <span className="font-medium text-muted-foreground">Companies Count:</span>
                                <span>{supplier.companiesCount}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
