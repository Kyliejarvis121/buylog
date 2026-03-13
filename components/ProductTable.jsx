"use client";
import React, { useEffect, useState } from "react";

export default function ProductsTable({ initialQuery = "" }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch(`/api/products?q=${encodeURIComponent(initialQuery)}&limit=50`);
    const json = await res.json();
    setProducts(json?.data || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function deleteProduct(id) {
    if (!confirm("Delete this product?")) return;
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    const j = await res.json();
    if (j.success) {
      alert("Deleted");
      load();
    } else {
      alert(j.message || "Delete failed");
    }
  }

  function openEdit(product) {
    // you can open a modal and pass product to an EditProductForm component
    // for simplicity we'll navigate to a product edit route if you have one:
    window.location.href = `/dashboard/products/update/${product.id}`;
  }

  return (
    <div>
      {loading ? <p>Loading products…</p> : (
        <table className="w-full">
          <thead>
            <tr><th>Title</th><th>Farmer</th><th>Price</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td>{p.title}</td>
                <td>{p.farmerId}</td>
                <td>{p.price}</td>
                <td>
                  <button onClick={() => openEdit(p)} className="me-2">Edit</button>
                  <button onClick={() => deleteProduct(p.id)} className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
