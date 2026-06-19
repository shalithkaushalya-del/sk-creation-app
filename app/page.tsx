"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import { supabase } from '@/lib/supabase';

// Slider component for the 4 top blocks
const AutoSlider = ({ images }: { images: string[] }) => {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [images]);

  return (
    <div className="relative w-full h-full overflow-hidden rounded-xl border border-gray-800">
      <AnimatePresence mode="wait">
        <motion.img
          key={images[index]}
          src={images[index]}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full object-cover opacity-80"
          alt="slider-img"
        />
      </AnimatePresence>
    </div>
  );
};

export default function Home() {
  const [images, setImages] = useState({
    fashion_card_img: '/fashion-bg.jpg',
    crafts_card_img: '/craft-bg.jpg',
    digital_card_img: '/digital-bg.jpg',
    solution_card_img: '/solution-bg.jpg'
  });

  useEffect(() => {
    async function fetchImages() {
      const { data } = await supabase.from('site_settings').select('*');
      if (data) {
        const imgMap = data.reduce((acc: any, item) => {
          acc[item.asset_key] = item.image_url;
          return acc;
        }, {});
        setImages(prev => ({ ...prev, ...imgMap }));
      }
    }
    fetchImages();
  }, []);

  const fashionItems = ["/fashion-1.jpg", "/fashion-2.jpg", "/fashion-3.jpg"];
  const craftItems = ["/craft-1.jpg", "/craft-2.jpg", "/craft-3.jpg"];
  const digitalItems = ["/digital-1.jpg", "/digital-2.jpg", "/digital-3.jpg"];
  const solutionItems = ["/solution-1.jpg", "/solution-2.jpg", "/solution-3.jpg"];

  const cards = [
    { name: "SK Fashion", link: "/fashion", desc: "Premium T-Shirt printing & custom exclusive urban streetwear.", img: images.fashion_card_img, logo: "/sk-fashion-logo.png", border: "hover:border-red-500/50" },
    { name: "SK Craft", link: "/craft", desc: "Handmade resin clocks, keytags and floral beautiful decor.", img: images.crafts_card_img, logo: "/sk-craft-logo.png", border: "hover:border-amber-500/50" },
    { name: "SK Digital", link: "/digital", desc: "AI-generated promo videos, scripts, and digital masterclass.", img: images.digital_card_img, logo: "/sk-digital-logo.png", border: "hover:border-purple-500/50" },
    { name: "SK Solution", link: "/solutions", desc: "Explore our exclusive professional tools and digital solutions.", img: images.solution_card_img, logo: "/sk-solution-logo.png", border: "hover:border-teal-500/50" }
  ];

  return (
    <main className="min-h-screen bg-[#111113] text-white font-sans relative pb-32 overflow-x-hidden">
      <Header />

      <section className="max-w-7xl mx-auto px-6 pt-8 pb-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight mb-6">
            SK Creation Group<br />of Companies
          </h1>
        </div>

        {/* ඔන්න අර කලින් තිබ්බ රූප රාමු Blocks 4 */}
        <div className="grid grid-cols-3 grid-rows-2 gap-3 h-64 md:h-80">
          <div className="col-span-1 row-span-2"><AutoSlider images={fashionItems} /></div>
          <div className="col-span-2 row-span-1"><AutoSlider images={craftItems} /></div>
          <div className="col-span-1 row-span-1"><AutoSlider images={digitalItems} /></div>
          <div className="col-span-1 row-span-1"><AutoSlider images={solutionItems} /></div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {cards.map((card, idx) => (
          <Link key={idx} href={card.link} className={`relative rounded-[2rem] h-[600px] overflow-hidden group border border-gray-800 flex flex-col items-center text-center transition-all duration-500 cursor-pointer shadow-2xl bg-[#0a0505] ${card.border}`}>
            
            <div className="absolute inset-0 z-0">
               <img 
                src={card.img} 
                className="w-full h-full object-cover opacity-60" 
                style={{ WebkitMaskImage: "linear-gradient(to bottom, transparent 10%, black 70%)" }}
                alt={card.name}
              />
            </div>

            <div className="relative z-10 flex flex-col items-center mt-12 w-full px-6">
                <div className="w-32 h-32 rounded-full border border-gray-700/50 bg-black/40 flex items-center justify-center mb-6 overflow-hidden">
                    <img src={card.logo} alt="Logo" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-2xl font-black text-white tracking-widest uppercase">{card.name}</h3>
                <p className="mt-4 text-gray-400 text-sm leading-relaxed max-w-[80%]">
                {card.desc}
                </p>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}