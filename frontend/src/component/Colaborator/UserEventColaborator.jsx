import { AnimatePresence, motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import React, { useState } from "react";
import { RiAddCircleLine } from "react-icons/ri";

const UserEventColaborator = () => {
  const [colaborators, setColaborators] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "",
      phonenumber: "+1234567890",
      imgPath:
        "https://images.unsplash.com/photo-1506794778169002-8b11c6b57c99",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "",
      phonenumber: "+1987654321",
      imgPath:
        "https://images.unsplash.com/photo-1506794778169002-8b11c6b57c99",
    },
    {
      id: 3,
      name: "Alex Johnson",
      email: "",
      phonenumber: "+1122334455",
      imgPath:
        "https://images.unsplash.com/photo-1506794778169002-8b11c6b57c99",
    },
  ]);

  const [newColaborator, setNewColaborator] = React.useState({
    name: "",
    email: "",
    phonenumber: "",
  });

  const [showAddForm, setShowAddForm] = React.useState(false);

  // Add colaborator function
  const addColaborator = () => {
    if (newColaborator.name.trim() === "") return;

    const colaboratorToAdd = {
      id: Date.now(),
      name: newColaborator.name,
      email: newColaborator.email,
      phonenumber: newColaborator.phonenumber,
      imgPath: "",
    };

    setColaborators([...colaborators, colaboratorToAdd]);
    setNewColaborator({ name: "", email: "", phonenumber: "" });
    setShowAddForm(false);
  };

  const removeColaborator = (id) => {
    const updatedColaborators = colaborators.filter(
      (colaborator) => colaborator.id !== id
    );
    setColaborators(updatedColaborators);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewColaborator((prev) => ({ ...prev, [name]: value }));
  };

  const variants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="mt-5 rounded-lg shadow">
      <div className="px-3 py-2 bg-white dark:bg-zinc-800 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold ">User Colaborator</h1>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors ${
              showAddForm ? "text-blue-600" : "text-gray-500"
            } hover:text-blue-600`}
            aria-label={showAddForm ? "Close form" : "Add colaborator"}
          >
            <RiAddCircleLine className={``} size={24} />
          </button>
        </div>

        {/* Add Colaborator Form  */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              variants={variants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="p-4 bg-white dark:bg-zinc-800 rounded-lg shadow mb-4"
            >
              <motion.div variants={itemVariants} className="space-y-3">
                <input
                  type="text"
                  name="name"
                  value={newColaborator.name}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none dark:bg-zinc-700 dark:text-white"
                  required
                />
                <input
                  type="email"
                  name="email"
                  value={newColaborator.email}
                  onChange={handleInputChange}
                  placeholder="Email Address"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none dark:bg-zinc-700 dark:text-white"
                />
                <input
                  type="tel"
                  name="phonenumber"
                  value={newColaborator.phonenumber}
                  onChange={handleInputChange}
                  placeholder="Phone Number"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none dark:bg-zinc-700 dark:text-white"
                />
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="flex justify-end gap-2 mt-4"
              >
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewColaborator({ name: "", email: "", phonenumber: "" });
                  }}
                  className="px-4 py-2 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-zinc-700 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addColaborator}
                  disabled={!newColaborator.name.trim()}
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
                >
                  Add Colaborator
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-3">
          {colaborators.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-zinc-800 rounded-lg shadow">
              <p className="text-lg">No colaborators added yet</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="mt-4 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Your First Colaborator
              </button>
            </div>
          ) : (
            colaborators.map((colaborator) => (
              <motion.div
                key={colaborator.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center justify-between p-4 bg-white dark:bg-zinc-800 rounded-lg shadow hover:shadow-white/30 transition-shadow"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <img
                    src={colaborator.imgPath}
                    alt={colaborator.name}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-lg font-semibold text-gray-800 dark:text-white truncate">
                      {colaborator.name}
                    </p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 dark:text-gray-400">
                      {colaborator.email && (
                        <span className="truncate">{colaborator.email}</span>
                      )}
                      {colaborator.phonenumber && (
                        <span>{colaborator.phonenumber}</span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => removeColaborator(colaborator.id)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
                  aria-label="Remove colaborator"
                >
                  <Trash2
                    className="text-red-500 hover:text-red-600"
                    size={18}
                  />
                </button>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserEventColaborator;
