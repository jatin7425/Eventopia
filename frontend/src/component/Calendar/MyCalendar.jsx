import { useState, useEffect } from "react";
import { useEvent } from "../../store/eventContext";
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval as eachDayOfMonth,
} from "date-fns";

const MyCalendar = () => {
  const {
    calendarEntries,
    event,
    updateCalendarEntry,
    addCalendarToEvent,
    getCalendarEntries,
    deleteCalendarEntry,
    isEventLoading,
  } = useEvent();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTab, setSelectedTab] = useState("calendar");
  const [viewMode, setViewMode] = useState("month");
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: format(new Date(), "yyyy-MM-dd"),
    startTime: "09:00",
    endTime: "10:00",
    description: "",
    priority: "medium",
  });

  console.log(calendarEntries);

  useEffect(() => {
    getCalendarEntries(event._id);
  }, [getCalendarEntries]);

  const handleAddEvent = async () => {
    if (!newEvent.title) return;

    try {
      // Basic client-side validation
      const [startH, startM] = newEvent.startTime.split(":").map(Number);
      const [endH, endM] = newEvent.endTime.split(":").map(Number);

      if (endH < startH || (endH === startH && endM <= startM)) {
        toast.error("End time must be after start time");
        return;
      }

      await addCalendarToEvent(event._id, newEvent);

      // Reset form
      setNewEvent({
        title: "",
        date: format(new Date(), "yyyy-MM-dd"),
        startTime: "09:00",
        endTime: "10:00",
        description: "",
        priority: "medium",
      });
    } catch (error) {
      toast.error("Failed to create event");
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      default:
        return "bg-green-500";
    }
  };

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const daysInMonth = eachDayOfMonth({ start: monthStart, end: monthEnd });
    const startDay = monthStart.getDay();

    return (
      <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-zinc-700">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="bg-white dark:bg-zinc-800 p-2 text-center text-sm font-medium dark:text-white"
          >
            {day}
          </div>
        ))}

        {Array(startDay)
          .fill(null)
          .map((_, i) => (
            <div
              key={`empty-${i}`}
              className="bg-white dark:bg-zinc-800 min-h-[100px]"
            />
          ))}

        {daysInMonth.map((day) => {
          let Entries = calendarEntries?.calendarEntries;
          const dayEvents =
            (Entries == undefined || Entries.length == 0)
              ? []
              : Entries?.filter((entry) =>
                isSameDay(new Date(entry.date), day)
              );
          return (
            <div
              key={day}
              className={`bg-white dark:bg-zinc-800 min-h-[100px] p-2 border-t border-gray-100 dark:border-zinc-700
                ${!isSameMonth(day, currentDate) ? "opacity-50" : ""}`}
            >
              <div className="flex justify-between items-center">
                <span
                  className={`text-sm ${isToday(day)
                      ? "bg-blue-500 text-white rounded-full px-2 pt-1"
                      : "dark:text-white"
                    }`}
                >
                  {format(day, "d")}
                </span>
              </div>
              <div className="mt-1 space-y-1">
                {dayEvents.map((entry) => (
                  <div key={entry._id} className="calendar-event">
                    <div className={`priority-${entry.priority}`} />
                    <div>
                      <strong>{entry.title}</strong>
                      <div>
                        {entry.startTime} - {entry.endTime}
                      </div>
                      {entry.description && <div>{entry.description}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderWeekView = () => {
    const weekDays = eachDayOfInterval({
      start: startOfWeek(currentDate, { weekStartsOn: 0 }),
      end: endOfWeek(currentDate, { weekStartsOn: 0 }),
    });

    return (
      <div className="flex flex-row">
        {/* Time Column */}
        <div className="flex flex-col w-[120px] bg-gray-100 dark:bg-zinc-800 border-r border-gray-300 dark:border-zinc-700">
          <div
            className={`p-2 text-start text-sm border-t border-gray-100 dark:border-zinc-700 `}
          >
            Time Stamp
          </div>
          {Array.from({ length: 24 }, (_, i) => {
            const startHour = String(i).padStart(2, "0");
            const endHour = String(i + 1).padStart(2, "0");
            return (
              <div className="">
                <div
                  key={i}
                  className="h-[50px] flex items-start px-2 text-xs text-gray-600 dark:text-zinc-400 border-t border-gray-100 dark:border-zinc-700 pt-5"
                >
                  {`${startHour}:00 - ${endHour}:00`}
                </div>
              </div>
            );
          })}
        </div>

        {/* Week Grid */}
        <div className="flex-1 grid grid-cols-7 gap-px bg-gray-200 dark:bg-zinc-700">
          {weekDays.map((day) => {
            let Entries = calendarEntries?.calendarEntries;
            const events =
              (Entries == undefined || Entries.length == 0)
                ? []
                : Entries?.filter((entry) =>
                  isSameDay(new Date(entry.date), day)
                );
            return (
              <div key={day} className="bg-white dark:bg-zinc-800">
                {/* Date Header */}
                <div
                  className={`p-2 text-sm ${isSameMonth(day, currentDate)
                      ? "text-gray-800 dark:text-white"
                      : "text-gray-400 dark:text-zinc-500"
                    }`}
                >
                  {format(day, "EEE d")}
                </div>

                {/* Hourly Slots */}
                <div className="relative h-[1200px]">
                  {Array.from({ length: 24 }, (_, i) => (
                    <div
                      key={i}
                      className="h-[50px] border-t border-gray-100 dark:border-zinc-700"
                    />
                  ))}
                  {/* Events */}
                  {events.filter((e) => isSameDay(new Date(e.start), day))
                    .map((event) => {
                      const start = new Date(event.start);
                      const end = new Date(event.end);
                      const top =
                        (start.getHours() + start.getMinutes() / 60) * 50;
                      const height = ((end - start) / (1000 * 60 * 60)) * 50;

                      return (
                        <div
                          key={event.id}
                          className={`absolute left-1 right-1 ${getPriorityColor(
                            event.priority
                          )} rounded p-1 text-white text-sm cursor-pointer`}
                          style={{ top: `${top}px`, height: `${height}px` }}
                        >
                          {event.title}
                          <div className="text-xs opacity-75">
                            {format(start, "HH:mm")} - {format(end, "HH:mm")}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-zinc-900">
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-4 pt-3 pb-2 bg-blue-500 text-white rounded-lg"
            >
              <span className="">Today</span>
            </button>
            <button
              onClick={() =>
                setCurrentDate(
                  viewMode === "month"
                    ? subMonths(currentDate, 1)
                    : subWeeks(currentDate, 1)
                )
              }
              className="px-2 pt-2 pb-1 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-full dark:text-white bg-blue-600 "
            >
              ←
            </button>
            <span className="text-xl font-semibold dark:text-white pt-3 pb-2">
              {format(currentDate, "MMMM yyyy")}
            </span>
            <button
              onClick={() =>
                setCurrentDate(
                  viewMode === "month"
                    ? addMonths(currentDate, 1)
                    : addWeeks(currentDate, 1)
                )
              }
              className="px-2 pt-2 pb-1 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-full dark:text-white bg-blue-600 "
            >
              →
            </button>
          </div>

          <div className="flex gap-2 ml-auto">
            <button
              onClick={() => setSelectedTab("calendar")}
              className={`px-4 pt-3 pb-2 rounded-lg ${selectedTab === "calendar"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-zinc-700 dark:text-white"
                }`}
            >
              Calendar
            </button>
            <button
              onClick={() => setSelectedTab("event")}
              className={`px-4 pt-3 pb-2 rounded-lg ${selectedTab === "event"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-zinc-700 dark:text-white"
                }`}
            >
              Add Event
            </button>
          </div>
        </div>

        {selectedTab === "calendar" ? (
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg overflow-hidden">
            <div className="flex gap-4 p-4 border-b dark:border-zinc-700">
              {["Week", "Month"].map((view) => (
                <button
                  key={view}
                  onClick={() => setViewMode(view.toLowerCase())}
                  className={`px-4 pt-3 pb-2 rounded-lg ${viewMode === view.toLowerCase()
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 dark:bg-zinc-700 dark:text-white"
                    }`}
                >
                  {view}
                </button>
              ))}
            </div>

            {viewMode === "month" ? renderMonthView() : renderWeekView()}
          </div>
        ) : (
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 dark:text-white">
              Create Event
            </h2>
            <div className="grid gap-4">
              <input
                type="text"
                placeholder="Event title"
                value={newEvent.title}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, title: e.target.value })
                }
                className="px-2 pt-3 pb-2 border rounded dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
              />
              <input
                type="date"
                value={newEvent.date}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, date: e.target.value })
                }
                className="px-2 pt-3 pb-2 border rounded dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="time"
                  value={newEvent.startTime}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, startTime: e.target.value })
                  }
                  className="px-2 pt-3 pb-2 border rounded dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                />
                <input
                  type="time"
                  value={newEvent.endTime}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, endTime: e.target.value })
                  }
                  className="px-2 pt-3 pb-2 border rounded dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                />
              </div>
              <select
                value={newEvent.priority}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, priority: e.target.value })
                }
                className="px-2 pt-3 pb-2 border rounded dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              <button
                onClick={handleAddEvent}
                className="px-4 pt-3 pb-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
              >
                Create Event
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCalendar;
