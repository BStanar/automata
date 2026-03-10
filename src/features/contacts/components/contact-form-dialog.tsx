"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useEffect } from "react"
import { ContactOwnerType, ContactRole } from "@/generated/prisma/enums"


const formSchema = z.object({
    firstName: z.string().min(1, "Firstname is required").max(15),
    lastName: z.string().min(1, "Lastname is required").max(15),
    telephoneNumber: z.string().min(1).max(25),
    telephoneNumberSecondary: z.string().max(25).optional(),
    email: z.email("Invalid email address"),     role: z.enum(Object.values(ContactRole) as [ContactRole, ... ContactRole[]]),
    isActive: z.boolean(),
  
    ownerType: z.enum(Object.values(ContactOwnerType) as [ContactOwnerType, ... ContactOwnerType[]]),
    clientId: z.string().optional(),
    manufacturerId: z.string().optional(),
})

export type ContactFormValues = z.infer<typeof formSchema>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: ContactFormValues) => void
  defaultValues?: Partial<ContactFormValues>
  mode?: "create" | "edit"
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
  })

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
      })
    }
  }, [open, defaultValues, form])

  const handleSubmit = (values: ContactFormValues) => {
    onSubmit(values)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "New Contact" : "Edit Contact"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Add a new contact to your system."
              : "Update the contact details."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6 mt-4"
          >
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="First Name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Last Name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="email@example.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
                        <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="telephoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="+1 234 567 890" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="telephoneNumberSecondary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Secondary Phone{" "}
                      <span className="text-muted-foreground font-normal text-sm">
                        (optional)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="+1 234 567 890" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={ContactRole.TECHNICAL}>Technical</SelectItem>
                      <SelectItem value={ContactRole.SALES}>Sales</SelectItem>
                      <SelectItem value={ContactRole.ADMIN}>Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
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
  )
}