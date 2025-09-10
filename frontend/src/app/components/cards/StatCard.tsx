import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  color: 'emerald' | 'amber' | 'red' | 'blue' | 'purple';
  icon?: React.ReactNode;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  color, 
  icon, 
  className = "" 
}) => {
  const colorClasses = {
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-900",
    amber: "bg-amber-50 border-amber-200 text-amber-900",
    red: "bg-red-50 border-red-200 text-red-900",
    blue: "bg-blue-50 border-blue-200 text-blue-900",
    purple: "bg-purple-50 border-purple-200 text-purple-900"
  };

  const iconColorClasses = {
    emerald: "text-emerald-600 bg-emerald-100",
    amber: "text-amber-600 bg-amber-100", 
    red: "text-red-600 bg-red-100",
    blue: "text-blue-600 bg-blue-100",
    purple: "text-purple-600 bg-purple-100"
  };

  return (
    <div className={`${colorClasses[color]} border-2 rounded-2xl p-6 ${className} transition-all duration-200 hover:shadow-lg hover:-translate-y-1`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold opacity-80 mb-2">{title}</p>
          <p className="text-3xl font-bold mb-1">{value}</p>
          <p className="text-sm opacity-75">{subtitle}</p>
        </div>
        <div className={`${iconColorClasses[color]} p-3 rounded-xl`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;