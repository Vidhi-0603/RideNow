import React, { createContext, useEffect, useMemo } from "react";
import { io } from "socket.io-client";

export const SocketDataContext = createContext();

const SocketProvider = ({ children }) => {

  const socket = useMemo(() => {
    return io(import.meta.env.VITE_BASE_URL, {
      transports: ["websocket"], // force websocket
      reconnection: true, // auto-reconnect
      reconnectionAttempts: 10, // retry attempts
      reconnectionDelay: 1000, // delay between retries
    });
  }, []); 

  useEffect(() => {
    // Basic connection logic
    socket.on("connect", () => {
      console.log("Connected to server","frontend");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server frontend");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, [socket]);

  return (
    <SocketDataContext.Provider value={{ socket }}>
      {children}
    </SocketDataContext.Provider>
  );
};

export default SocketProvider;