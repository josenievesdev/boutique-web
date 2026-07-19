import {
  useEffect,
  useState,
} from "react";

interface CatalogProductImageProps {
  source: string | null;
  alt: string;
}

export function CatalogProductImage({
  source,
  alt,
}: CatalogProductImageProps) {
  const [hasFailed, setHasFailed] =
    useState(false);

  useEffect(() => {
    setHasFailed(false);
  }, [source]);

  if (!source || hasFailed) {
    return (
      <div className="catalog-product-image-fallback">
        <span>Imagen no disponible</span>
      </div>
    );
  }

  return (
    <img
      src={source}
      alt={alt}
      loading="lazy"
      onError={() => {
        setHasFailed(true);
      }}
    />
  );
}