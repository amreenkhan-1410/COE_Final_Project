import { useEffect, useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart3, TrendingUp } from 'lucide-react';
import api from '../services/api';

const Insights = () => {
  const [rules, setRules] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/analytics/').then(response => {
      setRules(response.data.rules || []);
      setError('');
    }).catch(() => {
      setError('Unable to load association rules from the backend.');
    });
  }, []);

  return (
    <div className="container mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary mb-2">Association Rules Insights</h1>
        <p className="text-gray-600">Visualize the relationships between products discovered by our AI</p>
      </div>
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="bg-card p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <BarChart3 className="mr-2 text-primary" />
          Rules Scatter Plot
        </h2>
        <p className="text-gray-600 mb-4">
          Each point represents an association rule. Hover for details.
        </p>
        <ResponsiveContainer width="100%" height={500}>
          <ScatterChart data={rules}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="support" name="Support" unit="%" />
            <YAxis dataKey="confidence" name="Confidence" unit="%" />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              formatter={(value, name) => [Number(value).toFixed(2), name]}
              labelFormatter={(_, payload) => {
                const rule = payload?.[0]?.payload;
                if (!rule) {
                  return 'Association Rule';
                }
                return `${rule.antecedents_label} -> ${rule.consequents_label}`;
              }}
            />
            <Scatter name="Association Rules" dataKey="lift" fill="#4CAF50" />
          </ScatterChart>
        </ResponsiveContainer>
        {rules.length === 0 && !error && (
          <div className="mt-4 rounded-lg border border-dashed border-gray-300 p-4 text-sm text-gray-500">
            No association rules were generated for the current dataset yet.
          </div>
        )}
        <div className="mt-4 p-4 bg-leaf bg-opacity-10 rounded-lg">
          <h3 className="font-semibold text-primary mb-2 flex items-center">
            <TrendingUp className="mr-2" />
            Understanding the Chart
          </h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li><strong>Support:</strong> How frequently the itemset appears in transactions</li>
            <li><strong>Confidence:</strong> How often the rule is true</li>
            <li><strong>Lift:</strong> How much more likely the consequent is given the antecedent</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Insights;
