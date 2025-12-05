const productRes = await getData(`products/product/${slug}`);
const product = productRes.success ? productRes.data : null;
if (!product) return <div className="p-4 text-red-600">Product not found</div>;

const categoryRes = await getData(`categories/${product.categoryId}`);
const category = categoryRes.success ? categoryRes.data : null;
const categoryProducts = category?.products || [];
const products = categoryProducts.filter((p) => p.id !== product.id);

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
const urlToShare = `${baseUrl}/products/${slug}`;
