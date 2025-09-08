import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  color?: "blue" | "green" | "indigo" | "yellow" | "red";
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  color = "blue",
}: StatCardProps) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 border-blue-200 text-blue-600",
    green: "bg-green-50 border-green-200 text-green-600",
    indigo: "bg-indigo-50 border-indigo-200 text-indigo-600",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-600",
    red: "bg-red-50 border-red-200 text-red-600",
  };

  return (
    <div
      className={`rounded-lg border px-6 py-4 text-center shadow-sm hover:shadow-md transition ${colors[color]}`}
    >
      {icon && <div className="flex justify-center mb-2">{icon}</div>}
      <p className="text-lg font-medium text-gray-700">{title}</p>
      <p className="text-4xl font-extrabold mt-1">{value}</p>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
}