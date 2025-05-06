// app/routes/admin/pages/$key.jsx
import { useState, useEffect, useContext } from 'react';
import { json, useLoaderData, useParams, useNavigate, useFetcher, Form } from '@react-router/node';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { getPage as apiGetPage, updatePage as apiUpdatePage } from '../../../utils/api'; // Use API functions
import RichTextEditor from '../../../components/admin/RichTextEditor'; // Placeholder
import LanguageContext from '~/context/LanguageContext'; // Import LanguageContext

// Server/Client Loader
export async function loader({ params, request }) {
  const { pageKey } = params; // Changed param name to pageKey to avoid conflict
  const { language } = useContext(LanguageContext); // Get language from context

  if (!pageKey) {
    throw new Response("Missing page key", { status: 400 });
  }

  try {
    console.log(`Loader: Fetching page ${pageKey}`);
    const pageData = await apiGetPage(pageKey, language); // Call the actual API
    if (!pageData) {
        throw new Response("Page Not Found", { status: 404 });
    }
    return json({ page: pageData });
  } catch (error: any) {
    console.error(`Error loading page ${pageKey}:`, error);
    // Handle specific errors (like 404) or re-throw for error boundary
    if (error.response?.status === 404) {
      throw new Response("Page Not Found", { status: 404 });
    }
     // Handle auth error potentially thrown by interceptor
     if (error.response?.status === 401) {
         console.log("Loader: Caught 401, redirecting to login.");
         const url = new URL(request.url);
         return redirect(`/admin/login?redirectTo=${url.pathname}`);
     }
    // Throw a generic error for other issues
    throw new Response("Error loading page data", { status: error.response?.status || 500 });
  }
}

// Action function to handle form submission
export async function action({ request, params }) {
    const { pageKey } = params;
    if (!pageKey) {
        return json({ success: false, error: "Missing page key" }, { status: 400 });
    }

    const formData = await request.formData();
    const updates = Object.fromEntries(formData);

    try {
        console.log(`Action: Updating page ${pageKey}`);
        // Assume RichTextEditor values are submitted as 'content_zh' and 'content_en'
        const updatedPage = await apiUpdatePage(pageKey, {
            title_zh: updates.title_zh,
            title_en: updates.title_en,
            content_zh: updates.content_zh, // Make sure RichTextEditor puts content here
            content_en: updates.content_en, // Make sure RichTextEditor puts content here
            // Add SEO fields if they are part of the form
            // seo_keywords: updates.seo_keywords,
            // seo_desc: updates.seo_desc,
        });
        return json({ success: true, page: updatedPage, message: 'Page saved successfully!' });
    } catch (error: any) {
        console.error('Error saving page:', error);
         // Handle auth error potentially thrown by interceptor
        if (error.response?.status === 401) {
            console.log("Action: Caught 401, redirecting to login.");
            const url = new URL(request.url);
            return redirect(`/admin/login?redirectTo=${url.pathname}`);
        }
        return json({
            success: false,
            error: error.response?.data?.error || 'Failed to save page'
        }, { status: error.response?.status || 500 });
    }
}


export default function PageEditor() {
  // useLoaderData provides data from the loader function
  const { page } = useLoaderData<typeof loader>();
  // useParams gets URL parameters
  const { pageKey } = useParams();
  // useTranslation for i18n
  const { t } = useTranslation(['admin', 'common']);
  // useNavigate for programmatic navigation
  const navigate = useNavigate();
  // useFetcher for handling the action submission state
  const fetcher = useFetcher<typeof action>();

  // Get language context
  const { language } = useContext(LanguageContext);

  // Local state for Rich Text Editor content (since it might not be a standard form input)
  const [contentZh, setContentZh] = useState(page?.content_zh || '');
  const [contentEn, setContentEn] = useState(page?.content_en || '');

  // React Hook Form setup
  const { register, handleSubmit, setValue, formState: { errors, isDirty } } = useForm({
    defaultValues: {
      title_zh: page?.title_zh || '',
      title_en: page?.title_en || '',
      // seo_keywords: page?.seo_keywords || '', // Add if needed
      // seo_desc: page?.seo_desc || ''       // Add if needed
    }
  });

  // Update form values if the loaded page data changes (e.g., after save)
  useEffect(() => {
    if (fetcher.data?.success && fetcher.data.page) {
      // Reset form with new data after successful save
      setValue('title_zh', fetcher.data.page.title_zh);
      setValue('title_en', fetcher.data.page.title_en);
      setContentZh(fetcher.data.page.content_zh);
      setContentEn(fetcher.data.page.content_en);
      // Optionally reset dirty state if useForm supports it, or manage manually
    } else if (page) {
       // Initial load or if fetcher data is not success
       setValue('title_zh', page.title_zh);
       setValue('title_en', page.title_en);
       setContentZh(page.content_zh);
       setContentEn(page.content_en);
    }
  }, [page, fetcher.data, setValue]);


  // Determine loading state and messages from the fetcher
  const isSubmitting = fetcher.state === 'submitting';
  const saveStatus = fetcher.data; // Contains { success, message/error } from action

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {t('admin:pages.editing')}: {language === 'zh' ? page.title_zh : page.title_en}
        </h1>
        {/* Language selector removed - assuming language is global via context now */}
      </div>

      {/* Display Save Status */}
      {saveStatus && saveStatus.message && (
        <div
          className={`mb-6 p-4 rounded-md ${
            saveStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {saveStatus.message}
        </div>
      )}
      {saveStatus && !saveStatus.success && saveStatus.error && (
         <div className="mb-6 p-4 rounded-md bg-red-100 text-red-800">
           {saveStatus.error}
         </div>
      )}


      {/* Use React Router's Form component to trigger the action */}
      <fetcher.Form method="post">
        {/* Hidden inputs to pass Rich Text Editor content */}
        <input type="hidden" name="content_zh" value={contentZh} />
        <input type="hidden" name="content_en" value={contentEn} />

        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold mb-4">
              {t('admin:pages.basicInfo')} ({language === 'zh' ? '中文' : 'English'})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="title_zh" className="block text-gray-700 font-medium mb-2">
                  {t('admin:pages.titleZh')}
                </label>
                <input
                  id="title_zh"
                  type="text"
                  {...register('title_zh', { required: t('common:forms.required') })}
                  className={`w-full border rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.title_zh ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.title_zh && (
                  <p className="mt-1 text-red-500 text-sm">
                    {errors.title_zh.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="title_en" className="block text-gray-700 font-medium mb-2">
                  {t('admin:pages.titleEn')}
                </label>
                <input
                  id="title_en"
                  type="text"
                  {...register('title_en', { required: t('common:forms.required') })}
                  className={`w-full border rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.title_en ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.title_en && (
                  <p className="mt-1 text-red-500 text-sm">
                    {errors.title_en.message}
                  </p>
                )}
              </div>
            </div>
          </div>


          <div className="p-6 border-b border-gray-200">
             <h2 className="text-xl font-semibold mb-4">
               {t('admin:pages.content')} ({language === 'zh' ? '中文' : 'English'})
             </h2>
             {/* Render correct editor based on global language */}
             {language === 'zh' ? (
                <RichTextEditor
                   key={`editor-zh-${pageKey}`} // Add key to help re-render if needed
                   value={contentZh}
                   onChange={setContentZh} // Update local state
                   placeholder={t('admin:pages.contentPlaceholder')}
                 />
             ) : (
                <RichTextEditor
                   key={`editor-en-${pageKey}`}
                   value={contentEn}
                   onChange={setContentEn} // Update local state
                   placeholder={t('admin:pages.contentPlaceholder')}
                 />
             )}
           </div>

          {/* SEO Section (Optional - Add if needed) */}
          {/*
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              {t('admin:pages.seo')}
            </h2>
            // SEO input fields here...
          </div>
          */}
        </div>

        <div className="flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/admin/pages')} // Navigate back to list
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {t('common:buttons.cancel')}
          </button>

          <button
            type="submit"
            disabled={isSubmitting || !isDirty} // Disable if submitting or no changes
            className={`px-6 py-2 border border-transparent rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              (isSubmitting || !isDirty) ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('admin:pages.saving')}
              </span>
            ) : (
              t('common:buttons.save')
            )}
          </button>
        </div>
      </fetcher.Form>
    </div>
  );
}