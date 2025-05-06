// app/routes/products/index.tsx (New File)
import { json, useLoaderData } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import { getProducts } from "~/utils/api"; // Use getProducts API
import { useContext } from "react";
import LanguageContext from "~/context/LanguageContext";
import ProductCard from "~/components/ProductCard"; // Import ProductCard

export async function loader({ request }) {
    const url = new URL(request.url);
    const category = url.searchParams.get('category'); // Example: allow filtering by category
    // Get language from request context or headers if needed server-side,
    // or rely on client-side context language for rendering
    const language = 'zh'; // Placeholder: Determine language properly

    try {
        // Pass category and language if API supports it
        const productsData = await getProducts({ category, lang: language });
        // Assuming API returns an array directly or { products: [...] }
        const products = Array.isArray(productsData) ? productsData : productsData?.products || [];
        return json({ products });
    } catch (error) {
        console.error("Error loading products:", error);
        return json({ products: [] }); // Return empty array on error
    }
}

export default function ProductsListPage() {
  const { products } = useLoaderData<typeof loader>();
  const { t } = useTranslation('products');
  const { language } = useContext(LanguageContext);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{t('title', 'Our Products')}</h1>
      {products && products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} language={language} />
          ))}
        </div>
      ) : (
        <p>{t('noProducts', 'No products found.')}</p>
      )}
       {/* Add category filters, pagination if needed */}
    </div>
  );
}