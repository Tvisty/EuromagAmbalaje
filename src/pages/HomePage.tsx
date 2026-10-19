import React, { useState } from 'react';
import { ChevronRight, Package, Truck, ShieldCheck, Scissors, CheckCircle2 } from 'lucide-react';
import { categories } from '../data';
import { QuoteModal } from '../components/QuoteModal';

interface HomePageProps {
  onNavigateToCategory: (categoryId: string) => void;
}

export function HomePage({ onNavigateToCategory }: HomePageProps) {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  return (
    <>
      <QuoteModal isOpen={isQuoteModalOpen} onClose={() => setIsQuoteModalOpen(false)} />
      
      {/* Hero Section with Full-Bleed Background Image */}
      <section className="relative min-h-[580px] lg:min-h-[640px] flex items-center overflow-hidden border-b border-gray-200">
        {/* Full Section Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero1.webp" 
            alt="Ambalaje carton și cutii pizza Euromag" 
            className="w-full h-full object-cover object-center lg:object-[68%_center]"
          />
          {/* Subtle warm/brand depth blend */}
          <div className="absolute inset-0 bg-[#0c1813]/25 mix-blend-multiply pointer-events-none"></div>
          {/* Main directional gradient ensuring text is crisp and readable */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950/95 via-gray-950/80 to-gray-950/20 sm:to-transparent pointer-events-none"></div>
          {/* Extra bottom vignette for mobile */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-transparent to-black/30 lg:hidden pointer-events-none"></div>
        </div>

        {/* Hero Content Over Image */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 lg:py-24 relative z-10 w-full">
          <div className="max-w-2xl">
            
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs sm:text-sm font-semibold mb-6 shadow-sm w-fit">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-light animate-pulse"></span>
              Producție &amp; Distribuție Ambalaje B2B &amp; HoReCa
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.12] tracking-tight mb-6 drop-shadow-md">
              Ambalaje rezistente <br className="hidden sm:block" />
              <span className="text-brand-light">pentru succesul</span> afacerii tale
            </h1>

            <p className="text-base sm:text-lg text-gray-200 mb-8 max-w-xl leading-relaxed drop-shadow">
              Cutii pizza concepute pentru prospețime, cutii din carton ondulat CO3 &amp; CO5 pentru transport sigur și sacoșe trainice. Prețuri directe de producător și stoc permanent.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button 
                onClick={() => {
                  const catalogSection = document.getElementById('catalog-categorii');
                  catalogSection?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-brand-light hover:bg-[#52ad49] text-gray-950 font-bold py-3.5 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2 text-base cursor-pointer"
              >
                Vezi Catalogul de Produse
                <ChevronRight className="w-5 h-5 text-gray-950" />
              </button>
              <button 
                onClick={() => setIsQuoteModalOpen(true)}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md font-semibold py-3.5 px-8 rounded-xl transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 text-base cursor-pointer"
              >
                Cere Ofertă Personalizată
              </button>
            </div>

            {/* Value props micro-pills */}
            <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-white/20 max-w-lg">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-light shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-gray-200">Stoc permanent</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-light shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-gray-200">Preț producător</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-gray-100">
            <div className="flex flex-col items-center justify-center p-4">
              <div className="w-12 h-12 bg-brand-light/10 rounded-full flex items-center justify-center mb-3 text-brand-dark">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-900">Stoc Permanent</h3>
              <p className="text-sm text-gray-500 mt-1">Peste 100 de dimensiuni standard</p>
            </div>
            <div className="flex flex-col items-center justify-center p-4">
              <div className="w-12 h-12 bg-brand-light/10 rounded-full flex items-center justify-center mb-3 text-brand-dark">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-900">Livrare Rapidă</h3>
              <p className="text-sm text-gray-500 mt-1">Oriunde în România</p>
            </div>
            <div className="flex flex-col items-center justify-center p-4">
              <div className="w-12 h-12 bg-brand-light/10 rounded-full flex items-center justify-center mb-3 text-brand-dark">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-900">Calitate Garantată</h3>
              <p className="text-sm text-gray-500 mt-1">Carton ondulat rezistent, testat</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Categories Section */}
      <section id="catalog-categorii" className="py-16 bg-bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-slate">Categorii Produse</h2>
            <p className="text-gray-500 mt-2 text-lg">Alege categoria pentru a vedea modelele și dimensiunile disponibile.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map(category => (
              <button 
                key={category.id}
                onClick={() => onNavigateToCategory(category.id)} 
                className="group relative rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col text-left"
              >
                <div className="aspect-square overflow-hidden relative bg-gray-50">
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors z-10"></div>
                  <img 
                    src={category.image} 
                    alt={category.title} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-6 flex items-center justify-between bg-white z-20 flex-grow">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-brand-dark transition-colors">{category.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{category.description.substring(0, 50)}...</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-bg-light flex flex-shrink-0 items-center justify-center group-hover:bg-brand-light group-hover:text-white transition-colors text-gray-400">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Bulk / Custom Section */}
      <section className="py-16 md:py-24 bg-brand-slate text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="box-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M0 40L40 0H20L0 20M40 40V20L20 40" stroke="currentColor" strokeWidth="1" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#box-pattern)" />
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-light/20 text-brand-light mb-6">
                <Scissors className="w-8 h-8" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ambalaje Personalizate & Comenzi Bulk</h2>
              <p className="text-gray-300 text-lg mb-8">
                Diferențiază-te de concurență! Producem cutii de pizza și cutii de transport personalizate cu logo-ul și designul brandului tău. Oferim prețuri speciale pentru comenzi de volum.
              </p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-light flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="ml-3 text-gray-200">Print flexografic de înaltă calitate (1-3 culori)</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-light flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="ml-3 text-gray-200">Dimensiuni atipice la cerere (ștanțe personalizate)</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-light flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="ml-3 text-gray-200">Consultanță gratuită pentru optimizarea costurilor</span>
                </li>
              </ul>
              
              <button 
                onClick={() => setIsQuoteModalOpen(true)}
                className="bg-brand-light hover:bg-brand-light/90 text-white font-bold py-3.5 px-8 rounded-lg transition-all shadow-lg hover:shadow-xl"
              >
                Cere Ofertă B2B
              </button>
            </div>
            
            <div className="w-full md:w-1/2">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <img 
                  src="https://picsum.photos/seed/customboxes/800/600" 
                  alt="Cutii personalizate" 
                  className="w-full h-auto object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-slate/80 to-transparent flex items-end p-8">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl">
                    <p className="text-white font-medium">"Ambalajul este primul contact fizic al clientului cu brandul tău."</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
