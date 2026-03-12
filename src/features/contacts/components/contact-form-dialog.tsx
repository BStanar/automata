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
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useMemo } from "react";
import { ContactOwnerType, ContactRole } from "@/generated/prisma/enums";
import { FormInputField } from "@/components/form-input-field";
import { FormSelectField } from "@/components/form-select-field";

const formSchema = z.object({
  firstName: z.string().min(1, "Firstname is required").max(15),
  lastName: z.string().min(1, "Lastname is required").max(15),
  telephoneNumber: z.string().min(1).max(25),
  telephoneNumberSecondary: z.string().max(25).optional(),
  email: z.email("Invalid email address"),
  role: z.enum(Object.values(ContactRole) as [ContactRole, ...ContactRole[]]),
  isActive: z.boolean(),
  ownerType: z.enum(
    Object.values(ContactOwnerType) as [
      ContactOwnerType,
      ...ContactOwnerType[],
    ],
  ),
  clientId: z.string().optional(),
  manufacturerId: z.string().optional(),
});

  const CONTACT_ROLE_OPTIONS = [
    { value: ContactRole.TECHNICAL, label: "Technical" },
    { value: ContactRole.SALES, label: "Sales" },
    { value: ContactRole.ADMIN, label: "Admin" },
  ];

export type ContactFormValues = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: ContactFormValues) => void;
  defaultValues?: Partial<ContactFormValues>;
  mode?: "create" | "edit" | "view";
}

export const ContactFormDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  mode = "create",
}: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: defaultValues?.firstName ?? "",
      lastName: defaultValues?.lastName ?? "",
      telephoneNumber: defaultValues?.telephoneNumber ?? "",
      telephoneNumberSecondary: defaultValues?.telephoneNumberSecondary ?? "",
      email: defaultValues?.email ?? "",
      role: defaultValues?.role ?? undefined,
      isActive: defaultValues?.isActive ?? true,
      ownerType: defaultValues?.ownerType ?? undefined,
      clientId: defaultValues?.clientId ?? "",
      manufacturerId: defaultValues?.manufacturerId ?? "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        firstName: defaultValues?.firstName ?? "",
        lastName: defaultValues?.lastName ?? "",
        telephoneNumber: defaultValues?.telephoneNumber ?? "",
        telephoneNumberSecondary: defaultValues?.telephoneNumberSecondary ?? "",
        email: defaultValues?.email ?? "",
        role: defaultValues?.role ?? undefined,
        isActive: defaultValues?.isActive ?? true,
        ownerType: defaultValues?.ownerType ?? undefined,
        clientId: defaultValues?.clientId ?? "",
        manufacturerId: defaultValues?.manufacturerId ?? "",
      });
    }
  }, [open, form]);

  const handleSubmit = (values: ContactFormValues) => {
    onSubmit?.(values);
    onOpenChange(false);
  };

  const title = {
    create: "New Contact",
    edit: "Edit Contact",
    view: "Contact Details",
  }[mode];

  const description = {
    create: "Add a new contact to your system.",
    edit: "Update the contact details.",
    view: "Viewing contact details.",
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
              name="firstName"
              label="First Name"
              placeholder="e.g. Davor"
              disabled={isReadOnly}
            />

            <FormInputField
              control={form.control}
              name="lastName"
              label="Last Name"
              placeholder="e.g. Stanar"
              disabled={isReadOnly}
            />
            <FormInputField
              control={form.control}
              name="email"
              label="Email"
              placeholder="e.g. address@mail.com"
              disabled={isReadOnly}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormInputField
                control={form.control}
                name="telephoneNumber"
                label="Phone number"
                placeholder="e.g. =38733123123"
                disabled={isReadOnly}
              />
              <FormInputField
                control={form.control}
                name="telephoneNumberSecondary"
                label="Secondary Phone Number"
                placeholder="e.g. =38733123123"
                disabled={isReadOnly}
              />
            </div>
            <FormSelectField
              control={form.control}
              name="role"
              label="Role"
              options={CONTACT_ROLE_OPTIONS}
              placeholder="Select a role"
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
