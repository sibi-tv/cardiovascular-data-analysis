export default function ResultCard({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string; // 👈 allow extra styles
}) {
  return (
    <div className={`bg-white border rounded-lg p-5 shadow-sm ${className}`}>
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <div>{children}</div>
    </div>
  );
}