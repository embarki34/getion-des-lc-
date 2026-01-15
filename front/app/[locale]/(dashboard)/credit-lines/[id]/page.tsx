"use client";

import { useEffect, useState, use } from "react"; // Added 'use' for params unwrap
import { useRouter } from "next/navigation";
import { CreditLinesService } from "@/lib/services/credit-lines.service";
import { CreditLine, Guarantee } from "@/lib/types/models";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  DollarSign,
  PieChart,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  FileText,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function CreditLineDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params); // Unwrap params
  const router = useRouter();
  const [data, setData] = useState<CreditLine | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        const result = await CreditLinesService.getCreditLineById(id);
        // Robust check: API client might return unwrapped data or wrapped in { data: ... }
        // @ts-ignore
        setData(result.data || result);
      } catch (err: any) {
        setError(err.message || "Failed to load credit line details");
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error || "Credit line not found"}
          </AlertDescription>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => router.push("/credit-lines")}
          >
            Go Back
          </Button>
        </Alert>
      </div>
    );
  }

  // Calculate generic utilization for UI
  const utilization =
    data.consumption && data.montantPlafond
      ? (data.consumption / data.montantPlafond) * 100
      : 0;

  const handleEdit = () => {
    router.push(`/credit-lines/${id}/edit`);
  };

  const handleClose = async () => {
    try {
      if (!confirm("Are you sure you want to close this credit line?")) return;

      setIsLoading(true);
      await CreditLinesService.updateCreditLine(id, { statut: "CLOTURE" }); // Assuming 'CLOTURE' is correct value matching backend enum
      toast.success("Credit line closed successfully");

      // Refresh data
      const result = await CreditLinesService.getCreditLineById(id);
      setData(result.data);
    } catch (error) {
      toast.error("Failed to close credit line");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-bold tracking-tight">{data.no}</h2>
              <Badge
                variant={data.statut === "OUVERT" ? "default" : "secondary"}
              >
                {data.statut}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1 text-sm flex items-center gap-2">
              <span className="font-medium">{data.banqueId}</span> •{" "}
              {data.description || "No description"}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleEdit}>Edit</Button>
          <Button variant="destructive" onClick={handleClose}>Close Line</Button>
        </div>
      </div>

      <Separator />

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ceiling (Plafond)
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("fr-FR", {
                style: "currency",
                currency: data.montantDevise || "DZD",
              }).format(data.montantPlafond)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consumed</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {new Intl.NumberFormat("fr-FR", {
                style: "currency",
                currency: data.montantDevise || "DZD",
              }).format(data.consumption)}
            </div>
            <Progress value={utilization} className="mt-2 h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {utilization.toFixed(1)}% utilized
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {new Intl.NumberFormat("fr-FR", {
                style: "currency",
                currency: data.montantDevise || "DZD",
              }).format(data.montantPlafond - data.consumption)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiry</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Date(data.expiryDate).toLocaleDateString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Start: {new Date(data.startDate).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Details */}
      <Tabs defaultValue="guarantees" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="financials">Breakdown</TabsTrigger>
          <TabsTrigger value="guarantees">Guarantees</TabsTrigger>
        </TabsList>

        <TabsContent value="guarantees" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5" />
                Guarantees List
              </CardTitle>
              <CardDescription>
                Collateral and guarantees linked to this credit line.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Note: In nested schema, guarantees might be in data.garanties if returned by API */}
              {/* If not returned by default findOne, we might need a separate fetch or includes. 
                  Based on Prisma schema, they are relations. Backend usually includes them if requested. 
                  Assuming data includes guarantees array based on user request schema.
              */}
              {!data.garanties || data.garanties.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <ShieldCheck className="h-10 w-10 mx-auto mb-3 opacity-20" />
                  <p>No guarantees found for this credit line.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Expiration</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.garanties.map((g: Guarantee, idx: number) => (
                      <TableRow key={g.id || idx}>
                        <TableCell className="font-medium">{g.type}</TableCell>
                        <TableCell>{g.description || "-"}</TableCell>
                        <TableCell className="font-mono">
                          {new Intl.NumberFormat("fr-FR", {
                            style: "currency",
                            currency: data.montantDevise || "DZD",
                          }).format(g.montant)}
                        </TableCell>
                        <TableCell>
                          {new Date(g.dateExpiration).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              new Date(g.dateExpiration) < new Date()
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {new Date(g.dateExpiration) < new Date()
                              ? "Expired"
                              : "Active"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Authorization No
                </h4>
                <p>{data.autorisationNo}</p>
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Bank Account
                </h4>
                <p className="font-mono">{data.bankAccountNo}</p>
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Financing Type
                </h4>
                <p>{data.typeFinancement}</p>
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Interest Rate
                </h4>
                <p>{data.taux}%</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financials">
          <Card>
            <CardHeader>
              <CardTitle>Consumption Breakdown vs Thresholds</CardTitle>
              <CardDescription>
                Detailed usage per financing type.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">
                      Threshold (Seuil)
                    </TableHead>
                    <TableHead className="text-right">Consumed</TableHead>
                    <TableHead className="text-right">Utilization</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Create rows based on known keys or dynamic iteration */}
                  {[
                    "avanceSurStock",
                    "avanceFacture",
                    "escompte",
                    "LC",
                    "obligatDouane",
                    "cautionAdmin",
                    "dcvrtMobile",
                    "trsfrLibre",
                    "leasing",
                    "CMT",
                    "fraisMission",
                    "LCAS"
                  ].map((key) => {
                    const consumption = data.consumptionBreakdown?.[key] || 0;
                    // Threshold key mapping: avanceSurStock -> seuilAvanceSurStock
                    const thresholdKey = `seuil${key.charAt(0).toUpperCase() + key.slice(1)
                      }`;
                    const threshold = data.thresholds?.[thresholdKey] || 0;

                    if (consumption === 0 && threshold === 0) return null; // Skip empty rows

                    const percent =
                      threshold > 0 ? (consumption / threshold) * 100 : 0;

                    return (
                      <TableRow key={key}>
                        <TableCell className="capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </TableCell>
                        <TableCell className="text-right font-mono text-muted-foreground">
                          {threshold > 0
                            ? new Intl.NumberFormat("fr-FR").format(threshold)
                            : "-"}
                        </TableCell>
                        <TableCell className="text-right font-mono font-medium">
                          {new Intl.NumberFormat("fr-FR").format(consumption)}
                        </TableCell>
                        <TableCell className="text-right">
                          {threshold > 0 ? (
                            <Badge
                              variant={
                                percent > 100 ? "destructive" : "outline"
                              }
                            >
                              {percent.toFixed(1)}%
                            </Badge>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
