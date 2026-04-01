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
import { FormTextareaField } from "@/components/form-textarea-field";
import { FormSelectField } from "@/components/form-select-field";
import { FormInputField } from "@/components/form-input-field";
import { RegulatoryStatus } from "@/generated/prisma/enums";
import { FormDateField } from "@/components/form-date-field";

const formSchema = z.object({
    name: z.string().min(1, "Name is required").max(100),
    description: z.string().min(1, "Description is required").max(100),
    regulatoryStatus: z
      .enum(
        Object.values(RegulatoryStatus) as [
          RegulatoryStatus,
          ...RegulatoryStatus[],
        ],
      )
      .optional(),
    endOfSaleDate: z.date().optional(),
    endOfSupportDate: z.date().optional(),
  
    manufacturerId: z.string().optional(),
});

const REGULATORY_STATUS_OPTIONS = [
  { value: RegulatoryStatus.ACTIVE, label: "Active" },
  { value: RegulatoryStatus.END_OF_LIFE, label: "End of life support" },
  { value: RegulatoryStatus.OBSOLETE, label: "Obsolete" },
];

export type ModelFormValues = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: ModelFormValues) => void;
  defaultValues?: Partial<ModelFormValues>;
  mode?: "create" | "edit" | "view";
  manufacturerId?: string;
}

export const ModelFormDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  manufacturerId,
  mode = "create",
}: Props) => {
//check if there is a need for this 
const resolvedDefaults = useMemo(() => ({
  name: defaultValues?.name ?? "",
  description: defaultValues?.description ?? "",
  regulatoryStatus: defaultValues?.regulatoryStatus ?? RegulatoryStatus.ACTIVE,
  endOfSaleDate: defaultValues?.endOfSaleDate ?? undefined,
  endOfSupportDate: defaultValues?.endOfSupportDate ?? undefined,
  manufacturerId: defaultValues?.manufacturerId ?? manufacturerId ?? undefined,
}), [defaultValues, manufacturerId]);  

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: resolvedDefaults,
  });

  useEffect(() => {
    if (open) {
      form.reset( resolvedDefaults );
    }
  }, [open, form, resolvedDefaults]);

  const handleSubmit = (values: ModelFormValues) => {
    onSubmit?.(values);
    onOpenChange(false);
  };

  const isReadOnly = mode === "view";

  const title = {
    create: "New Model",
    edit: "Edit Model",
    view: "Model Details",
  }[mode];

  const description = {
    create: "Add a new model to your system.",
    edit: "Update the model details.",
    view: "Viewing model details.",
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
              placeholder="e.g. Model 033"
              readOnly={isReadOnly}
            />

            <FormSelectField
              control={form.control}
              name="regulatoryStatus"
              label="Model status"
              options={REGULATORY_STATUS_OPTIONS}
              placeholder="Select device status"
              readOnly={isReadOnly}
            />
            <FormDateField
              control={form.control}
              name="endOfSaleDate"
              label="End of sale date"
              placeholder="End of sale date"
              disabled={isReadOnly}
            />
            <FormDateField
              control={form.control}
              name="endOfSupportDate"
              label="End of support date"
              placeholder="End of support date"
              disabled={isReadOnly}
            />

            <FormTextareaField
              control={form.control}
              name="description"
              label="Description"
              placeholder="Brief description of the model..."
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
