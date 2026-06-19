'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function ManageDashboardImages() {
  const [loading, setLoading] = useState(false);
  const [processingKey, setProcessingKey] = useState<string | null>(null);
  
  // 👇 මෙතනට solution_card_img එකත් අලුතින් එකතු කළා
  const [images, setImages] = useState({
    fashion_card_img: '',
    crafts_card_img: '',
    digital_card_img: '',
    solution_card_img: '' 
  });

  useEffect(() => {
    fetchCurrentImages();
  }, []);

  // 1. දැනට ඩේටාබේස් එකේ තියෙන පින්තූර URL ටික අරගන්නවා
  async function fetchCurrentImages() {
    const { data, error } = await supabase.from('site_settings').select('*');
    if (error) {
      console.error("Error fetching images:", error);
    } else if (data) {
      // Array එකක් විදියට එන ඩේටා ටික Key-Value object එකකට හරවාගන්නවා UI එකේ පෙන්වන්න ලේසි වෙන්න
      const imgMap = data.reduce((acc, item) => {
        acc[item.asset_key] = item.image_url;
        return acc;
      }, {} as any);
      setImages(imgMap);
    }
  }

  // 2. පින්තූරයක් Upload කරලා Storage දාලා Database එක අප්ඩේට් කරන ප්‍රධාන ෆන්ක්ෂන් එක
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>, assetKey: string) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Loading status එක අදාළ කාඩ් එකට විතරක් පෙන්වන්න Key එක සෙට් කරනවා
    setProcessingKey(assetKey);
    setLoading(true);

    const fileExt = file.name.split('.').pop();
    // Unique ෆයිල් නමක් හදාගන්නවා (එතකොට කලින් එක Replace වෙන්නේ නෑ Cache ප්‍රශ්න එන්නේ නෑ)
    const fileName = `${assetKey}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    try {
      // A. Supabase Storage එකට (site-assets bucket එකට) Upload කිරීම
      const { error: uploadError } = await supabase.storage
        .from('site-assets') 
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // B. Upload වුණ පින්තූරේ Public URL එක ගැනීම
      const { data: urlData } = supabase.storage
        .from('site-assets')
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;

      // C. Database Table එක Update කිරීම (Upsert - තිබ්බොත් update කරයි, නැත්නම් insert කරයි)
      const { error: dbError } = await supabase
        .from('site_settings')
        .upsert({ asset_key: assetKey, image_url: publicUrl })
        .eq('asset_key', assetKey);

      if (dbError) throw dbError;

      alert(`Success! Homepage ${assetKey.split('_')[0]} image updated.`);
      
      // UI එකේ පේන පින්තූරේ වහාම අප්ඩේට් කරනවා
      setImages(prev => ({ ...prev, [assetKey]: publicUrl }));

    } catch (error: any) {
      alert('Error updating image: ' + error.message);
      console.error(error);
    } finally {
      setLoading(false);
      setProcessingKey(null);
      // Input එක clear කරනවා ආයෙත් එකම ෆයිල් එක තේරුවොත් change event එක වැඩ කරන්න
      e.target.value = '';
    }
  }

  // UI එක හදන්න පහසු වෙන්න කාඩ් වල විස්තර Array එකක් 
  // 👇 මෙතනට 4 වෙනි එක විදිහට Solution එක දැම්මා
  const imageSections = [
    { key: 'fashion_card_img', title: '01. SK Fashion Card', color: 'text-red-500' },
    { key: 'crafts_card_img', title: '02. SK Crafts Card', color: 'text-amber-500' },
    { key: 'digital_card_img', title: '03. SK Digital Card', color: 'text-indigo-500' },
    { key: 'solution_card_img', title: '04. SK Solution Card', color: 'text-teal-500' },
  ];

  return (
    <div className="min-h-screen bg-[#111113] text-white p-6 md:p-10">
      {/* Navigation Header */}
      <header className="flex justify-between items-center mb-10 border-b border-gray-800 pb-6">
        <div>
            <h1 className="text-2xl font-bold text-blue-500">ADMIN PANEL</h1>
            <p className='text-gray-500 text-sm'>Manage Homepage Dashboard Cards</p>
        </div>
        <div className='flex gap-2 bg-gray-900 p-1 rounded-full border border-gray-800'>
            <Link href="/admin" className="text-gray-400 px-4 py-2 rounded-full text-xs hover:text-white transition hover:bg-gray-800">Manage Products</Link>
            <Link href="/admin/dashboard" className="text-white bg-blue-600/20 px-4 py-2 rounded-full text-xs font-bold border border-blue-500/30">Dashboard Images</Link>
            <Link href="/" className="text-gray-400 px-4 py-2 rounded-full text-xs hover:text-white transition hover:bg-gray-800">View Site</Link>
        </div>
      </header>

      {/* 4 Categories Grid - 👇 මෙතන grid-cols-4 කරලා හැදුවා කාඩ් 4 ම ලස්සනට පේන්න */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {imageSections.map((section) => {
          const currentImgUrl = images[section.key as keyof typeof images];
          const isProcessing = loading && processingKey === section.key;

          return (
            <div key={section.key} className="bg-[#1c1c1e] p-7 rounded-3xl border border-gray-800 flex flex-col relative group overflow-hidden">
              
              {/* කාඩ් එක Hover කරද්දී පසුබිමින් පේන පොඩි පාටක් */}
              <div className={`absolute -inset-2 w-20 h-20 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition ${section.color.replace('text','bg')}`}></div>

              <div className='relative z-10'>
                <h3 className={`text-xl font-bold mb-6 tracking-tight ${section.color}`}>{section.title}</h3>
                
                {/* Image Preview Area */}
                <div className="relative w-full h-52 rounded-2xl overflow-hidden mb-6 bg-black border-2 border-gray-800 shadow-inner flex items-center justify-center">
                  {currentImgUrl ? (
                    <img 
                      src={currentImgUrl} 
                      alt={section.title}
                      className={`w-full h-full object-cover transition-opacity duration-300 ${isProcessing ? 'opacity-30' : 'opacity-100'}`}
                    />
                  ) : (
                    <div className='text-gray-700 text-xs font-mono'></div>
                  )}

                  {/* Individual Loading Overlay */}
                  {isProcessing && (
                    <div className="absolute inset-0 flex flex-col gap-2 items-center justify-center bg-black/60 backdrop-blur-sm">
                        <div className={`w-6 h-6 border-2 rounded-full animate-spin border-t-transparent ${section.color}`}></div>
                        <p className={`text-xs font-bold ${section.color}`}>Uploading...</p>
                    </div>
                  )}
                </div>

                {/* File Upload Input & Button */}
                <div className="flex flex-col gap-2.5 mt-auto">
                    <label className='text-[11px] text-gray-600 font-medium tracking-wide uppercase'>Change seasonal image (Recommended 16:9)</label>
                    
                    {/* පෙනුම ලස්සන කරන්න Custom File Input එකක් */}
                    <div className="relative group/input">
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => handleImageUpload(e, section.key)}
                            disabled={loading}
                            className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer disabled:cursor-not-allowed"
                        />
                        <div className="bg-gray-950 border border-gray-800 text-gray-300 p-3.5 rounded-xl text-sm font-semibold flex justify-between items-center group-hover/input:border-gray-700 transition disabled:opacity-50">
                            <span>{isProcessing ? 'Processing...' : 'Choose New Image'}</span>
                            <span className={`${section.color} group-hover/input:scale-110 transition`}>📸</span>
                        </div>
                    </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Global Processing Message (Optional) */}
      <footer className="p-8 mt-16 text-center text-xs text-gray-800 border-t border-gray-800/50">
        SK Creations &copy; 2024 - Dynamic Dashboard System v1.0
      </footer>
    </div>
  );
}