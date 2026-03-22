import { useEffect, useState } from 'react';
import StatsCard from './StatsCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Package, FileText, Users } from 'lucide-react';
import api from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({ totalProducts: 0, totalTransactions: 0, associationRules: 0 });
  const [chartData, setChartData] = useState([]);
  const [datasetName, setDatasetName] = useState('');
  const [trainedAt, setTrainedAt] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/analytics/').then(response => {
      setStats({
        totalProducts: response.data.total_products,
        totalTransactions: response.data.total_transactions,
        associationRules: response.data.association_rules,
      });
      setChartData(response.data.top_products || []);
      setDatasetName(response.data.dataset_name || '');
      setTrainedAt(response.data.trained_at || '');
      setError('');
    }).catch(() => {
      setError('Unable to load analytics from the backend.');
    });
  }, []);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-2">Market Basket Analysis Dashboard</h1>
        <p className="text-gray-600">AI-powered grocery recommendation insights</p>
        {datasetName && (
          <p className="mt-2 text-sm text-gray-500">
            Dataset: {datasetName} {trainedAt ? `| Trained at ${new Date(trainedAt).toLocaleString()}` : ''}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard title="Total Products" value={stats.totalProducts} icon={Package} color="bg-primary" />
        <StatsCard title="Total Transactions" value={stats.totalTransactions} icon={Users} color="bg-leaf" />
        <StatsCard title="Association Rules" value={stats.associationRules} icon={FileText} color="bg-basket" />
      </div>
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="bg-card p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <TrendingUp className="mr-2 text-primary" />
          Product Frequency Analysis
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="frequency" fill="#4CAF50" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
