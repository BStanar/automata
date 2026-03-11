"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useMemo } from "react";
import {
  BaMunicipality,
  getMunicipalityOptions,
} from "@/config/municipalities";

const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  registrationNumber: z.string().optional(),
  vatNumber: z.string().optional(),
  streetAddress: z.string().min(1, "Street address is required").max(100),
  city: z.enum(BaMunicipality, { error: "Invalid municipality" }),
  postalCode: z.string().min(1, "Postal code is required"),
  telephoneNumber: z.string().optional(),
  telephoneNumberSecondary: z.string().optional(),
  faxNumber: z.string().optional(),
  email: z.email(),
});

export type ClientFormValues = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: ClientFormValues) => void;
  defaultValues?: Partial<ClientFormValues>;
  mode?: "create" | "edit";
}

export const ClientFormDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  mode = "create",
}: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      registrationNumber: defaultValues?.registrationNumber ?? "",
      vatNumber: defaultValues?.vatNumber ?? "",
      streetAddress: defaultValues?.streetAddress ?? "",
      city: defaultValues?.city ?? undefined,
      postalCode: defaultValues?.postalCode ?? "",
      telephoneNumber: defaultValues?.telephoneNumber ?? "",
      telephoneNumberSecondary: defaultValues?.telephoneNumberSecondary ?? "",
      faxNumber: defaultValues?.faxNumber ?? "",
      email: defaultValues?.email ?? "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: defaultValues?.name ?? "",
        registrationNumber: defaultValues?.registrationNumber ?? "",
        vatNumber: defaultValues?.vatNumber ?? "",
        streetAddress: defaultValues?.streetAddress ?? "",
        city: defaultValues?.city ?? undefined,
        postalCode: defaultValues?.postalCode ?? "",
        telephoneNumber: defaultValues?.telephoneNumber ?? "",
        telephoneNumberSecondary: defaultValues?.telephoneNumberSecondary ?? "",
        faxNumber: defaultValues?.faxNumber ?? "",
        email: defaultValues?.email ?? "",
      });
    }
  }, [open, form]);

  const handleSubmit = (values: ClientFormValues) => {
    onSubmit(values);
    onOpenChange(false);
  };

  const municipalityOptions = useMemo(() => getMunicipalityOptions(), []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "New Client" : "Edit Client"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Add a new client to your system."
              : "Update the client details."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6 mt-4"
          >
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. Zavod za zdravstvo" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              {/* Registration Number */}
              <FormField
                control={form.control}
                name="registrationNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>MBS</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. MBS" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* VAT Number */}
              <FormField
                control={form.control}
                name="vatNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>JIB</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. JIB" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
              {/* Street Address */}
              <FormField
                control={form.control}
                name="streetAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street Address</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. Ferde Hauptmana 25" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <div className="grid grid-cols-2 gap-4">
              {/* City */}
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a city" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-60">
                        {municipalityOptions.map(({ value, label }) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal Code</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. 71000" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
              {/* Postal Code Address */}
              
            <div className="grid grid-cols-2 gap-4">
              {/* telephoneNumber */}
              <FormField
                control={form.control}
                name="telephoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telephone Number</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. +38762881786" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Telephone Number Secondary */}
              <FormField
                control={form.control}
                name="telephoneNumberSecondary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telephone Number Secondary</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. +38762881786" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Fax Number */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="faxNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fax Number</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. +38762881786" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="email@example.com"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="p-8">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {mode === "create" ? "Create" : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
