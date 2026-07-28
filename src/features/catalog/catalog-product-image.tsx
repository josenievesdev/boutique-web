import {
  useEffect,
  useState,
} from "react";

interface CatalogProductImageProps {
  source: string | null;
  alt: string;
  width?: number;
  height?: number;
}

export function CatalogProductImage({
  source,
  alt,
  width,
  height,
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
      width={width}
      height={height}
      loading="lazy"
      onError={() => {
        setHasFailed(true);
      }}
    />
  );
}
