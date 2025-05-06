// app/routes/products/$id.tsx (New File)
import { useLoaderData } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getProductById } from "~/utils/api"; // Use getProductById API
import { useContext } from "react";
import LanguageContext from "~/context/LanguageContext";

export async function loader({ params }) {
    const { id } = params;
    if (!id) {
      throw new Response("Missing product ID", { status: 400 });
    }
    // Placeholder for language - determine properly
    const language = 'zh';

    try {
        const product = await getProductById(id, language);
         if (!product) {
            throw new Response("Product Not Found", { status: 404 });
        }
        return json({ product });
    } catch (error: any) {
        console.error(`Error loading product ${id}:`, error);
         if (error.response?.status === 404) {
            throw new Response("Product Not Found", { status: 404 });
        }
        throw new Response("Error loading product", { status: 500 });
    }
}

export default function ProductDetailPage() {
  const { product } = useLoaderData<typeof loader>();
  const { t } = useTranslation(['products', 'common']);
  const { language } = useContext(LanguageContext);

  const name = language === 'zh' ? product?.name_zh : product?.name_en;
  const description = language === 'zh' ? product?.desc_zh : product?.desc_en;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{name || t('productTitle', 'Product Details')}</h1>
      {product?.image_url && (
         <img src={product.image_url} alt={name} className="w-full h-64 object-cover rounded-lg mb-6"/>
      )}
      {description ? (
         <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: description }} />
      ) : (
         <p>{t('loadingDesc', 'Loading description...')}</p>
      )}
       {/* Add more details: category, specs, etc. */}
       <div className="mt-8">
            <a href="/products" className="text-blue-600 hover:underline">
                 &larr; {t('common:buttons.backToList', 'Back to Products')}
            </a>
       </div>
    </div>
  );
}