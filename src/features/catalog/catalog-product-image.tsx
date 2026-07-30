import {
  useEffect,
  useState,
} from "react";

interface CatalogProductImageProps {
  source: string | null;
  alt: string;
  width?: number;
  height?: number;
  loading?: "eager" | "lazy";
  fetchPriority?: "high" | "low" | "auto";
}

export function CatalogProductImage({
  source,
  alt,
  width,
  height,
  loading = "lazy",
  fetchPriority = "auto",
}: CatalogProductImageProps) {
  const [hasFailed, setHasFailed] =
    useState(false);

  useEffect(() => {
    setHasFailed(false);
  }, [source]);

  if (!source || hasFailed) {
    return (
      <div
        className="catalog-product-image-fallback"
        role={alt ? "img" : undefined}
        aria-label={alt || undefined}
        aria-hidden={alt ? undefined : true}
      >
        <span>Imagen no disponible</span>
      </div>
    );
  }

  return (
    <img
      src={source}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      fetchPriority={fetchPriority}
      decoding="async"
      onError={() => {
        setHasFailed(true);
      }}
    />
  );
}
