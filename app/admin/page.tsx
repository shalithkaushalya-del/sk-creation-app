"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function AdminPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('SKC');
  const [itemCode, setItemCode] = useState('Loading...');
  const [image, setImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchProducts();
    generateNextCode('SKC'); 
  }, []);

  async function generateNextCode(cat: string) {
    if (editingId) return;
    setItemCode('Loading...');
    // Dropdown එකේ 'solution' කියලා තිබ්බට අපි data එකට යවන්නේ 'SKS'
    const codePrefix = cat === 'solution' ? 'SKS' : cat;

    const { data } = await supabase
      .from('products')
      .select('item_code')
      .ilike('item_code', `${codePrefix}-%`)
      .order('id', { ascending: false })
      .limit(1);

    if (data && data.length > 0 && data[0].item_code) {
      const parts = data[0].item_code.split('-');
      const nextNumber = parseInt(parts[1], 10) + 1;
      setItemCode(`${codePrefix}-${nextNumber.toString().padStart(3, '0')}`);
    } else {
      setItemCode(`${codePrefix}-001`);
    }
  }

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCat = e.target.value;
    setCategory(newCat);
    if (!editingId) generateNextCode(newCat); 
  };

  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*').order('id', { ascending: false });
    if (data) setProducts(data);
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this?")) return;
    await supabase.from('products').delete().eq('id', id);
    fetchProducts();
  }

  function handleEdit(item: any) {
    setEditingId(item.id);
    setName(item.name);
    setPrice(item.price);
    setCategory(item.category);
    setItemCode(item.item_code);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function resetForm() {
    setEditingId(null);
    setName(''); setPrice(''); setImage(null);
    fetchProducts();
    generateNextCode(category);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setUploading(true);
    let image_url = '';
    
    if (image) {
      const fileName = `${Date.now()}_${Math.random()}.png`;
      await supabase.storage.from('product-images').upload(fileName, image);
      image_url = fileName;
    }

    const finalCategory = category === 'solution' ? 'SKS' : category;

    if (editingId) {
      const updateData: any = { name, price, item_code: itemCode, category: finalCategory };
      if (image_url) updateData.image_url = image_url;
      await supabase.from('products').update(updateData).eq('id', editingId);
    } else {
      await supabase.from('products').insert([{ name, price, item_code: itemCode, category: finalCategory, image_url }]);
    }
    resetForm();
    setUploading(false);
  }

  return (
    <div className="min-h-screen bg-[#111113] text-white p-6">
      <header className="flex justify-between items-center mb-10 border-b border-gray-800 pb-5">
        <h1 className="text-2xl font-bold text-blue-500">ADMIN PANEL</h1>
        <Link href="/" className="bg-blue-600 px-4 py-2 rounded-full text-xs font-bold">Home</Link>
      </header>

      <form onSubmit={handleSubmit} className="bg-[#1c1c1e] p-6 rounded-2xl flex flex-col gap-4 mb-10 border border-gray-800">
        <h2 className="text-xl font-bold">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required className="bg-black p-3 rounded-lg outline-none" />
        <select value={category} onChange={handleCategoryChange} className="bg-black p-3 rounded-lg outline-none">
          <option value="SKC">SKC (Craft)</option>
          <option value="SKF">SKF (Fashion)</option>
          <option value="SKD">SKD (Digital)</option>
          <option value="solution">SKS (Solution)</option>
        </select>
        <input type="text" value={itemCode} readOnly className="bg-gray-900 p-3 rounded-lg cursor-not-allowed" />
        <input type="text" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required className="bg-black p-3 rounded-lg" />
        <input type="file" onChange={(e) => setImage(e.target.files?.[0] || null)} className="bg-black p-3 rounded-lg" />
        <button type="submit" disabled={uploading} className="bg-blue-600 p-3 rounded-lg font-bold">{uploading ? 'Processing...' : 'Save'}</button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((item) => (
          <div key={item.id} className="bg-[#1c1c1e] p-4 rounded-xl border border-gray-800">
            <h3 className="font-bold">{item.name}</h3>
            <p className="text-xs text-green-400 font-mono">Code: {item.item_code}</p>
            <p className="text-xs text-blue-400">Category: {item.category}</p>
            {item.image_url && <p className="text-xs text-gray-500">Has Image</p>}
            <div className="flex gap-2 mt-4">
              <button onClick={() => handleEdit(item)} className="flex-1 bg-gray-700 py-2 rounded-lg text-sm">Edit</button>
              <button onClick={() => handleDelete(item.id)} className="flex-1 bg-red-900 py-2 rounded-lg text-sm">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
