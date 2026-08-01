import { useEffect, useRef, type ReactNode } from "react";
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
  const siteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const site = siteRef.current;
    const header = site?.querySelector<HTMLElement>(".catalog-header");

    if (!site || !header || typeof ResizeObserver === "undefined") {
      return;
    }

    const publicSite = site;
    const publicHeader = header;

    function syncHeaderHeight(): void {
      publicSite.style.setProperty(
        "--catalog-header-height",
        `${publicHeader.getBoundingClientRect().height}px`,
      );
    }

    syncHeaderHeight();

    const observer = new ResizeObserver(syncHeaderHeight);
    observer.observe(publicHeader);

    return () => {
      observer.disconnect();
      publicSite.style.removeProperty("--catalog-header-height");
    };
  }, []);

  return (
    <div className="catalog-site" ref={siteRef}>
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
