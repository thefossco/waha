import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import api from '../lib/api';

interface MessageItem {
  id: string;
  phone: string;
  status: string;
  errorMessage: string | null;
  deliveredAt: string | null;
  contact: {
    name: string;
  } | null;
}

interface Message {
  id: string;
  text: string;
  status: string;
  createdAt: string;
  sentAt: string | null;
  user: {
    name: string;
  };
  items: MessageItem[];
  stats: {
    total: number;
    pending: number;
    sent: number;
    delivered: number;
    failed: number;
    retrying: number;
  };
}

export default function MessageDetails() {
  const { id } = useParams<{ id: string }>();
  const [message, setMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessage();
  }, [id]);

  const fetchMessage = async () => {
    try {
      const response = await api.get(`/messages/${id}`);
      setMessage(response.data);
    } catch (error) {
      console.error('Failed to fetch message:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!message) {
    return <div className="text-center py-12">Message not found</div>;
  }

  return (
    <div className="px-4 py-6">
      <div className="mb-6">
        <Link to="/messages" className="text-indigo-600 hover:text-indigo-900">
          ← Back to Messages
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-6">Message Details</h1>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">Status</dt>
            <dd className="mt-1 text-sm text-gray-900">{message.status}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Created By</dt>
            <dd className="mt-1 text-sm text-gray-900">{message.user.name}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Created At</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {format(new Date(message.createdAt), 'MMM dd, yyyy HH:mm:ss')}
            </dd>
          </div>
          {message.sentAt && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Sent At</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {format(new Date(message.sentAt), 'MMM dd, yyyy HH:mm:ss')}
              </dd>
            </div>
          )}
          <div className="col-span-2">
            <dt className="text-sm font-medium text-gray-500">Message Text</dt>
            <dd className="mt-1 text-sm text-gray-900 bg-gray-50 p-4 rounded">
              {message.text}
            </dd>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="text-center">
            <dt className="text-sm font-medium text-gray-500">Total</dt>
            <dd className="mt-1 text-2xl font-semibold text-gray-900">
              {message.stats.total}
            </dd>
          </div>
          <div className="text-center">
            <dt className="text-sm font-medium text-gray-500">Pending</dt>
            <dd className="mt-1 text-2xl font-semibold text-gray-600">
              {message.stats.pending}
            </dd>
          </div>
          <div className="text-center">
            <dt className="text-sm font-medium text-gray-500">Sent</dt>
            <dd className="mt-1 text-2xl font-semibold text-blue-600">
              {message.stats.sent}
            </dd>
          </div>
          <div className="text-center">
            <dt className="text-sm font-medium text-gray-500">Delivered</dt>
            <dd className="mt-1 text-2xl font-semibold text-green-600">
              {message.stats.delivered}
            </dd>
          </div>
          <div className="text-center">
            <dt className="text-sm font-medium text-gray-500">Failed</dt>
            <dd className="mt-1 text-2xl font-semibold text-red-600">
              {message.stats.failed}
            </dd>
          </div>
          <div className="text-center">
            <dt className="text-sm font-medium text-gray-500">Retrying</dt>
            <dd className="mt-1 text-2xl font-semibold text-yellow-600">
              {message.stats.retrying}
            </dd>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recipients</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Delivered At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Error
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {message.items.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.contact?.name || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.status === 'DELIVERED'
                          ? 'bg-green-100 text-green-800'
                          : item.status === 'FAILED'
                          ? 'bg-red-100 text-red-800'
                          : item.status === 'SENT'
                          ? 'bg-blue-100 text-blue-800'
                          : item.status === 'RETRYING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.deliveredAt
                      ? format(new Date(item.deliveredAt), 'MMM dd, HH:mm')
                      : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-red-500">
                    {item.errorMessage || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
