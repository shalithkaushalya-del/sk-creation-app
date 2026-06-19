import Link from "next/link";

export default function About() {
  return (
    <main className="min-h-screen bg-[#111113] text-white font-sans relative pb-32">
      
      {/* Top Header */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center bg-[#111113]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden border border-gray-800">
            <img src="/sk-logo.jpg" alt="SK Logo" className="w-full h-full object-cover scale-[1.2]" />
          </div>
          <span className="text-xl font-bold tracking-wide">SK CREATION</span>
        </div>
        
        {/* Nav with Home link */}
        <nav className="hidden md:flex gap-8 text-xs font-semibold uppercase tracking-widest">
          <Link href="/" className="text-gray-400 hover:text-white cursor-pointer transition">Home</Link>
          <span className="text-yellow-500 cursor-pointer font-bold border-b border-yellow-500 pb-1">About</span>
        </nav>
      </header>

      {/* Main Content */}
      <section className="max-w-5xl mx-auto px-6 pt-16 flex flex-col items-center text-center">
        
        {/* Big Logo */}
        <div className="mb-10 w-48 h-48 md:w-64 md:h-64 rounded-full shadow-[0_0_60px_rgba(202,138,4,0.3)] overflow-hidden border border-gray-800 bg-black relative">
          <div className="absolute inset-0 bg-yellow-600/10 blur-[30px] rounded-full pointer-events-none"></div>
          <img 
            src="/sk-logo.jpg" 
            alt="SK Creations Logo" 
            className="w-full h-full object-cover object-center relative z-10"
          />
        </div>

        {/* Company Title */}
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
          SK Creations Group <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-200">of Companies</span>
        </h1>
        
        <p className="text-gray-400 max-w-2xl text-lg mb-20 leading-relaxed">
          Experience the next generation of premium fashion, handcrafted arts, and digital innovation driven by masterclass excellence.
        </p>

        {/* Modern Vision & Mission Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full text-left">
          
          {/* Vision Card */}
          <div className="bg-[#161618] border border-gray-800 rounded-3xl p-10 hover:border-yellow-500/50 transition-all duration-500 shadow-2xl relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl group-hover:bg-yellow-500/20 transition-all"></div>
            <span className="text-yellow-500 text-5xl mb-6 block drop-shadow-[0_0_15px_rgba(234,179,8,0.6)]">👁️‍🗨️</span>
            <h3 className="text-3xl font-bold mb-4 text-white">Our Vision</h3>
            <p className="text-gray-400 leading-relaxed text-lg">
              To lead in crafting unique, technology-driven creative solutions that initiate artistic excellence, sustain innovation, and provide masterclass experiences globally.
            </p>
          </div>

          {/* Mission Card */}
          <div className="bg-[#161618] border border-gray-800 rounded-3xl p-10 hover:border-yellow-500/50 transition-all duration-500 shadow-2xl relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl group-hover:bg-yellow-500/20 transition-all"></div>
            <span className="text-yellow-500 text-5xl mb-6 block drop-shadow-[0_0_15px_rgba(234,179,8,0.6)]">🎯</span>
            <h3 className="text-3xl font-bold mb-4 text-white">Our Mission</h3>
            <p className="text-gray-400 leading-relaxed text-lg">
              Dedicated to delivering high-quality, innovative artistry through cutting-edge technology and personalized service, empowering our clients and setting new standards.
            </p>
          </div>

        </div>
      </section>
    </main>
  );
}