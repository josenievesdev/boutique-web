import { DomainError } from "../errors/domain-error";

export type ProductStatus =
  | "draft"
  | "published"
  | "hidden"
  | "out_of_stock"
  | "archived";

export interface ProductImage {
  id: string;
  path: string;
  altText: string;
  position: number;
  isCover: boolean;
}

export interface ProductProps {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  priceInPesos: number;
  previousPriceInPesos: number | null;
  categoryId: string | null;
  collectionId: string | null;
  status: ProductStatus;
  featured: boolean;
  customizable: boolean;
  madeToOrder: boolean;
  preparationDays: number | null;
  images: ProductImage[];
  createdAt: Date;
  updatedAt: Date;
}

export class Product {
  private readonly props: ProductProps;

  constructor(props: ProductProps) {
    this.validateInitialState(props);

    this.props = {
      ...props,
      images: props.images.map((image) => ({ ...image })),
    };
  }

  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get slug(): string {
    return this.props.slug;
  }

  get priceInPesos(): number {
    return this.props.priceInPesos;
  }

  get status(): ProductStatus {
    return this.props.status;
  }

  get categoryId(): string | null {
    return this.props.categoryId;
  }

  get images(): ReadonlyArray<ProductImage> {
    return this.props.images.map((image) => ({ ...image }));
  }

  get imageCount(): number {
    return this.props.images.length;
  }

addImage(image: ProductImage): void {
  const imageAlreadyExists = this.props.images.some(
    (currentImage) => currentImage.id === image.id,
  );

  if (imageAlreadyExists) {
    throw new DomainError(
      `Ya existe una imagen con el identificador "${image.id}".`,
    );
  }

  const positionIsUsed = this.props.images.some(
    (currentImage) =>
      currentImage.position === image.position,
  );

  if (positionIsUsed) {
    throw new DomainError(
      `Ya existe una imagen en la posición ${image.position}.`,
    );
  }

  if (image.isCover) {
    this.removeCurrentCover();
  }

  this.props.images.push({ ...image });

  this.props.images.sort(
    (firstImage, secondImage) =>
      firstImage.position - secondImage.position,
  );

  this.touch();
}

removeImage(imageId: string): ProductImage {
  if (
    this.props.status === "published" &&
    this.props.images.length === 1
  ) {
    throw new DomainError(
      "Un producto publicado debe conservar al menos una imagen.",
    );
  }

  const imageIndex = this.props.images.findIndex(
    (image) => image.id === imageId,
  );

  if (imageIndex === -1) {
    throw new DomainError(
      `No se encontró la imagen "${imageId}".`,
    );
  }

  const [removedImage] = this.props.images.splice(
    imageIndex,
    1,
  );

  if (!removedImage) {
    throw new DomainError(
      `No se encontró la imagen "${imageId}".`,
    );
  }

  if (
    removedImage.isCover &&
    this.props.images.length > 0
  ) {
    this.props.images.sort(
      (firstImage, secondImage) =>
        firstImage.position -
        secondImage.position,
    );

    const firstImage = this.props.images[0];

    if (firstImage) {
      firstImage.isCover = true;
    }
  }

  this.touch();

  return { ...removedImage };
}

setCoverImage(imageId: string): void {
  const image = this.props.images.find(
    (currentImage) =>
      currentImage.id === imageId,
  );

  if (!image) {
    throw new DomainError(
      `No se encontró la imagen "${imageId}".`,
    );
  }

  this.removeCurrentCover();
  image.isCover = true;
  this.touch();
}

  publish(): void {
    if (!this.props.categoryId) {
      throw new DomainError(
        "El producto necesita una categoría antes de publicarse.",
      );
    }

    if (this.props.images.length === 0) {
      throw new DomainError(
        "El producto necesita al menos una imagen antes de publicarse.",
      );
    }

    this.props.status = "published";
    this.touch();
  }

  hide(): void {
    if (this.props.status === "archived") {
      throw new DomainError(
        "Un producto archivado no se puede ocultar.",
      );
    }

    this.props.status = "hidden";
    this.touch();
  }

  markAsOutOfStock(): void {
    if (this.props.status === "archived") {
      throw new DomainError(
        "Un producto archivado no puede marcarse como agotado.",
      );
    }

    this.props.status = "out_of_stock";
    this.touch();
  }

  archive(): void {
    this.props.status = "archived";
    this.touch();
  }

  updatePrice(priceInPesos: number): void {
    this.validatePrice(priceInPesos);

    this.props.priceInPesos = priceInPesos;

    if (
      this.props.previousPriceInPesos !== null &&
      this.props.previousPriceInPesos <= priceInPesos
    ) {
      this.props.previousPriceInPesos = null;
    }

    this.touch();
  }

  toObject(): ProductProps {
    return {
      ...this.props,
      images: this.props.images.map((image) => ({ ...image })),
      createdAt: new Date(this.props.createdAt),
      updatedAt: new Date(this.props.updatedAt),
    };
  }

  private validateInitialState(props: ProductProps): void {
    if (!props.id.trim()) {
      throw new DomainError(
        "El identificador del producto es obligatorio.",
      );
    }

    if (!props.name.trim()) {
      throw new DomainError(
        "El nombre del producto es obligatorio.",
      );
    }

if (!props.slug.trim()) {
  throw new DomainError(
    "El slug del producto es obligatorio.",
  );
}

if (!props.shortDescription.trim()) {
  throw new DomainError(
    "La descripción corta del producto es obligatoria.",
  );
}

if (!props.description.trim()) {
  throw new DomainError(
    "La descripción completa del producto es obligatoria.",
  );
}

this.validatePrice(props.priceInPesos);

    if (
      props.previousPriceInPesos !== null &&
      props.previousPriceInPesos <= props.priceInPesos
    ) {
      throw new DomainError(
        "El precio anterior debe ser mayor que el precio actual.",
      );
    }

    if (
      props.preparationDays !== null &&
      (!Number.isInteger(props.preparationDays) ||
        props.preparationDays < 1)
    ) {
      throw new DomainError(
        "El tiempo de elaboración debe ser un número entero mayor que cero.",
      );
    }
  }

  private validatePrice(priceInPesos: number): void {
    if (!Number.isInteger(priceInPesos)) {
      throw new DomainError(
        "El precio debe expresarse en pesos enteros.",
      );
    }

    if (priceInPesos < 0) {
      throw new DomainError(
        "El precio no puede ser negativo.",
      );
    }
  }

  private removeCurrentCover(): void {
    for (const currentImage of this.props.images) {
      currentImage.isCover = false;
    }
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }
}