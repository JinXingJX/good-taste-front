import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function ProductCard({ product, language }) {
  const { t } = useTranslation(['products', 'common']);

  // Handle product name and description based on language
  const productName = language === 'zh' ? product.name_zh : product.name_en;
  const productDesc = language === 'zh' ? product.desc_zh : product.desc_en;

  return (
    <Link
      to={`/products/${product.id}`}
      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="aspect-w-16 aspect-h-9 bg-gray-200">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={productName}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 flex items-center justify-center text-gray-400">
            {t('products:noImage')}
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">
          {productName}
        </h3>
        <p className="text-gray-600 line-clamp-3">
          {productDesc}
        </p>
        <div className="mt-4 text-blue-600 font-medium">
          {t('common:buttons.readMore')} →
        </div>
      </div>
    </Link>
  );
}