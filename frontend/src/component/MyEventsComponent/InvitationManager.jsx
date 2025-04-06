import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useEvent } from "../../store/eventContext";

const InvitationManager = ({ event }) => {
  const { addAttendiesToEvent, attendeeStatsdets, attendeeStats, addedAttendee } = useEvent();
  const [activeTab, setActiveTab] = useState("invite");
  const [attendees, setAttendees] = useState([]);
  const [newAttendee, setNewAttendee] = useState({ name: "", email: "" });
  const [eventDetails] = useState({
    title: "Annual Company Meeting",
    date: "2023-12-15",
    location: "Conference Room A",
  });

  const fetchAttendees = async (eventId) => {
    try {
      const attendee = await attendeeStats(eventId);
      console.log(attendee); // now you'll see the real data
      setAttendees(attendee.attendees); // if you want to store it in state
    } catch (err) {
      console.error('Error fetching attendees:', err);
    }
  };

  console.log(event._id);
  useEffect(() => {
    if (event._id) {
      fetchAttendees(event._id); // call the async function
    }
  }, [event._id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAttendee((prev) => ({ ...prev, [name]: value }));
  };

  const addAttendee = () => {
    if (newAttendee.name && newAttendee.email) {
      addAttendiesToEvent(event?._id, newAttendee)
      fetchAttendees(event?._id)
      setNewAttendee({ name: "", email: "" });
    }
  };

  const filteredAttendees = (status) => {
    return attendees.filter((attendee) => attendee.status.toLowerCase() === status);
  };

  console.log(filteredAttendees("pending"))

  return (
    <div className="max-w-4xl mx-auto p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full border border-zinc-500 rounded-lg overflow-hidden shadow-lg"
      >
        {/* Header */}
        <div className="bg-zinc-200 dark:bg-zinc-700 p-4 border-b border-zinc-500">
          <h1 className="text-2xl font-bold text-center">
            Event Invitation Manager
          </h1>
          <div className="flex justify-between items-center mt-4">
            <div>
              <h2 className="text-xl font-semibold">{eventDetails.title}</h2>
              <p className="text-sm">
                {eventDetails.date} • {eventDetails.location}
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab("invite")}
                className={`px-4 pt-2 pb-1 rounded-md ${activeTab === "invite"
                  ? "bg-blue-500 text-white"
                  : "bg-zinc-300 dark:bg-zinc-600"
                  }`}
              >
                Invite
              </button>
              <button
                onClick={() => setActiveTab("responses")}
                className={`px-4 pt-2 pb-1 rounded-md ${activeTab === "responses"
                  ? "bg-blue-500 text-white"
                  : "bg-zinc-300 dark:bg-zinc-600"
                  }`}
              >
                Responses
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 bg-zinc-100 dark:bg-zinc-800">
          {activeTab === "invite" ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Invite New Attendees</h3>
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  name="name"
                  value={newAttendee.name}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                  className="flex-1 pt-3 pb-2 px-3 border border-zinc-500 rounded-md dark:bg-zinc-700 dark:text-white"
                />
                <input
                  type="email"
                  name="email"
                  value={newAttendee.email}
                  onChange={handleInputChange}
                  placeholder="Email Address"
                  className="flex-1 pt-3 pb-2 px-3 border border-zinc-500 rounded-md dark:bg-zinc-700 dark:text-white"
                />
                <button
                  onClick={addAttendee}
                  className="px-4 pt-2 pb-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  Add Attendee
                </button>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">
                  Pending Invitations
                </h3>
                {filteredAttendees("pending").length > 0 ? (
                  <div className="grid gap-4">
                    {filteredAttendees("pending").map((attendee) => (
                      <div
                        key={attendee.id}
                        className="p-3 bg-white dark:bg-zinc-700 rounded-md shadow flex justify-between items-center"
                      >
                        <div>
                          <p className="font-medium dark:text-white">
                            {attendee.name}
                          </p>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            {attendee.email}
                          </p>
                        </div>
                        <span className="">
                          {/* <StatusBadge status={attendee.status} /> */}
                          <StatusBadge status={attendee.status} />
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-zinc-500 dark:text-zinc-400">
                    No pending invitations
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <ResponseSummary
                  title="Accepted"
                  count={attendeeStatsdets?.stats?.accepted || 0}
                  color="bg-green-100 dark:bg-green-900"
                  textColor="text-green-800 dark:text-green-200"
                />
                <ResponseSummary
                  title="Declined"
                  count={attendeeStatsdets?.stats?.declined || 0}
                  color="bg-red-100 dark:bg-red-900"
                  textColor="text-red-800 dark:text-red-200"
                />
                <ResponseSummary
                  title="Pending"
                  count={attendeeStatsdets?.stats?.pending || 0}
                  color="bg-yellow-100 dark:bg-yellow-900"
                  textColor="text-yellow-800 dark:text-yellow-200"
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Attendee Responses
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white dark:bg-zinc-700 rounded-md overflow-hidden">
                    <thead className="bg-zinc-200 dark:bg-zinc-600">
                      <tr>
                        <th className="pt-3 pb-2 px-4 text-left">Name</th>
                        <th className="pt-3 pb-2 px-4 text-left">Email</th>
                        <th className="pt-3 pb-2 px-4 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendees.map((attendee) => (
                        <tr
                          key={attendee.id}
                          className="border-t border-zinc-300 dark:border-zinc-600"
                        >
                          <td className="pt-3 pb-2 px-4 dark:text-white">
                            {attendee.name}
                          </td>
                          <td className="pt-3 pb-2 px-4 dark:text-white">
                            {attendee.email}
                          </td>
                          <td className="pt-3 pb-2 px-4">
                            <StatusBadge status={attendee.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const ResponseSummary = ({ title, count, color, textColor }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className={`p-4 rounded-md ${color} ${textColor} shadow`}
    >
      <h4 className="font-semibold">{title}</h4>
      <p className="text-3xl font-bold mt-2">{count}</p>
    </motion.div>
  );
};

const StatusBadge = ({ status }) => {
  const statusConfig = {
    accepted: {
      color: "bg-green-100 dark:bg-green-900 ",
      text: "text-green-800 dark:text-green-200",
      label: "Accepted",
    },
    declined: {
      color: "bg-red-100 dark:bg-red-900 ",
      text: "text-red-800 dark:text-red-200",
      label: "Declined",
    },
    pending: {
      color: "bg-yellow-100 dark:bg-yellow-900 ",
      text: "text-yellow-800 dark:text-yellow-200",
      label: "Pending",
    },
  };

  return (
    <span
      className={`px-3 pt-2 py-1 rounded-full text-sm ${statusConfig[status.toLowerCase()].color} ${statusConfig[status.toLowerCase()].text}`}
    >
      {statusConfig[status.toLowerCase()].label}
    </span>
  );
};

export default InvitationManager;
