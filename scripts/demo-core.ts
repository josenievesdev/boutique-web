import type { Clock } from "../src/core/ports/clock";
import type { IdGenerator } from "../src/core/ports/id-generator";
import { AddProductImage } from "../src/core/use-cases/add-product-image";
import { ArchiveProduct } from "../src/core/use-cases/archive-product";
import { CreateProduct } from "../src/core/use-cases/create-product";
import { HideProduct } from "../src/core/use-cases/hide-product";
import { ListPublishedProducts } from "../src/core/use-cases/list-published-products";
import { PublishProduct } from "../src/core/use-cases/publish-product";
import { InMemoryProductRepository } from "../src/infrastructure/repositories/in-memory-product-repository";

class DemoIdGenerator implements IdGenerator {
  generate(): string {
    return "product-demo-1";
  }
}

class DemoClock implements Clock {
  now(): Date {
    return new Date("2026-07-18T23:30:00.000Z");
  }
}

function printStep(
  title: string,
  data: Record<string, unknown>,
): void {
  console.log(`\n${title}`);
  console.table(data);
}

async function main(): Promise<void> {
  const repository = new InMemoryProductRepository();

  const createProduct = new CreateProduct(
    repository,
    new DemoIdGenerator(),
    new DemoClock(),
  );

  const addProductImage = new AddProductImage(repository);
  const publishProduct = new PublishProduct(repository);
  const listPublishedProducts =
    new ListPublishedProducts(repository);
  const hideProduct = new HideProduct(repository);
  const archiveProduct = new ArchiveProduct(repository);

  const product = await createProduct.execute({
    name: "Vestido Aurora",
    slug: "vestido-aurora",
    shortDescription: "Vestido elegante sobre pedido.",
    description:
      "Vestido disponible en diferentes tallas y colores.",
    priceInPesos: 180_000,
    categoryId: "category-dresses",
    customizable: true,
    madeToOrder: true,
    preparationDays: 8,
  });

  printStep("1. Producto creado", {
    id: product.id,
    nombre: product.name,
    estado: product.status,
    imagenes: product.imageCount,
  });

  try {
    await publishProduct.execute(product.id);
  } catch (error) {
    printStep("2. Publicación rechazada correctamente", {
      mensaje:
        error instanceof Error
          ? error.message
          : "Error desconocido",
    });
  }

  await addProductImage.execute(product.id, {
    id: "image-demo-1",
    path: "products/product-demo-1/cover.webp",
    altText: "Vestido Aurora visto de frente",
    position: 1,
    isCover: true,
  });

  printStep("3. Imagen agregada", {
    imagenes: product.imageCount,
    portada: product.images[0]?.path,
  });

  await publishProduct.execute(product.id);

  printStep("4. Producto publicado", {
    nombre: product.name,
    estado: product.status,
  });

  const publishedProducts =
    await listPublishedProducts.execute();

  console.log("\n5. Catálogo público");

  console.table(
    publishedProducts.map((publishedProduct) => ({
      id: publishedProduct.id,
      nombre: publishedProduct.name,
      precio: publishedProduct.priceInPesos,
      estado: publishedProduct.status,
    })),
  );

  await hideProduct.execute(product.id);

  printStep("6. Producto oculto", {
    nombre: product.name,
    estado: product.status,
  });

  const catalogAfterHiding =
    await listPublishedProducts.execute();

  printStep("7. Catálogo después de ocultar", {
    productosPublicados: catalogAfterHiding.length,
  });

  await archiveProduct.execute(product.id);

  printStep("8. Producto archivado", {
    nombre: product.name,
    estado: product.status,
  });
}

main().catch((error: unknown) => {
  console.error("\nLa demostración falló:", error);
});