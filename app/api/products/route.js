const newProduct = await prisma.products.create({
  data: {
    barcode,
    categoryId, // was: category
    description,
    farmerId,   // changed from userId
    productImages,
    imageUrl: productImages[0] || null,
    isActive,
    isWholesale,
    productCode,
    productPrice: parseFloat(productPrice),
    salePrice: parseFloat(salePrice),
    sku,
    slug,
    tags,
    title,
    unit,
    wholesalePrice: parseFloat(wholesalePrice),
    wholesaleQty: parseInt(wholesaleQty),
    productStock: parseInt(productStock),
    qty: parseInt(qty),
  },
});

