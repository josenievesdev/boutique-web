import type { ReactNode } from "react";
import {
  CatalogFooter,
  CatalogHeader,
  type CatalogHeaderControls,
} from "./catalog-header";

interface PublicPageShellProps {
  businessName?: string;
  children: ReactNode;
  headerControls?: CatalogHeaderControls;
  skipTargetId?: string;
}

export function PublicPageShell({
  businessName,
  children,
  headerControls,
  skipTargetId,
}: PublicPageShellProps) {
  return (
    <div className="catalog-site">
      {skipTargetId ? (
        <a className="catalog-skip-link" href={`#${skipTargetId}`}>
          Ir al contenido
        </a>
      ) : null}
      <CatalogHeader
        businessName={businessName}
        controls={headerControls}
      />
      {children}
      <CatalogFooter businessName={businessName} />
    </div>
  );
}
