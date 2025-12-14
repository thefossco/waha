import { useEffect, useState } from 'react';
import api from '../lib/api';

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/messages/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-1">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Messages
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {stats?.totalMessages || 0}
                </dd>
              </div>
            </div>
          </div>
        </div>

        {stats?.messagesByStatus?.map((item: any) => (
          <div key={item.status} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {item.status}
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    {item._count}
                  </dd>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Message Items Status</h2>
        <div className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {stats?.itemsByStatus?.map((item: any) => (
              <div key={item.status} className="text-center">
                <dt className="text-sm font-medium text-gray-500">{item.status}</dt>
                <dd className="mt-1 text-2xl font-semibold text-gray-900">
                  {item._count}
                </dd>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
