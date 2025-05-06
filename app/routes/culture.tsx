// app/routes/culture.tsx
import { useLoaderData, type LoaderFunctionArgs } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getPage } from "../utils/api.js";
import { useContext } from "react";
import LanguageContext from "~/context/LanguageContext";

export async function loader({ request }: LoaderFunctionArgs) {
    try {
        // Get the language from the URL or default to 'zh'
        const url = new URL(request.url);
        const lang = url.searchParams.get('lang') || 'zh';
        
        const pageData = await getPage('culture', lang); // Pass language parameter
        return { page: pageData };
    } catch (error) {
        console.error("Error loading culture page:", error);
        throw new Response("Not Found", { status: 404 });
    }
}

export default function CulturePage() {
  const { page } = useLoaderData() as { page: any };
  const { t } = useTranslation('culture'); // Assuming a 'culture' namespace
  const { language } = useContext(LanguageContext);

  const title = language === 'zh' ? page?.title_zh : page?.title_en;
  const content = language === 'zh' ? page?.content_zh : page?.content_en;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{title || t('title', 'Culture & Us')}</h1>
      {content ? (
         <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
      ) : (
         <p>{t('loading', 'Loading content...')}</p>
      )}
      {/* Add specific layout for culture/team */}
    </div>
  );
}