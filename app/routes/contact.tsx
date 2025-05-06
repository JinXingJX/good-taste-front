// app/routes/contact.tsx (New File)
import { useLoaderData } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getPage } from "~/utils/api";
import { useContext } from "react";
import LanguageContext from "~/context/LanguageContext";
// Optional: Import icons if needed
// import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

export async function loader() {
    try {
        // Fetch general page content for 'contact'
        const pageData = await getPage('contact');
        // You might need another API call to get specific settings like address, phone, etc.
        // const settings = await getSettings(); // Example if settings API exists
        return json({ page: pageData /*, settings: settings */ });
    } catch (error) {
        console.error("Error loading contact page:", error);
        throw new Response("Not Found", { status: 404 });
    }
}

export default function ContactPage() {
  const { page /*, settings */ } = useLoaderData<typeof loader>();
  const { t } = useTranslation('contact'); // Assuming 'contact' namespace
  const { language } = useContext(LanguageContext);

  const title = language === 'zh' ? page?.title_zh : page?.title_en;
  const content = language === 'zh' ? page?.content_zh : page?.content_en;

  // Example: Extract specific contact info (replace with actual data structure from API)
  const address = /* settings?.address || */ t('addressPlaceholder', '123 Main St, Anytown');
  const phone = /* settings?.phone || */ t('phonePlaceholder', '+1 234 567 890');
  const email = /* settings?.email || */ t('emailPlaceholder', 'info@example.com');


  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{title || t('title', 'Contact Us')}</h1>
      {content && (
         <div className="prose dark:prose-invert max-w-none mb-8" dangerouslySetInnerHTML={{ __html: content }} />
      )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Details */}
            <div className="space-y-4">
                 <h2 className="text-xl font-semibold">{t('contactInfo', 'Contact Information')}</h2>
                 <p className="flex items-center">
                    {/* <FaMapMarkerAlt className="mr-2 text-blue-600" /> */}
                    <span>{address}</span>
                 </p>
                 <p className="flex items-center">
                     {/* <FaPhone className="mr-2 text-blue-600" /> */}
                     <a href={`tel:${phone}`} className="hover:underline">{phone}</a>
                 </p>
                 <p className="flex items-center">
                     {/* <FaEnvelope className="mr-2 text-blue-600" /> */}
                     <a href={`mailto:${email}`} className="hover:underline">{email}</a>
                 </p>
            </div>

             {/* Map Placeholder (replace with actual map embed) */}
             <div>
                 <h2 className="text-xl font-semibold mb-4">{t('location', 'Our Location')}</h2>
                 <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center text-gray-500">
                     {t('mapPlaceholder', 'Map Area')}
                 </div>
             </div>
        </div>

      {/* Optionally include the message form again */}
      {/* <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">{t('sendMessageTitle', 'Send us a Message')}</h2>
          <MessageForm /> // If you extract the form into a component
      </div> */}
    </div>
  );
}