import { useState } from "react";
import { motion } from "framer-motion";
import { useEvent } from "../../store/eventContext";

// Attendees Component
const InvitationResponse = () => {
  const { attendeeStatsdets } = useEvent();
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (selectedOption) {
      setIsSubmitted(true);
      // Here you would typically send the response to your backend
      console.log(`User selected: ${selectedOption}`);
    }
  };

  const resetResponse = () => {
    setSelectedOption(null);
    setIsSubmitted(false);
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="w-full h-fit border border-zinc-500 rounded-lg overflow-hidden shadow-lg"
      >
        <div className="bg-zinc-200 dark:bg-zinc-700 p-4 border-b border-zinc-500">
          <h2 className="text-lg font-semibold text-center">
            Event Invitation
          </h2>
          <p className="text-sm text-center mt-1">Will you attend our event?</p>
        </div>

        {!isSubmitted ? (
          <>
            <div className="flex max-md:flex-col-reverse items-center justify-between gap-5">
              <div className="w-full h-fit flex flex-col md:flex-row">
                <OptionCard
                  option="Accept"
                  isSelected={selectedOption === "Accept"}
                  onSelect={() => handleOptionSelect("Accept")}
                  icon="✓"
                  color="bg-green-100 dark:bg-green-900"
                />
                <OptionCard
                  option="Not Response"
                  isSelected={selectedOption === "Not Response"}
                  onSelect={() => handleOptionSelect("Not Response")}
                  icon="?"
                  color="bg-yellow-100 dark:bg-yellow-900"
                />
                <OptionCard
                  option="Decline"
                  isSelected={selectedOption === "Decline"}
                  onSelect={() => handleOptionSelect("Decline")}
                  icon="✗"
                  color="bg-red-100 dark:bg-red-900"
                />
              </div>
            </div>

            <div className="p-4 bg-zinc-100 dark:bg-zinc-800 border-t border-zinc-500">
              <button
                onClick={handleSubmit}
                disabled={!selectedOption}
                className={`w-full py-2 rounded-md font-medium ${
                  selectedOption
                    ? "bg-blue-500 hover:bg-blue-600 text-white"
                    : "bg-zinc-300 dark:bg-zinc-600 cursor-not-allowed"
                } transition-colors`}
              >
                Submit Response
              </button>
            </div>
          </>
        ) : (
          <div className="p-6 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-4"
            >
              <div className="text-4xl mb-2">
                {selectedOption === "Accept" && "🎉"}
                {selectedOption === "Not Response" && "🤔"}
                {selectedOption === "Decline" && "😢"}
              </div>
              <h3 className="text-xl font-semibold">
                {selectedOption === "Accept" && "Thank you for accepting!"}
                {selectedOption === "Not Response" && "We await your decision"}
                {selectedOption === "Decline" && "Sorry you can't make it"}
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Your response has been recorded.
              </p>
            </motion.div>
            <button
              onClick={resetResponse}
              className="text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline"
            >
              Change response
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

const OptionCard = ({ option, isSelected, onSelect, icon, color }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className={`w-full min-h-[100px] ${color} border-zinc-500 px-4 py-4 cursor-pointer transition-all ${
        isSelected ? "ring-2 ring-blue-500" : ""
      }`}
      onClick={onSelect}
    >
      <div className="flex flex-col items-center justify-center h-full">
        <span className="text-2xl mb-2">{icon}</span>
        <span className="font-medium">{option}</span>
      </div>
    </motion.div>
  );
};


export default InvitationResponse;