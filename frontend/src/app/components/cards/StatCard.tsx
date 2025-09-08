export default function StatCard({
  title,
  value,
  subtitle,
  badge,
}: {
  title: string;
  value: React.ReactNode;
  subtitle?: string;
  badge?: React.ReactNode;
}) {
  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm text-slate-500">{title}</div>
          <div className="text-2xl font-extrabold mt-1">{value}</div>
          {subtitle && <div className="text-xs text-slate-400 mt-1">{subtitle}</div>}
        </div>
        {badge && <div>{badge}</div>}
      </div>
    </div>
  );
}