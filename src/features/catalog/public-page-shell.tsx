import type { ReactNode } from "react";
import { CatalogFooter } from "./catalog-footer";
import {
  CatalogHeader,
  type CatalogHeaderSearchControls,
} from "./catalog-header";

interface PublicPageShellProps {
  businessName?: string;
  children: ReactNode;
  headerSearchControls?: CatalogHeaderSearchControls;
  skipTargetId?: string;
}

export function PublicPageShell({
  businessName,
  children,
  headerSearchControls,
  skipTargetId = "contenido-principal",
}: PublicPageShellProps) {
  return (
    <div className="catalog-site">
      <a className="catalog-skip-link" href={`#${skipTargetId}`}>
        Ir al contenido
      </a>
      <CatalogHeader
        businessName={businessName}
        searchControls={headerSearchControls}
      />
      {children}
      <CatalogFooter businessName={businessName} />
    </div>
  );
}
