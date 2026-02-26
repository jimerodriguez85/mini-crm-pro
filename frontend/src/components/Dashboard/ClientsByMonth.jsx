import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function ClientsByMonth({ data }) {
  return (
    <div className="card p-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Clientes por Mes</h3>
      {data.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-8">Sin datos aun</p>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} name="Clientes" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
