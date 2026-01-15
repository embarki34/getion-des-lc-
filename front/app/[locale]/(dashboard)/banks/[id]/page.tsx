"use client";

import { useEffect, useState, use } from "react";
import { useRouter, Link } from "@/i18n/routing";
import { BanksService } from "@/lib/services/banks.service";
import { Banque, BankAccount } from "@/lib/types/models";
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
  Building,
  CreditCard,
  Pencil,
  Phone,
  MapPin,
  Trash,
  Copy,
  Landmark,
  Wallet,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslations } from "next-intl";

export default function BankDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const t = useTranslations("Banks");
  const commonT = useTranslations("Common");
  const [bank, setBank] = useState<Banque | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchBank = async () => {
      try {
        setIsLoading(true);
        const data = await BanksService.getBankById(id);
        console.log(data);
        setBank(data);
      } catch (err: any) {
        setError(err.message || t("loadingFailed"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchBank();
  }, [id, t]);

  const handleDelete = async () => {
    if (!confirm(t("deleteConfirm"))) {
      return;
    }

    try {
      setIsDeleting(true);
      await BanksService.deleteBank(id);
      toast.success(t("deleteSuccess"));
      router.push("/banks");
    } catch (err: any) {
      toast.error(err.message || t("deleteFailed"));
      setIsDeleting(false);
    }
  };

  const handleDeleteAccount = async (accountId: string) => {
    if (!confirm(t("deleteConfirm"))) {
      return;
    }

    try {
      await BanksService.deleteBankAccount(id, accountId);
      toast.success(t("accountForm.updated").replace("mis à jour", "supprimé")); // Using a generic success message or better key if available

      // Update local state to reflect deletion immediately
      if (bank) {
        setBank({
          ...bank,
          bankAccounts: bank.bankAccounts.filter(acc => acc.id !== accountId)
        });
      }
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || commonT("error"));
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(commonT("copied", { label }));
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !bank) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{commonT("error")}</AlertTitle>
          <AlertDescription>
            {error || commonT("notFound")}
            <div className="mt-4">
              <Button variant="outline" onClick={() => router.back()}>
                {t("back")}
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.back()}
            className="mt-1"
          >
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          </Button>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-bold tracking-tight">{bank.nom}</h2>
              <Badge variant="outline" className="text-base font-normal">
                {bank.codeSwift}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Building className="h-4 w-4" />
              <span>{bank.establishment}</span>
              {bank.codeGuichet && (
                <>
                  <span className="text-border mx-1">•</span>
                  <span>
                    {t("branch")}: {bank.codeGuichet}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/banks/${id}/edit`}>
            <Button variant="outline" className="h-9">
              <Pencil className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
              {t("edit")}
            </Button>
          </Link>
          <Button
            variant="destructive"
            className="h-9"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin rtl:ml-2 rtl:mr-0" />
            ) : (
              <Trash className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
            )}
            {t("delete")}
          </Button>
        </div>
      </div>

      <Separator />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="md:col-span-1 border-l-4 border-l-primary rtl:border-l-0 rtl:border-r-4 rtl:border-r-primary">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              {t("contactInfo")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">
                {t("adresse")}
              </div>
              <div className="text-sm leading-relaxed">{bank.adresse}</div>
            </div>
            {bank.contactInfo && (
              <>
                <Separator />
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Phone className="h-4 w-4" /> {t("contact")}
                  </div>
                  <div className="text-sm">{bank.contactInfo}</div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6 md:col-span-2 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("totalAccounts")}
              </CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {bank.bankAccounts?.length || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {t("activeAccounts")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("systemStatus")}
              </CardTitle>
              <Landmark className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-600 hover:bg-green-700">
                  {t("active")}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {t("lastUpdated")}{" "}
                  {new Date(bank.updatedAt || new Date()).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              {t("bankAccounts")}
            </CardTitle>
            <CardDescription>{t("manageAccounts")}</CardDescription>
          </div>
          <Button size="sm" onClick={() => router.push(`/banks/${id}/accounts/new`)}>
            <CreditCard className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
            {t("addAccount")}
          </Button>
        </CardHeader>
        <CardContent>
          {!bank.bankAccounts || bank.bankAccounts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
              <div className="rounded-full bg-muted p-4 mb-4">
                <Wallet className="h-8 w-8" />
              </div>
              <p className="text-lg font-medium">{t("noAccounts")}</p>
              <p className="text-sm mb-4">{t("noAccountsDesc")}</p>
              <Button variant="outline" size="sm">
                {t("addFirstAccount")}
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("accountNumber")}</TableHead>
                    <TableHead>{t("key")}</TableHead>
                    <TableHead>{t("currency")}</TableHead>
                    <TableHead>{t("rib")}</TableHead>
                    <TableHead>{t("status")}</TableHead>
                    <TableHead className="text-right rtl:text-left">
                      {commonT("actions")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bank.bankAccounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell className="font-medium font-mono">
                        {account.accountNumber}
                      </TableCell>
                      <TableCell className="font-mono text-muted-foreground">
                        {account.keyAccount}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-bold">
                          {account.currency}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 font-mono text-sm">
                          {account.rib || "-"}
                          {account.rib && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() =>
                                      copyToClipboard(account.rib!, t("rib"))
                                    }
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>{t("copyRib")}</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={account.isActive ? "default" : "secondary"}
                          className={
                            account.isActive
                              ? "bg-green-600/10 text-green-600 hover:bg-green-600/20"
                              : ""
                          }
                        >
                          {account.isActive ? t("active") : t("inactive")}
                        </Badge>
                      </TableCell>


                      <TableCell className="text-right rtl:text-left">
                        <div className="flex justify-end rtl:justify-start gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => router.push(`/banks/${id}/accounts/${account.id}/edit`)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleDeleteAccount(account.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
