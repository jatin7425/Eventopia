import { Trash2 } from "lucide-react";
import React, { useState } from "react";
import { RiAddCircleLine } from "react-icons/ri";

const VendorColaborator = () => {
  const [colaborators, setColaborators] = useState([
    {
      name: "Colaborator 1",
      id: 1,
      imgPath:
        "https://images.unsplash.com/photo-1506794778169002-8b11c6b57c99",
    },
    {
      name: "Colaborator 2",
      id: 2,
      imgPath:
        "https://images.unsplash.com/photo-1506794778169002-8b11c6b57c99",
    },
    {
      name: "Colaborator 3",
      id: 3,
      imgPath:
        "https://images.unsplash.com/photo-1506794778169002-8b11c6b57c99",
    },
  ]);

  const [newColaboratorName, setNewColaboratorName] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  // Add colaborator function
  const addColaborator = () => {
    if (newColaboratorName.trim() === "") return;

    const newColaborator = {
      name: newColaboratorName,
      id: Date.now(), // Using timestamp as a simple unique ID
      imgPath:
        "https://images.unsplash.com/photo-1506794778169002-8b11c6b57c99",
    };

    setColaborators([...colaborators, newColaborator]);
    setNewColaboratorName("");
    setShowAddForm(false);
  };

  // Remove colaborator function
  const removeColaborator = (id) => {
    setColaborators(
      colaborators.filter((colaborator) => colaborator.id !== id)
    );
  };

  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="flex items-center justify-between gap-4 p-4 bg-white dark:bg-zinc-800 rounded-lg shadow-sm ">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Colaborators
        </h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="ml-auto text-white px-4 py-2 rounded-lg transition duration-200"
        >
          <RiAddCircleLine
            className={`hover:text-blue-600 ${
              showAddForm ? "text-blue-600" : "text-gray-500"
            }`}
            size={30}
          />
        </button>
      </div>

      {/* Add Colaborator Form */}
      {showAddForm && (
        <div className="p-4 bg-white dark:bg-zinc-800 rounded-lg shadow-sm flex gap-2">
          <input
            type="text"
            value={newColaboratorName}
            onChange={(e) => setNewColaboratorName(e.target.value)}
            placeholder="Enter colaborator name"
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:text-white"
          />
          <button
            onClick={addColaborator}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Add
          </button>
          <button
            onClick={() => {
              setShowAddForm(false);
              setNewColaboratorName("");
            }}
            className="px-4 py-2 bg-gray-200 dark:bg-zinc-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-zinc-500 transition duration-200"
          >
            Cancel
          </button>
        </div>
      )}

      <div className="space-y-3">
        {colaborators.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-zinc-800 rounded-lg">
            No colaborators added yet
          </div>
        ) : (
          colaborators.map((colaborator) => (
            <div
              key={colaborator.id}
              className="flex items-center justify-between gap-4 p-4 bg-white dark:bg-zinc-800 rounded-lg shadow-sm hover:shadow-white/50 transition duration-200"
            >
              <div className="flex items-center gap-4">
                <img
                  src={colaborator.imgPath}
                  alt={colaborator.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <span className="text-lg font-semibold text-gray-800 dark:text-white">
                  {colaborator.name}
                </span>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => removeColaborator(colaborator.id)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-700 transition duration-200"
                title="Remove colaborator"
              >
                <Trash2 className="text-red-500 hover:text-red-600" size={20} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VendorColaborator;
