'use client'; 
import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isNavigating, setIsNavigating] = useState(false);

  // Admin Access Function eka
  const handleAdminClick = () => {
    const password = prompt("Admin Password eka athulath karanna:");
    
    if (password && password.trim() === "Shan1994") { 
      setIsNavigating(true); // Loading eka pennanna on karanawa
      // Next.js router eka nethuwa kelinma browser eka haraha yanawa (hirawenne ne)
      window.location.href = "/admin"; 
    } else if (password !== null) {
      alert("Waradi murapadayak!");
      setIsNavigating(false);
    }
  };

  return (
    <header className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center relative z-50">
      {/* Logo eka */}
      <div onClick={handleAdminClick} className="flex items-center gap-3 cursor-pointer group">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden border border-gray-800 group-hover:border-yellow-500 transition">
          <img src="/sk-logo.jpg" alt="SK Logo" className="w-full h-full object-cover scale-[1.2]" />
        </div>
        <span className="text-xl font-bold tracking-wide group-hover:text-yellow-500 transition">SK CREATION</span>
      </div>

      {/* Navigation */}
      <nav className="hidden md:flex gap-8 text-xs font-semibold text-gray-400 uppercase tracking-widest">
        <Link href="/about" className="hover:text-white cursor-pointer transition">About</Link>
        <span className="hover:text-white cursor-pointer transition">Branches</span>
        <span className="hover:text-white cursor-pointer transition">Store</span>
        <span className="hover:text-white cursor-pointer transition">Contact</span>
      </nav>

      {/* Admin Arrow Button */}
      <button 
        onClick={handleAdminClick}
        disabled={isNavigating}
        className="bg-yellow-500 hover:bg-yellow-400 transition-colors w-10 h-10 rounded-full flex items-center justify-center text-black font-bold text-lg shadow-[0_0_15px_rgba(234,179,8,0.4)] disabled:opacity-80"
      >
        {isNavigating ? "⏳" : "➔"}
      </button>
    </header>
  );
}
