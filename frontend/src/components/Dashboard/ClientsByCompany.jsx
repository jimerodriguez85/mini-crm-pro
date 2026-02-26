import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#2563eb", "#16a34a", "#eab308", "#ef4444", "#8b5cf6", "#f97316", "#06b6d4", "#ec4899"];

export default function ClientsByCompany({ data }) {
  return (
    <div className="card p-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Clientes por Empresa</h3>
      {data.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-8">Sin datos aun</p>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="company"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ company }) => company}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
