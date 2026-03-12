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
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useMemo } from "react";
import {
  BaMunicipality,
  getMunicipalityOptions,
} from "@/config/municipalities";
import { FormInputField } from "../../../components/form-input-field";
import { FormSelectField } from "@/components/form-select-field";

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
  mode?: "create" | "edit" | "view";
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
    onSubmit?.(values);
    onOpenChange(false);
  };

  const municipalityOptions = useMemo(() => getMunicipalityOptions(), []);

  const title = {
    create: "New Client",
    edit: "Edit Client",
    view: "Client Details",
  }[mode];

  const description = {
    create: "Add a new client to your system.",
    edit: "Update the client details.",
    view: "Viewing client details.",
  }[mode];

  const isReadOnly = mode === "view";
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4 mt-4"
          >
            <FormInputField
              control={form.control}
              name="name"
              label="Client name"
              placeholder="e.g. Hospital 1"
              type="text"
              disabled={isReadOnly}
            />

            <div className="grid grid-cols-2 gap-4 items-start">
              <FormInputField
                control={form.control}
                name="registrationNumber"
                label="MBS"
                placeholder="e.g. 4200000000000"
                disabled={isReadOnly}
              />
              <FormInputField
                control={form.control}
                name="vatNumber"
                label="JIB"
                placeholder="e.g. 200000000000"
                disabled={isReadOnly}
              />
            </div>

            <FormInputField
              control={form.control}
              name="streetAddress"
              label="Street Address"
              placeholder="e.g. Ferde Hauptmana 25"
              disabled={isReadOnly}
            />

            <div className="grid grid-cols-2 gap-4 items-start">
              <FormSelectField
                control={form.control}
                name="city"
                label="City"
                options={municipalityOptions}
                placeholder="Select a city"
                disabled={isReadOnly}
              />
              <FormInputField
                control={form.control}
                name="postalCode"
                label="Postal Code"
                placeholder="e.g. 71000"
                disabled={isReadOnly}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 items-start">
              <FormInputField
                control={form.control}
                name="telephoneNumber"
                label="Telephone Number"
                placeholder="e.g. +38762881786"
                disabled={isReadOnly}
              />
              <FormInputField
                control={form.control}
                name="telephoneNumberSecondary"
                label="Secondary Telephone Number "
                placeholder="e.g. +38762881786"
                disabled={isReadOnly}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 items-start">
              <FormInputField
                control={form.control}
                name="faxNumber"
                label="Fax Number"
                placeholder="e.g. +38733881786"
                disabled={isReadOnly}
              />
              <FormInputField
                control={form.control}
                name="email"
                label="Email"
                type="email"
                placeholder="email@example.com"
                disabled={isReadOnly}
              />
            </div>

            <DialogFooter>
              {isReadOnly ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Close
                </Button>
              ) : (
                <>
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
                </>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
