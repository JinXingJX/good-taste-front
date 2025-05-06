// app/routes/resources.tsx
import { useRouteLoaderData } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getPage } from "../utils/api";
import { useContext } from "react";
import LanguageContext from "../context/LanguageContext";

export async function loader({ request }: { request: Request }) {
    try {
        // Default to English if no language specified
        const language = new URL(request.url).searchParams.get('language') || 'en';
        const pageData = await getPage('resources', language);
        return { page: pageData };
    } catch (error) {
        console.error("Error loading resources page:", error);
        throw new Response("Not Found", { status: 404 });
    }
}

export default function ResourcesPage() {
  const data = useRouteLoaderData('resources') as { page: any };
  const { t } = useTranslation('resources'); // Assuming a 'resources' namespace
  const { language } = useContext(LanguageContext);

  const page = data?.page;
  const title = language === 'zh' ? page?.title_zh : page?.title_en;
  const content = language === 'zh' ? page?.content_zh : page?.content_en;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{title || t('title', 'Raw Material Resources')}</h1>
      {content ? (
         <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
      ) : (
         <p>{t('loading', 'Loading content...')}</p>
      )}
      {/* Add specific layout for resources */}
    </div>
  );
}