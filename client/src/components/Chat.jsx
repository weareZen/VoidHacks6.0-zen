"use client";
import React, { useEffect, useState, useRef } from "react";
import { Send } from "lucide-react";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext";

const socket = io("http://localhost:5000", {
  transports: ["websocket"],
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  withCredentials: true,
});

const Chat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("[INFO] Socket connected successfully");
      setCurrentUserId(socket.id);
    });

    // Updated to handle user information in received messages
    socket.on("receiveMessage", (data) => {
      console.log("[INFO] Received message:", data);

      if (data.senderId !== currentUserId) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: Date.now(),
            text: data.message,
            sender: data.senderName || "Unknown",
            senderType: data.userType || "unknown",
            senderId: data.senderId,
          },
        ]);
      }
    });

    socket.on("connect_error", (err) => {
      console.error("[ERROR] Connection failed:", err);
      setTimeout(() => socket.connect(), 1000);
    });

    socket.on("reconnect", (attemptNumber) => {
      console.log(`[INFO] Reconnected after ${attemptNumber} attempts`);
    });

    return () => {
      socket.off("connect");
      socket.off("receiveMessage");
      socket.off("connect_error");
      socket.off("reconnect");
    };
  }, [currentUserId]);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      console.log("[INFO] Sending message:", inputMessage);

      // Include user information in the message
      socket.emit("sendMessage", {
        message: inputMessage,
        senderId: currentUserId,
        senderName: `${user.firstName} ${user.lastName}`,
        userType: user.userType,
      });

      // Add message to local state with user info
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: Date.now(),
          text: inputMessage,
          sender: `${user.firstName} ${user.lastName}`,
          senderType: user.userType,
          senderId: currentUserId,
          isCurrentUser: true,
        },
      ]);

      setInputMessage("");
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-50 border border-gray-200 overflow-hidden">
      <div className="bg-gray-100 text-gray-700 p-2 text-center font-semibold text-sm">
        Chat Room
      </div>

      <div className="flex-grow h-[70vh] overflow-y-auto p-2 space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.isCurrentUser ? "items-end" : "items-start"
            }`}
          >
            <div className="text-xs mb-0.5 text-gray-600 flex items-center gap-1">
              <span>{msg.sender}</span>
              <span className="text-xs text-gray-500">({msg.senderType})</span>
            </div>
            <div
              className={`
                max-w-[80%]
                px-3
                py-2
                rounded-lg
                text-sm
                break-words
                whitespace-normal
                ${
                  msg.isCurrentUser
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                }
              `}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 bg-gray-100 flex items-center space-x-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Type your message..."
          className="
            flex-grow
            bg-white
            text-gray-800
            px-3
            py-2
            rounded-lg
            text-sm
            border
            border-gray-300
            outline-none
            focus:border-blue-500
            transition-colors
          "
        />
        <button
          onClick={handleSendMessage}
          className="
            bg-blue-500
            text-white
            p-2
            rounded-lg
            hover:bg-blue-600
            transition-colors
          "
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default Chat;
