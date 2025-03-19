import React, { useEffect, useState } from "react";
import {
  FaEnvelope,
  FaCalendarAlt,
  FaTimes,
  FaCheck,
  FaSearch,
  FaCog,
} from "react-icons/fa";

const notifications = [
  {
    id: 1,
    type: "email",
    icon: <FaEnvelope className="text-blue-500" />,
    title: "New Email from John",
    message: "Hey! Check out the latest updates...",
    timestamp: "2 minutes ago",
    read: false,
  },
  {
    id: 2,
    type: "calendar",
    icon: <FaCalendarAlt className="text-green-500" />,
    title: "Meeting Reminder",
    message: "Your meeting with the team starts at 3 PM.",
    timestamp: "Yesterday at 10:30 AM",
    read: true,
  },
];

const NotificationItem = ({
  notification,
  onMarkRead,
  onDismiss,
  onSelect,
}) => {
  return (
    <div
      className={`p-4 border-b flex items-start gap-3 ${
        notification.read ? "opacity-70" : "font-bold"
      }`}
      onClick={() => onSelect(notification)}
    >
      {notification.icon}
      <div className="flex-1">
        <h4>{notification.title}</h4>
        <p className="text-sm text-zinc-600 dark:text-gray-300 ">{notification.message}</p>
        <span className="text-xs text-gray-400">{notification.timestamp}</span>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onMarkRead(notification.id);
        }}
        className="text-green-500"
      >
        <FaCheck />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDismiss(notification.id);
        }}
        className="text-red-500"
      >
        <FaTimes />
      </button>
    </div>
  );
};

const NotificationPage = () => {
  const [notificationList, setNotificationList] = useState(notifications);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [messageOpen, setMessageOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    notificationSound: true,
  });
  

  useEffect(() => {
    const savedSettings = JSON.parse(
      localStorage.getItem("notificationSettings")
    );
    if (savedSettings) {
      setSettings(savedSettings);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("notificationSettings", JSON.stringify(settings));
  }, [settings]);

  const markAsRead = (id) => {
    setNotificationList(
      notificationList.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const dismissNotification = (id) => {
    setNotificationList(notificationList.filter((n) => n.id !== id));
  };

  const handleSettingChange = (setting) => {
    setSettings({ ...settings, [setting]: !settings[setting] });
  };

  return (
    <div className="min-h-screen w-full dark:bg-[#1a1a1a] dark:text-white p-6 flex">
      <div className="w-full">
        <header className="flex justify-between items-center border-b pb-4 mb-4">
          <div className="w-full max-lg:text-center">
            <h1 className="text-2xl font-bold w-full ">Notifications</h1>
          </div>
          <FaCog
            className="text-xl cursor-pointer mx-4 col-start-6"
            onClick={() => setSettingsOpen(!settingsOpen)}
          />
        </header>
        <div className="p-2 w-full flex items-center justify-center my-5">
          <div className="flex items-center gap-6">
            <input
              type="text"
              placeholder="Search..."
              className="px-4 py-2 rounded-lg outline-none bg-transparent border-2 border-zinc-500 w-full max-w-xs md:max-w-sm lg:max-w-md"
            />
            <FaSearch size={25} className="cursor-pointer" />
          </div>
        </div>

        <div className="dark:bg-zinc-800 rounded-md overflow-y-hidden shadow-lg flex flex-col">
          {notificationList.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkRead={markAsRead}
              onDismiss={dismissNotification}
              onSelect={(notification) => {
                setSelectedNotification(notification);
                setMessageOpen(true);
              }}
            />
          ))}
        </div>
      </div>

      <div
        className={`md:max-w-96 h-full max-md:fixed md:z-50 max-md:top-0 max-md:left-0 w-full 
         dark:bg-zinc-700 bg-white md:ml-6 md:p-4 rounded-lg shadow-lg ${
           messageOpen ? "" : "max-md:hidden"
         }`}
      >
        <div
          className="py-4 px-6 w-full dark:bg-zinc-900 bg-black/10 flex justify-between md:hidden"
          onClick={() => setMessageOpen(false)}
        >
          <p className="text-xl cursor-pointer">&lt;--</p>
          <p>{selectedNotification?.title}</p>
        </div>
        {selectedNotification ? (
          <div className="max-md:p-4">
            <h2 className="text-xl font-bold mb-2">
              {selectedNotification.title}
            </h2>
            <p className="text-zinc-600 dark:text-gray-300 ">{selectedNotification.message}</p>
            <span className="text-xs text-gray-400">
              {selectedNotification.timestamp}
            </span>
          </div>
        ) : (
          <p className="text-zinc-600 dark:text-gray-300 ">Select a notification to view details</p>
        )}
      </div>

      <div
        className={`fixed right-0 top-0 h-full w-full max-w-96 z-50 bg-white dark:bg-zinc-800 md:p-6 shadow-lg transform transition-transform ${
          settingsOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <h2 className="text-xl font-bold mb-4 max-md:hidden">Settings</h2>
        <div className="md:hidden py-3 px-6 w-full border-b border-zinc-900 flex justify-between">
          <p
            className="text-xl cursor-pointer"
            onClick={() => setSettingsOpen(!settingsOpen)}
          >
            &lt;--
          </p>
          <h2 className="text-xl font-bold">Settings</h2>
        </div>
        <div className="flex flex-col gap-4 max-md:p-6">
          {Object.keys(settings).map((key) => (
            <div key={key} className="flex items-center justify-between">
              <span className="capitalize">
                {key.replace(/([A-Z])/g, " $1")}
              </span>
              <button
                className={`px-4 py-2 rounded ${
                  settings[key] ? "bg-green-500" : "bg-red-500"
                }`}
                onClick={() => handleSettingChange(key)}
              >
                {settings[key] ? "ON" : "OFF"}
              </button>
            </div>
          ))}
          <button
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
            onClick={() => setSettingsOpen(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
