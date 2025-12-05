export default async function ProductDetailPage({ params: { slug } }) {
  const productRes = await getData(`products/product/${slug}`);
  const product = productRes.success ? productRes.data : null;

  let category = null;
  if (product) {
    const categoryRes = await getData(`categories/${product.categoryId}`);
    category = categoryRes.success ? categoryRes.data : null;
  }

  return (
    <div>
      {!product ? (
        <div className="p-4 text-red-600">Product not found</div>
      ) : (
        <div>
          {/* your full product detail JSX here */}
        </div>
      )}
    </div>
  );
}
