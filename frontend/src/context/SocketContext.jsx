import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (!user) return;

    const s = io("http://localhost:3001", {
      transports: ["websocket"],
    });

    s.on("connect", () => {
      s.emit("join", user.id);
    });

    const eventTypes = [
      "client:created",
      "client:updated",
      "client:deleted",
      "client:pipeline",
      "file:uploaded",
      "email:sent",
    ];

    eventTypes.forEach((type) => {
      s.on(type, (data) => {
        setEvents((prev) => [{ type, data, time: new Date() }, ...prev].slice(0, 50));
      });
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, [user]);

  function onEvent(type, callback) {
    if (socket) {
      socket.on(type, callback);
      return () => socket.off(type, callback);
    }
  }

  return (
    <SocketContext.Provider value={{ socket, events, onEvent }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
