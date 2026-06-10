import { Product, Category } from './types';

export const categories: Category[] = [
  {
    id: 'pizza',
    title: 'Cutii Pizza',
    description: 'Simple sau personalizate',
    image: '/pizza-boxes.webp'
  },
  {
    id: 'carton',
    title: 'Cutii de carton',
    description: 'E-commerce, curierat & altele',
    image: '/cardboard-boxes.webp'
  },
  {
    id: 'pungi',
    title: 'Sacoșe & Pungi',
    description: 'Soluții practice pentru ambalare',
    image: '/bags.webp'
  }
];

export const products: Product[] = [
  {
    id: 'pizza-box-white',
    categoryId: 'pizza',
    title: 'Cutie Pizza Albă',
    description: 'Cutie de pizza din carton microondul E rezistent, exterior alb. Menține temperatura excelent și oferă un aspect curat, ideal pentru branduri premium sau preluări de logo.',
    image: '/pizza-alba-1.jpg.webp',
    images: ['/pizza-alba-1.jpg.webp', '/pizza-alba-2.webp'],
    basePrice: 0.85,
    minimumOrder: '100 buc / bax',
    features: [
      'Carton Microondul E',
      'Exterior alb premium',
      'Format autoformabil',
      'Excelentă pentru stampilare / print'
    ],
    options: [
      {
        id: 'dimensiune',
        name: 'Dimensiune (L x l x h)',
        values: [
          '24 x 24 x 4 cm',
          '26 x 26 x 4 cm',
          '28 x 28 x 4 cm',
          '30 x 30 x 4 cm',
          '32 x 32 x 4 cm',
          '33 x 33 x 4 cm',
          '40 x 40 x 4 cm',
          '45 x 45 x 4 cm'
        ]
      }
    ]
  },
  {
    id: 'pizza-box-kraft',
    categoryId: 'pizza',
    title: 'Cutie Pizza Natur (Kraft)',
    description: 'Cutie de pizza ecologică din carton kraft, aspect rustic și natural. Rezistență ridicată la grăsimi și condens, ideală pentru pizzeriile cu tematică artizanală.',
    image: '/pizza-natur-1.webp',
    images: ['/pizza-natur-1.webp', '/pizza-natur-2.webp'],
    basePrice: 0.80,
    minimumOrder: '100 buc / bax',
    features: [
      'Carton Kraft Natur',
      '100% Reciclabilă și ecologică',
      'Format autoformabil',
      'Rezistență termică excelentă'
    ],
    options: [
      {
        id: 'dimensiune',
        name: 'Dimensiune (L x l x h)',
        values: [
          '24 x 24 x 4 cm',
          '26 x 26 x 4 cm',
          '28 x 28 x 4 cm',
          '30 x 30 x 4 cm',
          '32 x 32 x 4 cm',
          '33 x 33 x 4 cm',
          '40 x 40 x 4 cm',
          '45 x 45 x 4 cm'
        ]
      }
    ]
  },
  {
    id: 'carton-co3',
    categoryId: 'carton',
    title: 'Cutie Carton CO3',
    description: 'Cutie din carton ondulat cu 3 straturi (CO3). Oferă cea mai bună variantă calitate-preț pentru magazinul tău online. Recomandată produselor ușoare și de dificultate medie.',
    image: '/carton-co3-1.webp',
    images: ['/carton-co3-1.webp', '/carton-co3-2.webp'],
    basePrice: 1.20,
    minimumOrder: '50 buc / set',
    features: [
      'Carton ondulat 3 straturi',
      'Ideale pentru e-commerce',
      'Cost de transport optim',
      'Asamblare facilă din format plat'
    ],
    options: [
      {
        id: 'dimensiune',
        name: 'Dimensiune (L x l x h)',
        values: [
          '200 x 150 x 150 mm',
          '200 x 200 x 200 mm',
          '250 x 150 x 150 mm',
          '250 x 200 x 200 mm',
          '250 x 250 x 250 mm',
          '300 x 150 x 150 mm',
          '300 x 200 x 200 mm',
          '300 x 250 x 250 mm',
          '300 x 300 x 300 mm',
          '350 x 250 x 250 mm',
          '350 x 300 x 300 mm',
          '350 x 350 x 350 mm',
          '400 x 200 x 200 mm',
          '400 x 300 x 150 mm',
          '400 x 300 x 300 mm',
          '400 x 400 x 300 mm',
          '400 x 400 x 400 mm',
          '450 x 450 x 300 mm',
          '500 x 200 x 200 mm',
          '500 x 300 x 300 mm',
          '500 x 400 x 300 mm',
          '500 x 400 x 400 mm',
          '600 x 300 x 200 mm',
          '600 x 400 x 200 mm',
          '600 x 300 x 300 mm',
          '600 x 400 x 300 mm',
          '600 x 400 x 400 mm',
          '800 x 500 x 300 mm',
          '800 x 500 x 400 mm'
        ]
      }
    ]
  },
  {
    id: 'carton-co5',
    categoryId: 'carton',
    title: 'Cutie Carton Extra CO5',
    description: 'Cutie din carton ultra-dur cu 5 straturi (CO5). Siguranță maximă la șocuri menită pentru electronice, electrocasnice, sticle, sau colete voluminoase și grele.',
    image: '/carton-co5-1.webp',
    images: ['/carton-co5-1.webp', '/carton-co5-2.webp'],
    basePrice: 2.15,
    minimumOrder: '25 buc / set',
    features: [
      'Carton dublu cu 5 straturi (CO5)',
      'Recomandat produselor perisabile / grele',
      'Stivuire în siguranță de lungă durată',
      'Protecție mare împotriva umezelii / perforări'
    ],
    options: [
      {
        id: 'dimensiune',
        name: 'Dimensiune (L x l x h)',
        values: [
          '250 x 150 x 150 mm',
          '300 x 200 x 200 mm',
          '300 x 300 x 200 mm',
          '400 x 300 x 300 mm',
          '400 x 400 x 300 mm',
          '400 x 400 x 400 mm',
          '600 x 400 x 250 mm',
          '600 x 400 x 400 mm'
        ]
      }
    ]
  },
  {
    id: 'saci-ldpe',
    categoryId: 'pungi',
    title: 'Saci LDPE 100x50 de 60 de microni',
    description: 'Saci rezistenți din folie LDPE (polietilenă de joasă densitate), grosime 60 microni. Ideali pentru ambalare industrială, protecție și depozitare.',
    image: '/saci-ldpe-1.webp',
    images: ['/saci-ldpe-1.webp', '/saci-ldpe-2.webp'],
    basePrice: 0.85,
    minimumOrder: '100 buc / set',
    features: [
      'Grosime: 60 microni',
      'Dimensiune: 100 x 50 cm',
      'Material: LDPE Reciclabil'
    ],
    options: []
  },
  {
    id: 'sacose-maieu',
    categoryId: 'pungi',
    title: 'Sacoșe tip maieu 60x32 de 50 microni',
    description: 'Sacoșe tip maieu foarte rezistente, grosime 50 microni. Perfecte pentru retail și transport produse grele.',
    image: '/sacose-maieu-1.webp',
    images: ['/sacose-maieu-1.webp', '/sacose-maieu-2.webp'],
    basePrice: 0.35,
    minimumOrder: '500 buc / cutie',
    features: [
      'Grosime: 50 microni',
      'Dimensiune: 60 x 32 cm',
      'Tip: Maieu'
    ],
    options: []
  }
];
