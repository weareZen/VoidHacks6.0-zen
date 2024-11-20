"use client";
import React, { useEffect, useState, useRef } from "react";
import { Send } from "lucide-react";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ScrollArea } from "../components/ui/scroll-area";

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
      console.log("[ERROR] Connection failed:", err);
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
    <Card className="flex flex-col h-[85vh] w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Chat Room</CardTitle>
      </CardHeader>

      <CardContent className="flex-grow p-0">
        <ScrollArea className="h-[calc(85vh-8rem)] w-full px-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col mb-4 ${
                msg.isCurrentUser ? "items-end" : "items-start"
              }`}
            >
              <div className="text-xs mb-1 text-muted-foreground flex items-center gap-1">
                <span>{msg.sender}</span>
                <span>({msg.senderType})</span>
              </div>
              <div
                className={`
                  max-w-[80%]
                  px-4
                  py-2
                  rounded-lg
                  text-sm
                  ${
                    msg.isCurrentUser
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }
                `}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </ScrollArea>
      </CardContent>

      <CardFooter className="p-4">
        <div className="flex w-full items-center space-x-2">
          <Input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-grow"
          />
          <Button onClick={handleSendMessage} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default Chat;
