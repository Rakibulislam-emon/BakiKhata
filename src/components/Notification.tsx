import React from "react";

interface NotificationProps {
  type: "success" | "error";
  message: string;
}

export const Notification = ({ type, message }: NotificationProps) => {
  return (
    <div
      className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      } text-white`}
    >
      {message}
    </div>
  );
};
