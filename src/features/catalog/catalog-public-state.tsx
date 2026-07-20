import type { ReactNode } from "react";

interface CatalogPublicStateProps {
  eyebrow: string;
  title?: string;
  children?: ReactNode;
  tone?: "neutral" | "mist" | "error";
}

export function CatalogPublicState({
  eyebrow,
  title,
  children,
  tone = "neutral",
}: CatalogPublicStateProps) {
  return (
    <section className={`catalog-state catalog-state--${tone}`}>
      <span className="catalog-state__mark" aria-hidden="true" />
      <p className="catalog-eyebrow">{eyebrow}</p>
      {title ? <h2>{title}</h2> : null}
      {children}
    </section>
  );
}
