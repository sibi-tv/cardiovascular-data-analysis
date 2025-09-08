"use client";

import { ReactNode } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  LabelList,
  Cell,
} from "recharts";

interface ChartCardProps {
  title: string;
  data: { [key: string]: string | number }[];
  dataKey: string;
  xKey: string;
  colors?: string[];
  height?: number;
  subtitle?: string;
  icon?: ReactNode;
}

export default function ChartCard({
  title,
  data,
  dataKey,
  xKey,
  colors = ["#2563eb", "#ef4444", "#16a34a", "#f59e0b"],
  height = 320,
  subtitle,
  icon,
}: ChartCardProps) {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <p className="text-gray-500 mt-2">No data available</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        {icon && <div className="text-blue-600">{icon}</div>}
        <div>
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
      </div>

      <div style={{ width: "100%", height }}>
        <ResponsiveContainer>
          <BarChart
            data={data}
            margin={{ top: 30, right: 30, left: 10, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey={xKey}
              tick={{ fontSize: 14, fill: "#374151" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 14, fill: "#374151" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "0.5rem",
                borderColor: "#e5e7eb",
              }}
              labelStyle={{ fontWeight: "600" }}
              formatter={(val: number) => [`${val} mmHg`, "Avg Systolic BP"]}
            />
            <Bar dataKey={dataKey} barSize={60} radius={[8, 8, 0, 0]}>
              <LabelList
                dataKey={dataKey}
                position="top"
                style={{ fill: "#111827", fontWeight: 600, fontSize: 13 }}
                formatter={(val: number) => `${val}`}
              />
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}