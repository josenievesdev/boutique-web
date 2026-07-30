import type { ReactNode } from "react";

interface CatalogPublicStateProps {
  eyebrow: string;
  title?: string;
  children?: ReactNode;
  tone?: "neutral" | "mist" | "error";
  headingLevel?: "h1" | "h2";
  announce?: boolean;
}

export function CatalogPublicState({
  eyebrow,
  title,
  children,
  tone = "neutral",
  headingLevel = "h2",
  announce = false,
}: CatalogPublicStateProps) {
  const Heading = headingLevel;

  return (
    <section
      className={`catalog-state${
        tone === "neutral" ? "" : ` catalog-state--${tone}`
      }`}
      tabIndex={-1}
      role={announce ? "status" : undefined}
    >
      <span className="catalog-state__mark" aria-hidden="true" />
      <p className="catalog-eyebrow">{eyebrow}</p>
      {title ? <Heading>{title}</Heading> : null}
      {children}
    </section>
  );
}
