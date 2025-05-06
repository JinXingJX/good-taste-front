// app/routes/message.tsx (New File)
import { json, useFetcher, Form } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { submitMessage } from "~/utils/api";
import Input from "~/components/ui/Input"; // Assuming UI components exist
import Button from "~/components/ui/Button";

// Action to handle form submission
export async function action({ request }) {
    const formData = await request.formData();
    const messageData = Object.fromEntries(formData);

    // Basic validation example (add more as needed)
    if (!messageData.name || !messageData.email || !messageData.content) {
        return json({ success: false, error: 'Please fill in all required fields.', errors: { required: true } }, { status: 400 });
    }

    try {
        await submitMessage(messageData);
        return json({ success: true, message: 'Your message has been sent successfully!' });
    } catch (error: any) {
        console.error("Error submitting message:", error);
        return json({ success: false, error: error.response?.data?.error || 'Failed to send message.' }, { status: 500 });
    }
}


export default function MessagePage() {
  const { t } = useTranslation(['message', 'common']); // Assuming 'message' namespace
  const fetcher = useFetcher<typeof action>();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const isSubmitting = fetcher.state === 'submitting';
  const submissionResult = fetcher.data;

   // Reset form on successful submission
   useEffect(() => {
    if (submissionResult?.success) {
      reset();
    }
  }, [submissionResult, reset]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{t('title', 'Online Message')}</h1>

        {submissionResult && (
            <div className={`mb-4 p-3 rounded ${submissionResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {submissionResult.success ? submissionResult.message : submissionResult.error}
            </div>
        )}

      {/* Use React Router Form to trigger the action */}
      <fetcher.Form method="post" onSubmit={handleSubmit(()=> fetcher.submit(event?.target))} className="space-y-4 max-w-lg">
        <Input
          label={t('common:forms.name')}
          id="name"
          {...register('name', { required: t('common:forms.required') })}
          error={errors.name?.message || (submissionResult?.errors?.required && !errors.name ? t('common:forms.required') : '')}
          required
          disabled={isSubmitting}
        />
        <Input
          label={t('common:forms.email')}
          id="email"
          type="email"
          {...register('email', {
             required: t('common:forms.required'),
             pattern: { value: /^\S+@\S+$/i, message: t('common:forms.invalidEmail') }
          })}
          error={errors.email?.message || (submissionResult?.errors?.required && !errors.email ? t('common:forms.required') : '')}
          required
          disabled={isSubmitting}
        />
        <Input
          label={t('common:forms.phone')}
          id="phone"
          {...register('phone')} // Optional field
          disabled={isSubmitting}
        />
        <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                 {t('common:forms.message')} <span className="text-red-500">*</span>
            </label>
            <textarea
                id="content"
                rows={5}
                 {...register('content', { required: t('common:forms.required') })}
                className={`w-full border rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500 ${errors.content ? 'border-red-500' : 'border-gray-300'}`}
                disabled={isSubmitting}
            />
             {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>}
             {(submissionResult?.errors?.required && !errors.content) && <p className="mt-1 text-sm text-red-600">{t('common:forms.required')}</p>}
        </div>

        <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
          {isSubmitting ? t('common:buttons.sending', 'Sending...') : t('common:buttons.send')}
        </Button>
      </fetcher.Form>
    </div>
  );
}