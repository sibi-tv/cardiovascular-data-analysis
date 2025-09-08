export default function ResultCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border rounded-lg p-5 shadow-sm">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <div>{children}</div>
    </div>
  );
}