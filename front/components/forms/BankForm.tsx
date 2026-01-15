"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useRouter } from "@/i18n/routing";
import { toast } from "sonner";
import { BanksService } from "@/lib/services/banks.service";
import { useTranslations } from "next-intl";

interface BankFormProps {
  initialData?: any | null;
}

export function BankForm({ initialData }: BankFormProps) {
  const router = useRouter();
  const t = useTranslations("Banks.form");
  const commonT = useTranslations("Common");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const formSchema = z.object({
    codeSwift: z
      .string()
      .min(8, {
        message: t("swiftDesc"),
      })
      .max(11, {
        message: t("swiftDesc"),
      })
      .regex(/^[A-Z0-9]+$/, {
        message: t("swiftDesc"),
      }),
    nom: z.string().min(2, {
      message: commonT("required"),
    }),
    codeGuichet: z.string().optional(),
    establishment: z.string().min(1, {
      message: commonT("required"),
    }),
    adresse: z.string().min(10, {
      message: commonT("required"),
    }),
    contactInfo: z.string().optional(),
  });

  const title = initialData ? t("updateTitle") : t("createTitle");
  const description = initialData ? t("updateDesc") : t("createDesc");
  const toastMessage = initialData ? t("successUpdate") : t("successCreate");
  const action = initialData ? commonT("save") : commonT("create");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          codeSwift: initialData.codeSwift || "",
          nom: initialData.nom || "",
          codeGuichet: initialData.codeGuichet || "",
          establishment: initialData.establishment || "",
          adresse: initialData.adresse || "",
          contactInfo: initialData.contactInfo || "",
        }
      : {
          codeSwift: "",
          nom: "",
          codeGuichet: "",
          establishment: "",
          adresse: "",
          contactInfo: "",
        },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      if (initialData) {
        // Update existing bank
        await BanksService.updateBank(initialData.id, {
          ...values,
          bankAccounts: initialData.bankAccounts || [],
        });
      } else {
        // Create new bank
        await BanksService.createBank({
          ...values,
          bankAccounts: [],
        });
      }

      toast.success(toastMessage);
      router.push("/banks");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || t("error"));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="codeSwift"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code SWIFT</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ABCDDZDA"
                      {...field}
                      onChange={(e) =>
                        field.onChange(e.target.value.toUpperCase())
                      }
                      disabled={!!initialData}
                    />
                  </FormControl>
                  <FormDescription>{t("swiftDesc")}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("nomLabel")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("nomPlace")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="codeGuichet"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code Guichet</FormLabel>
                  <FormControl>
                    <Input placeholder="00123" {...field} />
                  </FormControl>
                  <FormDescription>{t("guichetDesc")}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="establishment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Établissement</FormLabel>
                  <FormControl>
                    <Input placeholder={t("estPlace")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="adresse"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Adresse</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("addrPlace")}
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactInfo"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>{t("contactInfo")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("contactPlace")} {...field} />
                  </FormControl>
                  <FormDescription>{t("contactDesc")}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex items-center gap-4">
            <Button disabled={isLoading} type="submit">
              {isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin rtl:ml-2 rtl:mr-0" />
              )}
              {action}
            </Button>
            <Button
              variant="outline"
              type="button"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              {commonT("cancel")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
