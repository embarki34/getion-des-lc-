"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BanksService } from "@/lib/services/banks.service";
import { CreditLinesService } from "@/lib/services/credit-lines.service";
import { Banque } from "@/lib/types/models";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Plus, Trash } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface CreditLineFormProps {
  initialData?: any; // Should be typed properly, using any for now to match form state
  isEditing?: boolean;
}

export function CreditLineForm({ initialData, isEditing = false }: CreditLineFormProps) {
  const router = useRouter();
  const [banks, setBanks] = useState<Banque[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isBanksLoading, setIsBanksLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    banqueId: initialData?.banqueId || "",
    no: initialData?.no || "",
    description: initialData?.description || "",
    autorisationNo: initialData?.autorisationNo || "",
    bankAccountNo: initialData?.bankAccountNo || "",
    montantPlafond: initialData?.montantPlafond?.toString() || "",
    montantDevise: initialData?.montantDevise || "DZD",
    taux: initialData?.taux?.toString() || "",
    commitmentCommissionRate: initialData?.commitmentCommissionRate?.toString() || "",
    startDate: initialData?.startDate ? new Date(initialData.startDate) : new Date(),
    expiryDate: initialData?.expiryDate ? new Date(initialData.expiryDate) : new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    typeFinancement: initialData?.typeFinancement || "EXPL", // Default
    responsibilityCenter: initialData?.responsibilityCenter || "",
    maxConsumptionTolerance: initialData?.maxConsumptionTolerance?.toString() || "0",
    minConsumptionTolerance: initialData?.minConsumptionTolerance?.toString() || "0",
    noSeries: initialData?.noSeries || "",
    refinancing: initialData?.refinancing?.toString() || "0",
  });

  // Nested states
  const [thresholds, setThresholds] = useState({
    seuilAvanceSurStock: initialData?.thresholds?.seuilAvanceSurStock?.toString() || "0",
    seuilAvanceSurFacture: initialData?.thresholds?.seuilAvanceSurFacture?.toString() || "0",
    seuilEscompte: initialData?.thresholds?.seuilEscompte?.toString() || "0",
    seuilLC: initialData?.thresholds?.seuilLC?.toString() || "0",
    seuilObligtDouane: initialData?.thresholds?.seuilObligtDouane?.toString() || "0",
    seuilCautionAdmin: initialData?.thresholds?.seuilCautionAdmin?.toString() || "0",
    seuilDcvrtMobile: initialData?.thresholds?.seuilDcvrtMobile?.toString() || "0",
    seuilTrsfrLibre: initialData?.thresholds?.seuilTrsfrLibre?.toString() || "0",
    seuilLeasing: initialData?.thresholds?.seuilLeasing?.toString() || "0",
    seuilCMT: initialData?.thresholds?.seuilCMT?.toString() || "0",
    seuilFraisMission: initialData?.thresholds?.seuilFraisMission?.toString() || "0",
    seuilLCAS: initialData?.thresholds?.seuilLCAS?.toString() || "0",
  });


  const [garanties, setGaranties] = useState<any[]>(
    initialData?.garanties?.map((g: any) => ({
      ...g,
      montant: g.montant?.toString(),
      dateExpiration: new Date(g.dateExpiration),
    })) || []
  );

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const data = await BanksService.getBanks();
        setBanks(data);
      } catch (error) {
        toast.error("Failed to load banks");
      } finally {
        setIsBanksLoading(false);
      }
    };
    fetchBanks();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setThresholds((prev) => ({ ...prev, [name]: value }));
  };

  const addGuarantee = () => {
    setGaranties([
      ...garanties,
      {
        type: "Nantissement",
        montant: "0",
        dateExpiration: new Date(),
        description: "",
      },
    ]);
  };

  const removeGuarantee = (index: number) => {
    setGaranties(garanties.filter((_, i) => i !== index));
  };

  const updateGuarantee = (index: number, field: string, value: any) => {
    const updated = [...garanties];
    updated[index][field] = value;
    setGaranties(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate Logic (Domain Rule: Expiry > Start)
      if (formData.expiryDate <= formData.startDate) {
        throw new Error("Expiry date must be after start date");
      }

      // Construct Payload
      const payload = {
        ...formData,
        montantPlafond: parseFloat(formData.montantPlafond) || 0,
        taux: parseFloat(formData.taux) || 0,
        commitmentCommissionRate:
          parseFloat(formData.commitmentCommissionRate) || 0,
        maxConsumptionTolerance:
          parseFloat(formData.maxConsumptionTolerance) || 0,
        minConsumptionTolerance:
          parseFloat(formData.minConsumptionTolerance) || 0,
        refinancing: parseFloat(formData.refinancing) || 0,
        thresholds: Object.entries(thresholds).reduce(
          (acc, [key, val]) => ({
            ...acc,
            [key]: parseFloat(val) || 0,
          }),
          {}
        ),
        garanties: garanties.map((g) => ({
          ...g,
          montant: parseFloat(g.montant) || 0,
          dateExpiration: g.dateExpiration.toISOString(), // Ensure ISO string for API
        })),
      };

      if (isEditing && initialData?.id) {
        await CreditLinesService.updateCreditLine(initialData.id, payload as any);
        toast.success("Credit line updated successfully");
      } else {
        await CreditLinesService.createCreditLine(payload as any);
        toast.success("Credit line created successfully");
      }
      router.push("/credit-lines");
    } catch (error: any) {
      toast.error(error.message || "Failed to create credit line");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>General Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Bank</Label>
            <Select
              disabled={isBanksLoading}
              onValueChange={(val) =>
                setFormData({ ...formData, banqueId: val, bankAccountNo: "" })
              }
              value={formData.banqueId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a bank" />
              </SelectTrigger>
              <SelectContent>
                {banks.map((bank) => (
                  <SelectItem key={bank.id} value={bank.id}>
                    {bank.nom} ({bank.codeSwift})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Credit Line Number (N°)</Label>
            <Input
              name="no"
              required
              value={formData.no}
              onChange={handleInputChange}
              placeholder="LC-2024-XXX"
            />
          </div>
          <div className="space-y-2">
            <Label>Libellé</Label>
            <Input
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label>N° autorisation</Label>
            <Input
              name="autorisationNo"
              value={formData.autorisationNo}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label>N° compte bancaire</Label>
            <Select
              disabled={!formData.banqueId}
              onValueChange={(val) =>
                setFormData({ ...formData, bankAccountNo: val })
              }
              value={formData.bankAccountNo}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an account" />
              </SelectTrigger>
              <SelectContent>
                {banks
                  .find((b) => b.id === formData.banqueId)
                  ?.bankAccounts?.map((account) => (
                    <SelectItem key={account.id} value={account.accountNumber}>
                      {account.accountNumber} ({account.currency})
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Centre de gestion</Label>
            <Input
              name="responsibilityCenter"
              value={formData.responsibilityCenter}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label>&lt;refinancing&gt;</Label>
            <Input
              name="refinancing"
              type="number"
              value={formData.refinancing}
              onChange={handleInputChange}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Financials & Dates</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Montant</Label>
            <Input
              name="montantPlafond"
              type="number"
              required
              value={formData.montantPlafond}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label>Devise</Label>
            <Select
              onValueChange={(val) =>
                setFormData({ ...formData, montantDevise: val })
              }
              value={formData.montantDevise}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DZD">DZD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Taux d&apos;interêts (%)</Label>
            <Input
              name="taux"
              type="number"
              step="0.01"
              value={formData.taux}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label>Taux de comission d&apos;engagement (%)</Label>
            <Input
              name="commitmentCommissionRate"
              type="number"
              step="0.01"
              value={formData.commitmentCommissionRate}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label>Date début</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.startDate ? (
                    format(formData.startDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.startDate}
                  onSelect={(date) =>
                    date && setFormData({ ...formData, startDate: date })
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label>Date d&apos;échéance</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.expiryDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.expiryDate ? (
                    format(formData.expiryDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.expiryDate}
                  onSelect={(date) =>
                    date && setFormData({ ...formData, expiryDate: date })
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Thresholds (Seuils)</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-4">
          {Object.keys(thresholds).map((key) => {
            const labels: Record<string, string> = {
              seuilAvanceSurStock: "Seuil Avance sur stock",
              seuilAvanceSurFacture: "Seuil Avance sur facture",
              seuilEscompte: "Seuil Escompte",
              seuilLC: "Seuil LC",
              seuilObligtDouane: "Seuil Obligation douane",
              seuilCautionAdmin: "Seuil caution administrative",
              seuilDcvrtMobile: "Seuil decouvert mobilisable",
              seuilTrsfrLibre: "Seuil transfert libre",
              seuilLeasing: "Seuil leasing",
              seuilCMT: "Seuil Crédit a moyen terme",
              seuilFraisMission: "Seuil Frais mission",
              seuilLCAS: "Seuil LCAS",
            };
            return (
              <div key={key} className="space-y-2">
                <Label className="capitalize">{labels[key] || key}</Label>
                <Input
                  name={key}
                  type="number"
                  value={(thresholds as any)[key]}
                  onChange={handleThresholdChange}
                />
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Guarantees</CardTitle>
          <Button type="button" variant="outline" onClick={addGuarantee}>
            <Plus className="h-4 w-4 mr-2" /> Add Guarantee
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {garanties.map((g, index) => (
            <div
              key={index}
              className="flex gap-4 items-end border p-4 rounded-md"
            >
              <div className="space-y-2 flex-1">
                <Label>Type</Label>
                <Input
                  value={g.type}
                  onChange={(e) =>
                    updateGuarantee(index, "type", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2 flex-1">
                <Label>Amount</Label>
                <Input
                  type="number"
                  value={g.montant}
                  onChange={(e) =>
                    updateGuarantee(index, "montant", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2 flex-1">
                <Label>Expiry</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full">
                      {g.dateExpiration ? (
                        format(g.dateExpiration, "PPP")
                      ) : (
                        <span>Pick date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={g.dateExpiration}
                      onSelect={(date) =>
                        date && updateGuarantee(index, "dateExpiration", date)
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeGuarantee(index)}
              >
                <Trash className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading
          ? isEditing
            ? "Updating..."
            : "Creating..."
          : isEditing
            ? "Update Credit Line"
            : "Create Credit Line"}
      </Button>
    </form>
  );
}
