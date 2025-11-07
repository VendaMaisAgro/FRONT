export function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-xl bg-green-600 p-5 text-white">
      <div className="text-base/6 opacity-90">{title}</div>
      <div className="mt-1 text-3xl font-semibold">{value}</div>
    </div>
  );
}


