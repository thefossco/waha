import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';

interface Contact {
  id: string;
  name: string;
  phone: string;
}

interface Group {
  id: string;
  name: string;
}

interface Template {
  id: string;
  name: string;
  text: string;
}

export default function SendMessage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [sending, setSending] = useState(false);
  const { register, handleSubmit, setValue, watch } = useForm();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [contactsRes, groupsRes, templatesRes] = await Promise.all([
        api.get('/contacts?limit=1000'),
        api.get('/groups'),
        api.get('/templates'),
      ]);
      setContacts(contactsRes.data.contacts);
      setGroups(groupsRes.data);
      setTemplates(templatesRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const onTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      setValue('text', template.text);
    }
  };

  const onSubmit = async (data: any) => {
    setSending(true);

    try {
      const payload: any = {
        text: data.text,
        recipients: [],
      };

      if (data.phone) {
        payload.recipients.push({ phone: data.phone });
      }

      if (data.contactIds) {
        const contactIds = Array.isArray(data.contactIds)
          ? data.contactIds
          : [data.contactIds];
        contactIds.forEach((id: string) => {
          payload.recipients.push({ contactId: id });
        });
      }

      if (data.groupIds) {
        payload.groupIds = Array.isArray(data.groupIds)
          ? data.groupIds
          : [data.groupIds];
      }

      if (selectedTemplate) {
        payload.templateId = selectedTemplate;
      }

      const response = await api.post('/messages', payload);
      alert(`Message queued successfully! ${response.data.recipientCount} recipients.`);
      navigate('/messages');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Send Message</h1>

      <div className="bg-white shadow rounded-lg p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Template (Optional)
            </label>
            <select
              value={selectedTemplate}
              onChange={(e) => onTemplateSelect(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
            >
              <option value="">-- Select Template --</option>
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message Text *
            </label>
            <textarea
              {...register('text', { required: true })}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
              placeholder="Enter your message..."
            />
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recipients</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Single Phone Number
                </label>
                <input
                  {...register('phone')}
                  type="tel"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                  placeholder="+1234567890"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Contacts
                </label>
                <select
                  {...register('contactIds')}
                  multiple
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                  size={5}
                >
                  {contacts.map((contact) => (
                    <option key={contact.id} value={contact.id}>
                      {contact.name} ({contact.phone})
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-sm text-gray-500">Hold Ctrl/Cmd to select multiple</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Groups
                </label>
                <select
                  {...register('groupIds')}
                  multiple
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                  size={3}
                >
                  {groups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-sm text-gray-500">Hold Ctrl/Cmd to select multiple</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate('/messages')}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={sending}
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {sending ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
