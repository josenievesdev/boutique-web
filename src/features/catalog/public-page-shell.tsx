import type { ReactNode } from "react";
import { CatalogFooter, CatalogHeader } from "./catalog-header";

interface PublicPageShellProps {
  businessName?: string;
  children: ReactNode;
  skipTargetId?: string;
}

export function PublicPageShell({
  businessName,
  children,
  skipTargetId,
}: PublicPageShellProps) {
  return (
    <div className="catalog-site">
      {skipTargetId ? (
        <a className="catalog-skip-link" href={`#${skipTargetId}`}>
          Ir al contenido
        </a>
      ) : null}
      <CatalogHeader businessName={businessName} />
      {children}
      <CatalogFooter businessName={businessName} />
    </div>
  );
}
