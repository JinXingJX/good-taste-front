// app/routes/about.tsx (New File)
import { useLoaderData } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getPage } from "../utils/api";
import { useContext } from "react";
import LanguageContext from "../context/LanguageContext";

export async function loader() {
    try {
        // Fetch data for both languages
        const enPageData = await getPage('about', 'en');
        const zhPageData = await getPage('about', 'zh');
        return { 
            page: {
                title_en: enPageData.title,
                content_en: enPageData.content,
                title_zh: zhPageData.title,
                content_zh: zhPageData.content
            } 
        };
    } catch (error) {
        console.error("Error loading about page:", error);
        throw new Response("Not Found", { status: 404 }); // Or handle error differently
    }
}

export default function AboutPage() {
  const { page } = useLoaderData<typeof loader>();
  const { t } = useTranslation('about'); // Assuming an 'about' namespace
  const { language } = useContext(LanguageContext);

  const title = language === 'zh' ? page?.title_zh : page?.title_en;
  const content = language === 'zh' ? page?.content_zh : page?.content_en;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{title || t('title', 'About Us')}</h1>
      {content ? (
         <div dangerouslySetInnerHTML={{ __html: content }} />
      ) : (
         <p>{t('loading', 'Loading content...')}</p>
      )}
       {/* Add more specific content structure */}
    </div>
  );
}