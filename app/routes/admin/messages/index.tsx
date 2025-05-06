// app/routes/admin/messages/index.tsx (New File)
import { json, useLoaderData, useFetcher, redirect } from "react-router";
import { useTranslation } from 'react-i18next';
import { getMessages, deleteMessage, replyMessage } from "~/utils/api"; // API functions
import { useState } from "react";
import Button from "~/components/ui/Button"; // Assuming UI components

export async function loader({ request }) {
    try {
        // Add pagination params if needed: const url = new URL(request.url); ...
        const messagesData = await getMessages(); // Fetch messages
        const messages = Array.isArray(messagesData) ? messagesData : messagesData?.messages || [];
        return json({ messages });
    } catch (error: any) {
        console.error("Error loading messages:", error);
         if (error.response?.status === 401) {
             console.log("Loader: Caught 401, redirecting to login.");
             const url = new URL(request.url);
             return redirect(`/admin/login?redirectTo=${url.pathname}`);
         }
        return json({ messages: [], error: "Failed to load messages." });
    }
}

// Action for deleting or replying (example)
export async function action({ request }) {
    const formData = await request.formData();
    const intent = formData.get('intent');
    const messageId = formData.get('messageId');

    if (!messageId) {
        return json({ success: false, error: 'Message ID missing' }, { status: 400 });
    }

    try {
        if (intent === 'delete') {
            await deleteMessage(messageId);
            return json({ success: true, message: `Message ${messageId} deleted.` });
        } else if (intent === 'reply') {
            const replyContent = formData.get('replyContent');
            if (!replyContent) return json({ success: false, error: 'Reply content missing' }, { status: 400 });
            await replyMessage(messageId, { reply: replyContent });
             return json({ success: true, message: `Replied to message ${messageId}.` });
        }
        return json({ success: false, error: 'Invalid intent' }, { status: 400 });
    } catch (error: any) {
         console.error(`Action error (intent: ${intent}):`, error);
         if (error.response?.status === 401) {
             console.log("Action: Caught 401, redirecting to login.");
             const url = new URL(request.url);
             return redirect(`/admin/login?redirectTo=${url.pathname}`);
         }
         return json({ success: false, error: `Failed to ${intent} message.` }, { status: 500 });
    }
}


export default function AdminMessagesPage() {
  const { messages, error: loaderError } = useLoaderData<typeof loader>();
  const { t } = useTranslation(['admin', 'common']);
  const fetcher = useFetcher<typeof action>();
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const handleDelete = (id: number | string) => {
    if (confirm(t('admin:messages.confirmDelete', 'Are you sure you want to delete this message?'))) {
      fetcher.submit({ intent: 'delete', messageId: id.toString() }, { method: 'post' });
    }
  };

   const handleReplySubmit = (id: number | string) => {
       fetcher.submit(
           { intent: 'reply', messageId: id.toString(), replyContent: replyContent },
           { method: 'post' }
       );
       setReplyingTo(null); // Close reply form after submission
       setReplyContent('');
   };

   const formatDate = (dateString) => {
     // Simple date formatter
     try {
       return new Intl.DateTimeFormat('zh-CN', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(dateString));
     } catch { return dateString; }
   };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t('admin:messages.title', 'Manage Messages')}</h1>

       {loaderError && <p className="text-red-600 mb-4">{loaderError}</p>}
       {fetcher.data && !fetcher.data.success && <p className="text-red-600 mb-4">{fetcher.data.error}</p>}
       {fetcher.data && fetcher.data.success && <p className="text-green-600 mb-4">{fetcher.data.message}</p>}


      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin:messages.name')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin:messages.email')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin:messages.phone')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin:messages.content')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin:messages.received')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin:messages.status')}</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin:messages.actions')}</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {messages && messages.length > 0 ? messages.map((msg) => (
              <tr key={msg.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{msg.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{msg.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{msg.phone || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{msg.content}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(msg.created_at)}</td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {/* Display status based on msg.status or msg.reply */}
                    {msg.reply ? <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">{t('admin:messages.replied')}</span> : <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">{t('admin:messages.pending')}</span>}
                 </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                   <button onClick={() => setReplyingTo(replyingTo === msg.id ? null : msg.id)} className="text-blue-600 hover:text-blue-900">{replyingTo === msg.id ? t('common:buttons.cancel') : t('admin:messages.reply')}</button>
                   <button onClick={() => handleDelete(msg.id)} className="text-red-600 hover:text-red-900">{t('admin:messages.delete')}</button>
                </td>
              </tr>
               {/* Reply Form */}
                {replyingTo === msg.id && (
                    <tr>
                        <td colSpan={7} className="p-4 bg-gray-50">
                             <textarea
                                 value={replyContent}
                                 onChange={(e) => setReplyContent(e.target.value)}
                                 rows={3}
                                 className="w-full border border-gray-300 rounded-md p-2 mb-2"
                                 placeholder={t('admin:messages.replyPlaceholder')}
                             />
                             <Button onClick={() => handleReplySubmit(msg.id)} size="sm">
                                 {t('admin:messages.sendReply')}
                             </Button>
                        </td>
                    </tr>
                )}
            )) : (
              <tr><td colSpan={7} className="text-center py-4 text-gray-500">{t('admin:messages.noMessages')}</td></tr>
            )}
          </tbody>
        </table>
        {/* Add pagination controls if needed */}
      </div>
    </div>
  );
}