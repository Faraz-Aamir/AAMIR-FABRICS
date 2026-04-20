"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import AdminHeader from "@/components/AdminHeader";

export default function AdminProductsPage() {
  const { data: session, status } = useSession();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  // Form state
  const emptyForm = {
    name: "", brand: "", category: "WOMEN", fabricType: "Lawn", price: 0,
    originalPrice: 0, discountPrice: 0, discountPercent: 0, discountExpiry: "",
    description: "", images: "", sizes: "S,M,L,XL", colors: "",
    stockQuantity: 10, isFeatured: false, isNewArrival: false, isBestSeller: false, tags: "",
  };
  const [form, setForm] = useState(emptyForm);
  const [customBrand, setCustomBrand] = useState("");
  const [customFabric, setCustomFabric] = useState("");
  const [showCustomBrand, setShowCustomBrand] = useState(false);
  const [showCustomFabric, setShowCustomFabric] = useState(false);

  const brands = ["Sapphire", "Khaadi", "Gul Ahmed", "Maria B", "Alkaram", "Sana Safinaz", "Nishat Linen", "Junaid Jamshed"];
  const fabrics = ["Lawn", "Cotton", "Chiffon", "Velvet", "Silk", "Organza", "Khaddar", "Wash & Wear", "Jacquard", "Embroidered"];
  const categories = ["MEN", "WOMEN", "KIDS"];

  const fetchProducts = () => {
    fetch("/api/products?limit=100").then(r => r.json()).then(data => {
      setProducts(data.products || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { if (session) fetchProducts(); }, [session]);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleDiscountPrice = (val: number) => {
    setForm(prev => {
      const percent = prev.originalPrice > 0 ? Math.round(((prev.originalPrice - val) / prev.originalPrice) * 100) : 0;
      return { ...prev, discountPrice: val, discountPercent: percent > 0 ? percent : 0 };
    });
  };

  const handleDiscountPercent = (val: number) => {
    setForm(prev => {
      const dp = prev.originalPrice > 0 ? Math.round(prev.originalPrice * (1 - val / 100)) : 0;
      return { ...prev, discountPercent: val, discountPrice: dp > 0 ? dp : 0 };
    });
  };

  const openAdd = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setShowCustomBrand(false);
    setShowCustomFabric(false);
    setShowForm(true);
  };

  const openEdit = (p: any) => {
    setEditingProduct(p);
    const isCustomBrand = !brands.includes(p.brand);
    const isCustomFabric = !fabrics.includes(p.fabricType);
    setShowCustomBrand(isCustomBrand);
    setShowCustomFabric(isCustomFabric);
    if (isCustomBrand) setCustomBrand(p.brand);
    if (isCustomFabric) setCustomFabric(p.fabricType);
    setForm({
      name: p.name, brand: isCustomBrand ? "Other" : p.brand, category: p.category,
      fabricType: isCustomFabric ? "Other" : p.fabricType,
      price: p.price, originalPrice: p.originalPrice || 0,
      discountPrice: p.discountPrice || 0, discountPercent: p.discountPercent || 0,
      discountExpiry: p.discountExpiry ? new Date(p.discountExpiry).toISOString().split("T")[0] : "",
      description: p.description,
      images: (() => { try { return JSON.parse(p.images).join(","); } catch { return ""; } })(),
      sizes: (() => { try { return JSON.parse(p.sizes).join(","); } catch { return ""; } })(),
      colors: (() => { try { return JSON.parse(p.colors).join(","); } catch { return ""; } })(),
      stockQuantity: p.stockQuantity, isFeatured: p.isFeatured, isNewArrival: p.isNewArrival,
      isBestSeller: p.isBestSeller,
      tags: (() => { try { return p.tags ? JSON.parse(p.tags).join(",") : ""; } catch { return ""; } })(),
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalBrand = form.brand === "Other" ? customBrand : form.brand;
    const finalFabric = form.fabricType === "Other" ? customFabric : form.fabricType;

    const body: any = {
      name: form.name, brand: finalBrand, category: form.category, fabricType: finalFabric,
      price: form.discountPrice > 0 ? form.discountPrice : (form.originalPrice > 0 ? form.originalPrice : form.price),
      originalPrice: form.originalPrice > 0 ? form.originalPrice : null,
      discountPrice: form.discountPrice > 0 ? form.discountPrice : null,
      discountPercent: form.discountPercent > 0 ? form.discountPercent : null,
      discountExpiry: form.discountExpiry || null,
      description: form.description,
      images: JSON.stringify(form.images.split(",").map(s => s.trim()).filter(Boolean)),
      sizes: JSON.stringify(form.sizes.split(",").map(s => s.trim()).filter(Boolean)),
      colors: JSON.stringify(form.colors.split(",").map(s => s.trim()).filter(Boolean)),
      stockQuantity: form.stockQuantity,
      isOutOfStock: form.stockQuantity <= 0,
      isFeatured: form.isFeatured, isNewArrival: form.isNewArrival, isBestSeller: form.isBestSeller,
      tags: form.tags ? JSON.stringify(form.tags.split(",").map(s => s.trim()).filter(Boolean)) : null,
    };

    if (editingProduct) {
      await fetch(`/api/products/${editingProduct.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    } else {
      body.slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");
      await fetch("/api/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    }
    setShowForm(false);
    fetchProducts();
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Delete this product permanently?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    fetchProducts();
  };

  const toggleFlag = async (id: string, field: string, current: boolean) => {
    await fetch(`/api/products/${id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: !current }),
    });
    fetchProducts();
  };

  if (status === "loading" || loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" /></div>;
  if (!session) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />

      <div className="p-6 max-w-7xl mx-auto">
        {/* Top Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <h2 className="font-heading text-2xl">Products ({filtered.length})</h2>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)}
              className="flex-1 md:w-64 border border-gray-200 px-4 py-2 text-sm font-body focus:border-accent focus:outline-none" />
            <button onClick={openAdd} className="bg-accent text-white px-5 py-2 text-sm font-body tracking-wider uppercase hover:bg-accent/90 transition-colors whitespace-nowrap">
              + Add Product
            </button>
          </div>
        </div>

        {/* Product Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-10 overflow-y-auto">
            <div className="bg-white w-full max-w-2xl p-6 m-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-heading text-xl">{editingProduct ? "Edit Product" : "Add New Product"}</h3>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-primary text-2xl">&times;</button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-xs font-body text-gray-500 tracking-wider uppercase mb-1">Product Name *</label>
                  <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-gray-200 px-3 py-2 text-sm font-body focus:border-accent focus:outline-none" />
                </div>

                {/* Brand + Category */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-body text-gray-500 tracking-wider uppercase mb-1">Brand *</label>
                    <select value={form.brand} onChange={e => { setForm({ ...form, brand: e.target.value }); setShowCustomBrand(e.target.value === "Other"); }}
                      className="w-full border border-gray-200 px-3 py-2 text-sm font-body focus:border-accent focus:outline-none">
                      {brands.map(b => <option key={b} value={b}>{b}</option>)}
                      <option value="Other">Other (Custom)</option>
                    </select>
                    {showCustomBrand && (
                      <input type="text" placeholder="Enter brand name" value={customBrand} onChange={e => setCustomBrand(e.target.value)}
                        className="w-full border border-gray-200 px-3 py-2 text-sm font-body mt-2 focus:border-accent focus:outline-none" required />
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-body text-gray-500 tracking-wider uppercase mb-1">Category *</label>
                    <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                      className="w-full border border-gray-200 px-3 py-2 text-sm font-body focus:border-accent focus:outline-none">
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                {/* Fabric Type */}
                <div>
                  <label className="block text-xs font-body text-gray-500 tracking-wider uppercase mb-1">Fabric Type *</label>
                  <select value={form.fabricType} onChange={e => { setForm({ ...form, fabricType: e.target.value }); setShowCustomFabric(e.target.value === "Other"); }}
                    className="w-full border border-gray-200 px-3 py-2 text-sm font-body focus:border-accent focus:outline-none">
                    {fabrics.map(f => <option key={f} value={f}>{f}</option>)}
                    <option value="Other">Other (Custom)</option>
                  </select>
                  {showCustomFabric && (
                    <input type="text" placeholder="Enter fabric type" value={customFabric} onChange={e => setCustomFabric(e.target.value)}
                      className="w-full border border-gray-200 px-3 py-2 text-sm font-body mt-2 focus:border-accent focus:outline-none" required />
                  )}
                </div>

                {/* Pricing */}
                <div className="bg-gray-50 p-4 space-y-3">
                  <p className="text-xs font-body text-gray-500 tracking-wider uppercase font-medium">Pricing & Discount</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-body text-gray-400 mb-1">Original Price (MRP) *</label>
                      <input type="number" required min={0} value={form.originalPrice || ""} onChange={e => setForm({ ...form, originalPrice: Number(e.target.value), price: Number(e.target.value) })}
                        className="w-full border border-gray-200 px-3 py-2 text-sm font-body focus:border-accent focus:outline-none" placeholder="e.g. 5200" />
                    </div>
                    <div>
                      <label className="block text-xs font-body text-gray-400 mb-1">Stock Quantity</label>
                      <input type="number" min={0} value={form.stockQuantity} onChange={e => setForm({ ...form, stockQuantity: Number(e.target.value) })}
                        className="w-full border border-gray-200 px-3 py-2 text-sm font-body focus:border-accent focus:outline-none" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-body text-gray-400 mb-1">Discount % <span className="text-gray-300">(optional)</span></label>
                      <input type="number" min={0} max={99} value={form.discountPercent || ""} onChange={e => handleDiscountPercent(Number(e.target.value))}
                        className="w-full border border-gray-200 px-3 py-2 text-sm font-body focus:border-accent focus:outline-none" placeholder="e.g. 15" />
                    </div>
                    <div>
                      <label className="block text-xs font-body text-gray-400 mb-1">Discounted Price <span className="text-gray-300">(auto)</span></label>
                      <input type="number" min={0} value={form.discountPrice || ""} onChange={e => handleDiscountPrice(Number(e.target.value))}
                        className="w-full border border-gray-200 px-3 py-2 text-sm font-body focus:border-accent focus:outline-none" placeholder="Auto-calculated" />
                    </div>
                    <div>
                      <label className="block text-xs font-body text-gray-400 mb-1">Expiry Date <span className="text-gray-300">(optional)</span></label>
                      <input type="date" value={form.discountExpiry} onChange={e => setForm({ ...form, discountExpiry: e.target.value })}
                        className="w-full border border-gray-200 px-3 py-2 text-sm font-body focus:border-accent focus:outline-none" />
                    </div>
                  </div>
                  {form.discountPercent > 0 && form.originalPrice > 0 && (
                    <p className="text-xs text-green-600 font-body">✓ Customer pays PKR {form.discountPrice.toLocaleString()} (save {form.discountPercent}%)</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-body text-gray-500 tracking-wider uppercase mb-1">Description *</label>
                  <textarea required rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                    className="w-full border border-gray-200 px-3 py-2 text-sm font-body focus:border-accent focus:outline-none resize-none" />
                </div>

                {/* Images, Sizes, Colors */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-body text-gray-500 tracking-wider uppercase mb-1">Image URLs <span className="text-gray-300">(comma sep)</span></label>
                    <input type="text" value={form.images} onChange={e => setForm({ ...form, images: e.target.value })}
                      className="w-full border border-gray-200 px-3 py-2 text-sm font-body focus:border-accent focus:outline-none" placeholder="/images/img.png" />
                  </div>
                  <div>
                    <label className="block text-xs font-body text-gray-500 tracking-wider uppercase mb-1">Sizes <span className="text-gray-300">(comma sep)</span></label>
                    <input type="text" value={form.sizes} onChange={e => setForm({ ...form, sizes: e.target.value })}
                      className="w-full border border-gray-200 px-3 py-2 text-sm font-body focus:border-accent focus:outline-none" placeholder="S,M,L,XL" />
                  </div>
                  <div>
                    <label className="block text-xs font-body text-gray-500 tracking-wider uppercase mb-1">Colors <span className="text-gray-300">(comma sep)</span></label>
                    <input type="text" value={form.colors} onChange={e => setForm({ ...form, colors: e.target.value })}
                      className="w-full border border-gray-200 px-3 py-2 text-sm font-body focus:border-accent focus:outline-none" placeholder="Red,Blue" />
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-xs font-body text-gray-500 tracking-wider uppercase mb-1">Tags <span className="text-gray-300">(comma sep, optional)</span></label>
                  <input type="text" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })}
                    className="w-full border border-gray-200 px-3 py-2 text-sm font-body focus:border-accent focus:outline-none" placeholder="trending,limited,sale" />
                </div>

                {/* Flags */}
                <div className="flex flex-wrap gap-6">
                  {[["isFeatured", "Featured"], ["isNewArrival", "New Arrival"], ["isBestSeller", "Best Seller"]].map(([key, label]) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={(form as any)[key]} onChange={e => setForm({ ...form, [key]: e.target.checked })}
                        className="w-4 h-4 accent-accent" />
                      <span className="text-sm font-body">{label}</span>
                    </label>
                  ))}
                </div>

                {/* Submit */}
                <div className="flex gap-3 pt-2">
                  <button type="submit" className="flex-1 py-3 bg-accent text-white font-body text-sm tracking-[0.15em] uppercase hover:bg-accent/90 transition-colors">
                    {editingProduct ? "Update Product" : "Add Product"}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 border border-gray-200 text-sm font-body hover:bg-gray-50 transition-colors">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Products Table */}
        <div className="bg-white border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left p-3 font-body text-xs text-gray-400 tracking-wider uppercase">Product</th>
                <th className="text-left p-3 font-body text-xs text-gray-400 tracking-wider uppercase">Price</th>
                <th className="text-left p-3 font-body text-xs text-gray-400 tracking-wider uppercase">Stock</th>
                <th className="text-left p-3 font-body text-xs text-gray-400 tracking-wider uppercase">Flags</th>
                <th className="text-left p-3 font-body text-xs text-gray-400 tracking-wider uppercase">Status</th>
                <th className="text-left p-3 font-body text-xs text-gray-400 tracking-wider uppercase">Actions</th>
              </tr></thead>
              <tbody>
                {filtered.map((p: any) => (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="p-3">
                      <p className="font-body text-sm font-medium text-primary truncate max-w-[200px]">{p.name}</p>
                      <p className="font-body text-xs text-gray-400">{p.brand} · {p.category} · {p.fabricType}</p>
                    </td>
                    <td className="p-3">
                      {p.discountPrice ? (
                        <div>
                          <span className="font-body text-sm font-medium text-green-600">PKR {p.discountPrice.toLocaleString()}</span>
                          <span className="font-body text-xs text-gray-400 line-through ml-1">PKR {p.originalPrice?.toLocaleString()}</span>
                          {p.discountPercent > 0 && <span className="ml-1 text-xs text-red-500">-{p.discountPercent}%</span>}
                        </div>
                      ) : (
                        <span className="font-body text-sm font-medium">PKR {p.price.toLocaleString()}</span>
                      )}
                    </td>
                    <td className="p-3">
                      <span className={`font-body text-sm ${p.stockQuantity <= 5 ? "text-red-600 font-medium" : ""}`}>{p.stockQuantity}</span>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {["isFeatured", "isNewArrival", "isBestSeller"].map(flag => (
                          <button key={flag} onClick={() => toggleFlag(p.id, flag, p[flag])}
                            className={`px-2 py-0.5 text-[10px] font-body rounded-full transition-colors ${p[flag] ? "bg-accent/20 text-accent" : "bg-gray-100 text-gray-400 hover:bg-gray-200"}`}>
                            {flag === "isFeatured" ? "★" : flag === "isNewArrival" ? "New" : "Best"}
                          </button>
                        ))}
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 text-xs font-body rounded-full ${p.isOutOfStock ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                        {p.isOutOfStock ? "Out" : "In Stock"}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <button onClick={() => openEdit(p)} className="text-xs text-accent hover:underline">Edit</button>
                        <Link href={`/product/${p.slug}`} className="text-xs text-gray-400 hover:underline">View</Link>
                        {session?.user?.role === "ADMIN" && (
                          <button onClick={() => deleteProduct(p.id)} className="text-xs text-red-500 hover:underline">Delete</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && <div className="p-8 text-center font-body text-gray-400">No products found</div>}
        </div>
      </div>
    </div>
  );
}
