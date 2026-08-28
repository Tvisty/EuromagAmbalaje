import React, { useEffect } from 'react';
import { Truck, CreditCard, RefreshCw, AlertCircle } from 'lucide-react';

interface InfoPageProps {
  section?: 'shipping' | 'returns';
}

export function InfoPage({ section = 'shipping' }: InfoPageProps) {
  useEffect(() => {
    if (section === 'returns') {
      const el = document.getElementById('returns');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [section]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Informații Utile
        </h1>
        <p className="mt-4 text-lg text-gray-500">
          Tot ce trebuie să știi despre livrare, plată și returnarea produselor.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Livrare Section */}
        <div id="shipping" className="p-8 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-brand-light/20 p-3 rounded-lg text-brand-dark">
              <Truck className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Livrare</h2>
          </div>
          <div className="space-y-4 text-gray-600">
            <p>
              Livrarea produselor achiziționate de pe site-ul nostru se face prin intermediul firmelor de curierat rapid (ex. Sameday), în condiții de siguranță, pe întreg teritoriul României. Excepție fac zonele unde accesul terestru este limitat. Pentru aceste zone, pot exista costuri suplimentare sau necesitatea ridicării din depozitul curierului.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-gray-900">Nu există comandă minimă.</strong>
              </li>
              <li>
                <strong className="text-gray-900">Livrare gratuită:</strong> Condițiile și pragul valoric pentru a beneficia de livrare gratuită sunt menționate clar pe site (în coșul de cumpărături sau pe prima pagină, în funcție de campaniile active).
              </li>
              <li>
                Pentru comenzile care nu se încadrează în condițiile de livrare gratuită, se percepe o taxă de livrare standard, afișată în momentul finalizării comenzii.
              </li>
              <li>
                Comenzile foarte voluminoase pot să nu beneficieze de transport gratuit, acest aspect fiindu-vă comunicat telefonic de un operator după plasarea comenzii.
              </li>
              <li>
                Promoțiile, cupoanele sau voucherele nu se cumulează. Dacă se suprapun două oferte, puteți beneficia doar de una dintre ele.
              </li>
            </ul>
            <p className="mt-4">
              <strong>Termenul de livrare:</strong> Este de 3-5 zile lucrătoare. În perioada sărbătorilor sau a campaniilor de reduceri, termenul de livrare se poate prelungi cu maxim 4 zile lucrătoare.
            </p>
          </div>
        </div>

        {/* Plata Section */}
        <div id="payment" className="p-8 border-b border-gray-200 bg-gray-50/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-brand-light/20 p-3 rounded-lg text-brand-dark">
              <CreditCard className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Modalități de Plată</h2>
          </div>
          <div className="space-y-4 text-gray-600">
            <p>
              Valoarea comenzii poate fi achitată astfel:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Ramburs (numerar)</strong> la curier, la primirea coletului.</li>
              <li><strong>Ordin de Plată (OP)</strong> în avans, în baza unei facturi proforme. Vă rugăm să nu efectuați plata înaintea primirii facturii proforme pe email.</li>
              <li><strong>Plată Online cu Cardul</strong> prin intermediul platformei securizate.</li>
            </ul>
            
            <div className="mt-6">
              <h3 className="font-bold text-gray-900 mb-2">Procesarea plăților online</h3>
              <p className="text-sm">
                Pentru a vă oferi opțiunea plății online, folosim procesatorul de plăți Stripe. Atunci când optați pentru plata online cu cardul, datele dumneavoastră (numărul cardului, data expirării, etc.) sunt introduse direct în formularul securizat al procesatorului. Euromag Ambalaje nu stochează datele cardului dumneavoastră. 
              </p>
            </div>
            
            <p className="text-sm text-gray-500 italic mt-4">
              * Euromag Ambalaje nu își asumă răspunderea pentru întârzieri sau anulări ale livrărilor cauzate de forță majoră, probleme logistice ale curierului, condiții meteo extreme etc., conform legislației în vigoare.
            </p>
          </div>
        </div>

        {/* Retur Section */}
        <div id="returns" className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-brand-light/20 p-3 rounded-lg text-brand-dark">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Politica de Retur</h2>
          </div>
          <div className="space-y-4 text-gray-600">
            <p>
              Conform legislației, returul produselor se poate face în maxim <strong>15 zile calendaristice</strong> de la primirea lor.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Costul returului:</strong> Este suportat de către client. Euromag Ambalaje suportă costul de retur numai în cazul în care s-a expediat un produs greșit sau defect din vina echipei noastre.
              </li>
              <li>
                <strong>Procedura de retur:</strong> Vă rugăm să ne informați în prealabil la adresa de email <a href="mailto:support@euromag-ambalaje.ro" className="text-brand-dark hover:underline">support@euromag-ambalaje.ro</a> sau la telefon <a href="tel:0740299451" className="text-brand-dark hover:underline">0740299451</a>. Specificați intenția de retur, contul bancar (IBAN) și numele titularului pentru restituirea sumei.
              </li>
              <li>
                Banii vor fi restituiți în cont în maxim 15 zile lucrătoare de la recepționarea și verificarea coletului retur.
              </li>
            </ul>

            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg my-6 flex items-start gap-3 text-sm text-yellow-800">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-yellow-600" />
              <div>
                <strong>Important:</strong> Produsul/produsele trimise retur trebuie să fie în starea în care au fost expediate, fără urme de folosire, și în ambalajul original. Seturile de produse trebuie să fie complete. În caz contrar, ne rezervăm dreptul de a refuza returul sau de a reține o sumă pentru diminuarea valorii produsului.
              </div>
            </div>

            <p>
              <strong>Produse personalizate:</strong> În cazul produselor personalizate la cererea clientului, nu se poate realiza returul, ținând cont de caracterul lor unic. Returul acestora este acceptat doar în situația constatării unor vicii clare de fabricație.
            </p>
            
            <div className="mt-8 border-t border-gray-100 pt-6">
              <h3 className="font-bold text-gray-900 mb-2">Ce se întâmplă dacă refuzi sau nu ridici un colet?</h3>
              <p>
                În cazul în care o comandă este refuzată sau neridicată de la curier, la o comandă viitoare ne rezervăm dreptul de a solicita plata în avans (prin OP sau card online), care să acopere atât comanda nouă, cât și taxa de transport tur-retur pentru coletul refuzat anterior.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
