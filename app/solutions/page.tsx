'use client'
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';

export const dynamic = 'force-dynamic'; // Cache ප්‍රශ්නය විසඳන්න

export default function SolutionsPage() {
  const [products, setProducts] = useState<any[]>([]);

  // Cart එකට අදාළ State සහ Functions
  const addToCart = useCartStore((state) => state.addToCart);
  const cart = useCartStore((state) => state.cart);
  const toggleCart = useCartStore((state) => state.toggleCart);

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        // 👇 මෙතන 'SKF' වෙනුවට 'SKS' කියලා හැදුවා (SK Solution සඳහා)
        .eq('category', 'SKS') 
        .order('id', { ascending: false }); // අලුත්ම ඒවා උඩින් පේන්න
      
      if (error) {
        console.error("Supabase Error:", error);
      } else {
        setProducts(data || []);
      }
    }
    fetchProducts();
  }, []);

  const getImageUrl = (path: string) => {
    if (!path) return 'https://via.placeholder.com/300';
    const { data } = supabase.storage.from('product-images').getPublicUrl(path);
    return data.publicUrl;
  };

  return (
    <main className="min-h-screen bg-[#111113] text-white p-6 md:p-12 relative">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-black text-teal-500">SK SOLUTIONS STORE</h1>
        
        <div className="flex items-center gap-6">
          <Link href="/" className="text-gray-400 hover:text-white">Back to Home</Link>
          
          <div onClick={toggleCart} className="relative bg-gray-800 p-3 rounded-full cursor-pointer hover:bg-gray-700 transition">
            🛒
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-teal-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
                {cart.length}
              </span>
            )}
          </div>
        </div>
      </header>

      {products.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">මෙම කාණ්ඩයේ අයිතම තවම එකතු කර නොමැත.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {products.map((item) => (
            <div key={item.id} className="bg-[#1c1c1e] p-4 rounded-3xl border border-gray-800 hover:border-teal-500 transition">
              <img 
                src={getImageUrl(item.image_url)} 
                alt={item.name} 
                className="w-full h-60 object-cover rounded-2xl mb-4"
                onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/300'; }}
              />
              <div className="flex justify-between items-center mb-1">
                <p className="text-xs text-gray-500 font-mono">{item.item_code}</p>
                <span className="text-[10px] bg-gray-800 px-2 py-1 rounded text-gray-400">{item.category}</span>
              </div>
              <h3 className="text-lg font-bold">{item.name}</h3>
              <p className="text-teal-400 font-bold mb-4">{item.price}</p>
              
              <button 
                onClick={() => {
                  addToCart(item);
                  alert(`${item.name} Cart එකට එකතු කළා! 🛒`);
                }}
                className="w-full bg-teal-600 py-2 rounded-xl font-bold hover:bg-teal-700 transition"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}