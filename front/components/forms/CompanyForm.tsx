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
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { useRouter } from "@/i18n/routing";
import { toast } from "sonner";
import { Company } from "@/lib/types/models";
import { useTranslations } from "next-intl";
import { CompaniesService } from "@/lib/services/companies.service";

interface CompanyFormProps {
  initialData?: Company | null;
}

export function CompanyForm({ initialData }: CompanyFormProps) {
  const router = useRouter();
  const t = useTranslations("Companies");
  const commonT = useTranslations("Common");
  const formT = useTranslations("Forms");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const formSchema = z.object({
    code: z.string().min(2, {
      message: commonT("required"),
    }),
    name: z.string().min(2, {
      message: commonT("required"),
    }),
    description: z.string().optional(),
    address: z.string().optional(),
    contactInfo: z.string().optional(),
    isActive: z.boolean().default(true),
    parentCompanyId: z.string().optional(),
  });

  const title = initialData ? commonT("edit") : commonT("create");
  const descText = initialData
    ? t("editDesc") || "Edit company"
    : t("createDesc") || "Add company";
  const action = initialData ? commonT("save") : commonT("create");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
        code: initialData.code,
        name: initialData.name,
        description: (initialData as any).description || "",
        address: (initialData as any).address || "",
        contactInfo: (initialData as any).contactInfo || "",
        isActive: initialData.isActive,
        parentCompanyId: initialData.parentCompany || "",
      }
      : {
        code: "",
        name: "",
        description: "",
        address: "",
        contactInfo: "",
        isActive: true,
        parentCompanyId: "",
      },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    const payload = {
      ...values,
      parentCompanyId: values.parentCompanyId || undefined,
    };

    try {
      if (initialData) {
        await CompaniesService.updateCompany(initialData.id, payload);
        toast.success(commonT("updateSuccess") || "Company updated successfully");
      } else {
        await CompaniesService.createCompany(payload);
        toast.success(commonT("createSuccess") || "Company created successfully");
      }
      router.push("/companies");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{descText}</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Main Grid */}
          <div className="grid gap-4 md:grid-cols-2">

            {/* Code */}
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{commonT("code")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="COMP-001"
                      {...field}
                      disabled={!!initialData}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{commonT("name")}</FormLabel>
                  <FormControl>
                    <Input placeholder="Acme Corp" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>{commonT("description")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Address */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                  <FormLabel>{commonT("address")}</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Main St" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Contact Info */}
            <FormField
              control={form.control}
              name="contactInfo"
              render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                  <FormLabel>{commonT("contactInfo")}</FormLabel>
                  <FormControl>
                    <Input placeholder="contact@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Active Status */}
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 col-span-2 rtl:space-x-reverse">
                  <FormControl>
                    <Checkbox
                      checked={!!field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>{commonT("status")}</FormLabel>
                    <FormDescription>
                      {t("activeDesc") || "Is this company active?"}
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>

          {/* Actions */}
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
