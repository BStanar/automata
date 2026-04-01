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
import React from "react";

interface BreadcrumbSegment {
  label: string;
  href?: string;
}

interface EditorProps {
  segments: BreadcrumbSegment[];
  actions?: React.ReactNode;
}
export const EditorBreadcrumbs = ({
  segments,
}: {
  segments: BreadcrumbSegment[];
}) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((segment, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              {segment.href ? (
                <BreadcrumbLink asChild>
                  <Link prefetch href={segment.href}>
                    {segment.label}
                  </Link>
                </BreadcrumbLink>
              ) : (
                <span className="transition-colors">
                  {segment.label}
                </span>
              )}
            </BreadcrumbItem>
            {index < segments.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export const EditorHeader = ({
  actions,
  segments,
}: EditorProps) => {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 bg-background">
      <SidebarTrigger />
      <div className="flex flex-row items-center justify-between gap-x-4 w-full">
        <EditorBreadcrumbs
          segments={segments}
        />
        {actions}
      </div>
    </header>
  );
};
