sed -i 's/basePrice: number | string, discount: number | string }/basePrice: number | string, discount: number | string, isOutOfStock?: boolean }/g' src/pages/AdminPage.tsx
sed -i 's/basePrice: 0, discount: 0 }/basePrice: 0, discount: 0, isOutOfStock: false }/g' src/pages/AdminPage.tsx
