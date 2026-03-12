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
  Form
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useMemo } from "react";
import { COUNTRY_CODES, getCountryOptions } from "@/config/countries";
import { FormTextareaField } from "@/components/form-textarea-field";
import { FormSelectField } from "@/components/form-select-field";
import { FormInputField } from "@/components/form-input-field";

const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  country: z.enum(COUNTRY_CODES, { error: "Please select a country" }),
  description: z.string().max(500).optional(),
});

export type ManufacturerFormValues = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: ManufacturerFormValues) => void;
  defaultValues?: Partial<ManufacturerFormValues>;
  mode?: "create" | "edit" | "view";
}

export const ManufacturerFormDialog = ({
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
      country: defaultValues?.country ?? undefined,
      description: defaultValues?.description ?? "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: defaultValues?.name ?? "",
        country: defaultValues?.country ?? undefined,
        description: defaultValues?.description ?? "",
      });
    }
  }, [open, form]);

  const handleSubmit = (values: ManufacturerFormValues) => {
    onSubmit?.(values);
    onOpenChange(false);
  };

  const countryOptions = useMemo(
    () =>
      getCountryOptions().map(({ code, name }) => ({
        value: code,
        label: name,
      })),
    [],
  );
  const isReadOnly = mode === "view";

  const title = {
    create: "New Manufacturer",
    edit: "Edit Manufacturer",
    view: "Manufacturer Details",
  }[mode];

  const description = {
    create: "Add a new manufacturer to your system.",
    edit: "Update the manufacturer details.",
    view: "Viewing manufacturer details.",
  }[mode];

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
              label="Name"
              placeholder="e.g. Siemens Healthineers"
              disabled={isReadOnly}
            />

            <FormSelectField
              control={form.control}
              name="country"
              label="Country"
              options={countryOptions}
              placeholder="Select a country"
              disabled={isReadOnly}
            />

            <FormTextareaField
              control={form.control}
              name="description"
              label="Description"
              placeholder="Brief description of the manufacturer..."
              disabled={isReadOnly}
            />
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
