// app/routes/admin/messages/index.tsx
import { json, useLoaderData, useFetcher, redirect } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import { getMessages, deleteMessage, replyMessage } from "~/utils/api";
import { useState } from "react";
import Button from "~/components/ui/Button";
import type { LoaderFunctionArgs, ActionFunctionArgs } from '@remix-run/react';

interface Message {
  id: string;
  content: string;
  createdAt: string;
  // Add other message properties as needed
}

interface LoaderData {
  messages: Message[];
  error?: string;
}

export async function loader({ request }: LoaderFunctionArgs) {
    try {
        const messagesData = await getMessages();
        const messages = Array.isArray(messagesData) ? messagesData : messagesData?.messages || [];
        return json<LoaderData>({ messages });
    } catch (error: any) {
        console.error("Error loading messages:", error);
        if (error.response?.status === 401) {
            console.log("Loader: Caught 401, redirecting to login.");
            const url = new URL(request.url);
            return redirect(`/admin/login?redirectTo=${url.pathname}`);
        }
        return json<LoaderData>({ messages: [], error: "Failed to load messages." });
    }
}

export async function action({ request }: ActionFunctionArgs) {
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

export default function AdminMessages() {
    const data = useLoaderData<LoaderData>();
    const { t } = useTranslation();
    const fetcher = useFetcher();
    const [replyingTo, setReplyingTo] = useState<string | null>(null);

    const messages = data.messages;

    return (
        <div className="admin-messages p-6">
            <h1 className="text-2xl font-bold mb-6">{t('messages.title', 'Messages')}</h1>
            {data.error && (
                <div className="text-red-600 mb-4">{data.error}</div>
            )}
            <div className="messages-list space-y-4">
                {messages.length === 0 ? (
                    <p className="text-gray-500">{t('messages.noMessages', 'No messages found.')}</p>
                ) : (
                    messages.map((message: Message) => (
                        <div key={message.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-gray-700">{message.content}</p>
                                    <p className="text-sm text-gray-500 mt-2">
                                        {new Date(message.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => setReplyingTo(message.id)}
                                        variant="secondary"
                                        aria-label={t('messages.reply', 'Reply')}
                                    >
                                        {t('messages.reply', 'Reply')}
                                    </Button>
                                    <fetcher.Form method="post">
                                        <input type="hidden" name="messageId" value={message.id} />
                                        <input type="hidden" name="intent" value="delete" />
                                        <Button
                                            type="submit"
                                            variant="danger"
                                            aria-label={t('messages.delete', 'Delete')}
                                        >
                                            {t('messages.delete', 'Delete')}
                                        </Button>
                                    </fetcher.Form>
                                </div>
                            </div>
                            {replyingTo === message.id && (
                                <fetcher.Form method="post" className="mt-4">
                                    <input type="hidden" name="messageId" value={message.id} />
                                    <input type="hidden" name="intent" value="reply" />
                                    <label htmlFor={`reply-${message.id}`} className="sr-only">
                                        {t('messages.replyContent', 'Reply content')}
                                    </label>
                                    <textarea
                                        id={`reply-${message.id}`}
                                        name="replyContent"
                                        className="w-full p-2 border rounded"
                                        rows={3}
                                        required
                                        aria-label={t('messages.replyContent', 'Reply content')}
                                        placeholder={t('messages.replyPlaceholder', 'Type your reply here...')}
                                    />
                                    <div className="flex gap-2 mt-2">
                                        <Button type="submit" aria-label={t('messages.sendReply', 'Send Reply')}>
                                            {t('messages.sendReply', 'Send Reply')}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            onClick={() => setReplyingTo(null)}
                                            aria-label={t('messages.cancel', 'Cancel')}
                                        >
                                            {t('messages.cancel', 'Cancel')}
                                        </Button>
                                    </div>
                                </fetcher.Form>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}