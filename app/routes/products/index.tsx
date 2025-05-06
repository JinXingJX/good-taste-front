// app/routes/products/index.tsx (New File)
import { useLoaderData } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getProducts } from "~/utils/api"; // Use getProducts API
import { useContext } from "react";
import LanguageContext from "~/context/LanguageContext";
import ProductCard from "~/components/ProductCard"; // Import ProductCard

// Define product interface
interface Product {
  id: string | number;
  [key: string]: any; // Allow for additional properties
}

// Define loader data interface
interface LoaderData {
  products: Product[];
}

// Helper function to create a JSON response
function json(data: any, init?: ResponseInit) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      ...init?.headers,
      'Content-Type': 'application/json',
    },
  });
}

export async function loader({ request }: { request: Request }) {
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
  const { products } = useLoaderData<LoaderData>();
  const { t } = useTranslation('products');
  const { language } = useContext(LanguageContext);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{t('title', 'Our Products')}</h1>
      {products && products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product: Product) => (
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