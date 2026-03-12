"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";

interface EditorProps {
  model: string;
  name: string;
  backHref: string;
  actions?: React.ReactNode;
  section?: string;
}
export const EditorBreadcrumbs = ({
  model,
  name,
  backHref,
  section,
}: {
  model: string;
  name: string;
  backHref: string;
  section?: string;
}) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link prefetch href={backHref}>
              {model}
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem className="cursor-pointer transition-colors">
          {name}
        </BreadcrumbItem>
        {section && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>{section}</BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export const EditorHeader = ({
  model,
  name,
  backHref,
  section,
  actions,
}: EditorProps) => {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 bg-background">
      <SidebarTrigger />
      <div className="flex flex-row items-center justify-between gap-x-4 w-full">
        <EditorBreadcrumbs model={model} name={name} backHref={backHref} section={section}/>
        {actions}
      </div>
    </header>
  );
};
