import React, { useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";
import { useNotification } from "../../store/notificationContext";
import moment from "moment";
import { axiosInstance } from "../../lib/axios";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import {
  FaSearch,
  FaFilter,
  FaTimes,
  FaCheck,
  FaCalendarAlt,
  FaHandshake,
  FaUsers,
  FaBell,
  FaEnvelope,
} from "react-icons/fa";
import { debounce } from "lodash";
import "react-datepicker/dist/react-datepicker.css";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import toast from "react-hot-toast";

const NotificationIcon = ({ type }) => {
  const iconMap = {
    eventInvite: <FaCalendarAlt className="text-blue-500 text-xl" />,
    vendorCollabInvite: <FaHandshake className="text-green-500 text-xl" />,
    eventCollabInvite: <FaUsers className="text-purple-500 text-xl" />,
    WelcomeMessage: <FaBell className="text-yellow-500 text-xl" />,
  };
  return iconMap[type] || <FaEnvelope className="text-zinc-500 text-xl" />;
};

const makeFirstLetterCapital = (Word) => {
  return Word.charAt(0).toUpperCase() + Word.slice(1);
};

const NotificationItem = ({
  notification,
  onMarkRead,
  onDismiss,
  isMobile,
}) => {
  const [swiped, setSwiped] = useState(false);
  const navigate = useNavigate();

  const handlers = useSwipeable({
    onSwipedLeft: () => isMobile && handleSwipe("Left"),
    onSwipedRight: () => isMobile && handleSwipe("Right"),
    trackMouse: true,
  });

  const handleSwipe = (dir) => {
    if (dir === "Right") onMarkRead(notification._id);
    if (dir === "Left") onDismiss(notification._id);
    setSwiped(true);
    setTimeout(() => setSwiped(false), 500);
  };

  const handleRespond = async (response) => {
    try {
      await axiosInstance.patch(
        `${notification.respondLink}/?response=${response}`
      );
      // Update notification status after response
      if (response) {
        onMarkRead(notification._id);
        // if (notification.event) {
        //   navigate(`/events/${notification.event}`);
        // }
      } else {
        onDismiss(notification._id);
      }
    } catch (error) {
      console.error("Error responding to invitation:", error);
      toast.error("Failed to process your response");
    }
  };

  return (
    <div
      {...handlers}
      className={`p-4 bg-white dark:bg-zinc-800 ${swiped ? "opacity-50" : ""} ${
        !notification.seen ? "bg-blue-50 dark:bg-zinc-700" : ""
      } ${
        !isMobile ? "hover:bg-zinc-50 dark:hover:bg-zinc-700" : ""
      } transition-colors flex sm:items-center justify-between max-sm:flex-col gap-2`}
    >
      <div className="flex items-center gap-4 flex-1">
        <NotificationIcon type={notification.type} />
        <div className="flex-1">
          {/* Sender Details */}
          {notification.type !== "WelcomeMessage" && (
            <div div className="flex items-center gap-2 mb-2">
              <img
                src={
                  notification.sender?.profilePicture || "/default-avatar.png"
                }
                alt={notification.sender?.fullName}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-sm">
                  {notification.sender?.fullName}
                </p>
                <p className="text-xs text-zinc-500">
                  @{notification.sender?.userName}
                </p>
              </div>
            </div>
          )}

          <h4 className="font-semibold text-sm md:text-base">
            {makeFirstLetterCapital(notification.type)}
          </h4>
          <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-300">
            {notification.message}
          </p>
          <span className="text-xs text-zinc-400">
            {moment(notification.createdAt).fromNow()}
          </span>
        </div>
      </div>

      {!["WelcomeMessage", "Message"].includes(notification.type) &&
        (notification.seen === false ? (
          <div
            className={`flex gap-2 ${
              notification.seen ? "opacity-0" : "opacity-100"
            } 
          transition-opacity mx-2 max-sm:w-full`}
          >
            <button
              onClick={() => handleRespond(true)}
              className="text-green-500 hover:text-green-700 flex items-center 
              justify-center gap-2 px-3 py-2 border rounded-md w-full
              hover:bg-green-50 dark:hover:bg-green-900/20"
            >
              <FaCheck className="shrink-0" />
              <span>Accept</span>
            </button>
            <button
              onClick={() => handleRespond(false)}
              className="text-red-500 hover:text-red-700 flex items-center 
              justify-center gap-2 px-3 py-2 border rounded-md w-full
              hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <FaTimes className="shrink-0" />
              <span>Decline</span>
            </button>
          </div>
        ) : (
          <div
            className={`flex gap-2 transition-opacity mx-2 max-sm:hidden ${
              notification.seen ? "opacity-100" : "opacity-0"
            } `}
          >
            <div
              className="text-green-500 hover:text-green-700 flex items-center 
            justify-center gap-2 px-3 py-2 "
            >
              <span>Accepted</span>
            </div>
          </div>
        ))}
    </div>
  );
};

const Filtering = ({ notificationFilters, filters, handleFilterChange }) => {
  const [localDateRange, setLocalDateRange] = useState({
    start: null,
    end: null,
  });

  const filterObj = notificationFilters?.data || {};
  const keys = Object.keys(filterObj).filter(
    (key) => typeof filterObj === "object" && !Array.isArray(filterObj)
  );

  const renderSenderOptions = (senders) => (
    <select
      value={filters.sender || ""}
      onChange={(e) => handleFilterChange("sender", e.target.value)}
      className="w-full p-2 rounded border dark:bg-zinc-700"
    >
      <option value="">All Senders</option>
      {senders?.map((item) => (
        <option key={item._id} value={item._id}>
          {item.userName}
        </option>
      ))}
    </select>
  );

  return (
    <>
      {keys.map((key) => (
        <div key={key} className="mb-4">
          <h3 className="font-medium mb-2 capitalize">
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </h3>

          {key === "date" ? (
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={localDateRange.start?.toISOString().split("T")[0] || ""}
                onChange={(e) =>
                  handleFilterChange("startDate", e.target.value)
                }
                className="p-2 rounded border dark:bg-zinc-700"
              />
              <input
                type="date"
                value={localDateRange.end?.toISOString().split("T")[0] || ""}
                onChange={(e) => handleFilterChange("endDate", e.target.value)}
                className="p-2 rounded border dark:bg-zinc-700"
              />
            </div>
          ) : key === "sender" ? (
            renderSenderOptions(filterObj[key])
          ) : (
            <select
              value={filters[key] || ""}
              onChange={(e) => handleFilterChange(key, e.target.value)}
              className="w-full p-2 rounded border dark:bg-zinc-700"
            >
              <option value="">All</option>
              {filterObj[key]?.map((item) => (
                <option key={item.value} value={item.value}>
                  {makeFirstLetterCapital(item.label)}
                </option>
              ))}
            </select>
          )}
        </div>
      ))}
    </>
  );
};

const NotificationPage = () => {
  const isDesktop = useMediaQuery({ minWidth: 768 });
  const {
    notifications,
    filters,
    notificationFilters,
    setFilters,
    getNotification,
  } = useNotification();

  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getNotification();
  }, [filters]);

  const handleSearch = debounce((query) => {
    setFilters({ search: query });
  }, 300);

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const clearFilter = (filterType) => {
    setFilters({
      ...prev,
      [filterType]: null,
    });
  };

  const FilterChips = () => {
    // Get filter options from context/data
    const filterData = notificationFilters?.data || {};

    // Find selected filter labels
    const getFilterLabel = (filterType, value) => {
      switch (filterType) {
        case "type":
          return (
            filterData.type?.find((t) => t.value === value)?.label || value
          );
        case "sender":
          return (
            filterData.sender?.find((s) => s._id === value)?.userName || value
          );
        case "date":
          return (
            filterData.date?.find((d) => d.value === value)?.label || value
          );
        case "seen":
          return value ? "Read" : "Unread";
        default:
          return value;
      }
    };

    return (
      <div className="flex flex-wrap gap-2 p-2">
        {Object.entries(filters).map(([filterType, value]) => {
          if (
            !value ||
            filterType === "search" ||
            filterType === "page" ||
            filterType === "limit"
          )
            return null;

          return (
            <div
              key={filterType}
              className="bg-blue-100 dark:bg-zinc-700 px-2 py-1 rounded-full text-sm flex items-center gap-1"
            >
              <span>
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}:{" "}
                {getFilterLabel(filterType, value)}
              </span>
              <button
                onClick={() => clearFilter(filterType)}
                className="text-zinc-500 hover:text-zinc-700"
              >
                ×
              </button>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen dark:bg-zinc-900 w-full">
      {/* Header */}
      <header className="sticky top-0 bg-white dark:bg-zinc-800 p-4 shadow-sm z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-bold">Notifications</h1>

          <div className="flex items-center gap-4">
            {isDesktop ? (
              <div className="relative w-64">
                <input
                  type="text"
                  placeholder="Search notifications..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-700"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    handleSearch(e.target.value);
                  }}
                />
                <FaSearch className="absolute left-3 top-3 text-zinc-400" />
              </div>
            ) : (
              <button onClick={() => setShowFilters(!showFilters)}>
                <FaFilter className="text-zinc-600 dark:text-zinc-300" />
              </button>
            )}
          </div>
        </div>

        <FilterChips />
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Desktop Filters */}
          {isDesktop && (
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow">
                <h3 className="font-semibold mb-4">Filters</h3>
                <div className="space-y-4">
                  <Filtering
                    notificationFilters={notificationFilters}
                    filters={filters}
                    handleFilterChange={handleFilterChange}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Notifications List */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow">
              <div className="p-4 border-b dark:border-zinc-700 flex justify-between items-center">
                <div>
                  <span className="font-semibold">
                    {notifications?.TotalNotification || 0} notifications
                  </span>
                  {filters.type && (
                    <span className="text-sm text-zinc-500 ml-2">
                      ({filters.type})
                    </span>
                  )}
                </div>
                {isDesktop && notifications?.Stats?.earliestDate && (
                  <div className="text-sm text-zinc-500">
                    {notifications.Stats?.earliestDate &&
                      notifications.Stats?.latestDate && (
                        <>
                          {moment(notifications.Stats.earliestDate).format(
                            "MMM D YYYY"
                          )}
                          {!moment(notifications.Stats.earliestDate).isSame(
                            notifications.Stats.latestDate,
                            "day"
                          ) && (
                            <>
                              {" - "}
                              {moment(notifications.Stats.latestDate).isSame(
                                moment(),
                                "day"
                              )
                                ? "Today"
                                : moment(notifications.Stats.latestDate).format(
                                    "MMM D YYYY"
                                  )}
                            </>
                          )}
                        </>
                      )}
                  </div>
                )}
              </div>

              <div className="divide-y dark:divide-zinc-700">
                {notifications?.Notifications ? (
                  Object.values(notifications.Notifications)
                    .flat()
                    .map((notification) => (
                      <NotificationItem
                        key={notification._id}
                        notification={notification}
                        onMarkRead={handleFilterChange}
                        onDismiss={handleFilterChange}
                        isMobile={!isDesktop}
                      />
                    ))
                ) : (
                  <div className="p-4 text-center text-zinc-500">
                    No notifications found
                  </div>
                )}
              </div>
            </div>

            {/* Pagination */}
            {notifications?.Pagination && (
              <div className="mt-4 flex justify-center gap-2">
                {Array.from(
                  { length: notifications.Pagination.totalPages },
                  (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setFilters({ page: i + 1 })}
                      className={`px-3 py-1 rounded ${
                        filters.page === i + 1
                          ? "bg-blue-500 text-white"
                          : "bg-zinc-200 dark:bg-zinc-700"
                      }`}
                    >
                      {i + 1}
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {!isDesktop && showFilters && (
        <div className="fixed inset-0 bg-black/50 z-30">
          <div className="bg-white dark:bg-zinc-800 p-4 h-full max-w-xs ml-auto animate-slideIn">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Filters</h2>
              <button onClick={() => setShowFilters(false)}>
                <FaTimes className="text-zinc-600 dark:text-zinc-300" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Search</label>
                <input
                  type="text"
                  className="w-full p-2 rounded bg-zinc-100 dark:bg-zinc-700"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    handleSearch(e.target.value);
                  }}
                />
              </div>
              <Filtering
                notificationFilters={notificationFilters}
                filters={filters}
                handleFilterChange={handleFilterChange}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPage;
