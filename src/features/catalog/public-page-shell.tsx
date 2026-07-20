import type { ReactNode } from "react";
import { CatalogFooter, CatalogHeader } from "./catalog-header";

interface PublicPageShellProps {
  businessName?: string;
  children: ReactNode;
}

export function PublicPageShell({
  businessName,
  children,
}: PublicPageShellProps) {
  return (
    <div className="catalog-site">
      <CatalogHeader businessName={businessName} />
      {children}
      <CatalogFooter businessName={businessName} />
    </div>
  );
}
