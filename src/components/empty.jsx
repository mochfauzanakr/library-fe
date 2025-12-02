"use client";

import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";

export default function EmptyPage({
  icon,
  title = "Nothing here",
  description = "This section is currently empty.",
  children,
}) {
  return (
    <Empty>
      {icon && <div className="mb-4">{icon}</div>}

      <EmptyHeader>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>

      {children && <EmptyContent>{children}</EmptyContent>}
    </Empty>
  );
}
