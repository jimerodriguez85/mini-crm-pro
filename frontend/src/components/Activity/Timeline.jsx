import { formatDate } from "../../utils/helpers";

const actionIcons = {
  created: { icon: "+", bg: "bg-green-100 text-green-600" },
  updated: { icon: "E", bg: "bg-blue-100 text-blue-600" },
  deleted: { icon: "X", bg: "bg-red-100 text-red-600" },
  pipeline_changed: { icon: "P", bg: "bg-purple-100 text-purple-600" },
  email_sent: { icon: "@", bg: "bg-yellow-100 text-yellow-600" },
  file_uploaded: { icon: "F", bg: "bg-cyan-100 text-cyan-600" },
  reminder_created: { icon: "R", bg: "bg-orange-100 text-orange-600" },
};

export default function Timeline({ activities }) {
  if (activities.length === 0) {
    return <p className="text-gray-400 text-sm text-center py-6">Sin actividad registrada</p>;
  }

  return (
    <div className="space-y-3">
      {activities.map((a) => {
        const style = actionIcons[a.action] || actionIcons.updated;
        return (
          <div key={a.id} className="flex items-start gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${style.bg}`}>
              {style.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-700">{a.details}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {a.user?.name} — {formatDate(a.createdAt)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
