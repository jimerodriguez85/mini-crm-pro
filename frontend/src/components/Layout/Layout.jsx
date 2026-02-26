import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useSocket } from "../../context/SocketContext";
import { useNotification } from "../../context/NotificationContext";
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { socket } = useSocket();
  const { notify } = useNotification();
  const { user } = useAuth();

  useEffect(() => {
    if (!socket) return;

    const handler = (type) => (data) => {
      if (data.userName === user?.name) return;
      const messages = {
        "client:created": `${data.userName} creo un nuevo cliente`,
        "client:updated": `${data.userName} actualizo un cliente`,
        "client:deleted": `${data.userName} elimino un cliente`,
        "client:pipeline": `${data.userName} movio un cliente en el pipeline`,
        "file:uploaded": `${data.userName} subio un archivo`,
        "email:sent": `${data.userName} envio un email`,
      };
      if (messages[type]) notify(messages[type], "info");
    };

    const events = [
      "client:created", "client:updated", "client:deleted",
      "client:pipeline", "file:uploaded", "email:sent",
    ];

    events.forEach((e) => socket.on(e, handler(e)));
    return () => events.forEach((e) => socket.off(e, handler(e)));
  }, [socket, notify, user]);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar mobile */}
        <header className="lg:hidden bg-white border-b px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="font-bold text-gray-900">MINI-CRM</h1>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
