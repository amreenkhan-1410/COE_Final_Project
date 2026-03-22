import { TrendingUp, Package, FileText, Users } from 'lucide-react';

const StatsCard = ({ title, value, icon: Icon, color }) => {
  return (
    <div className="bg-card p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;