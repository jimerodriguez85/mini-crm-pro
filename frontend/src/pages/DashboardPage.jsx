import { useState, useEffect } from "react";
import { fetchStats } from "../services/dashboardService";
import { fetchActivities } from "../services/activityService";
import StatsCards from "../components/Dashboard/StatsCards";
import ClientsByMonth from "../components/Dashboard/ClientsByMonth";
import ClientsByCompany from "../components/Dashboard/ClientsByCompany";
import Timeline from "../components/Activity/Timeline";
import Spinner from "../components/UI/Spinner";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchStats(), fetchActivities(20)])
      .then(([s, a]) => {
        setStats(s);
        setActivities(a);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      <StatsCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ClientsByMonth data={stats?.monthlyData || []} />
        <ClientsByCompany data={stats?.byCompany || []} />
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h2>
        <Timeline activities={activities} />
      </div>
    </div>
  );
}
