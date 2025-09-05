import { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

type Room = {
  roomId: string;
  name: string;
  description: string;
  topic: string;
  rules: string[];
  duration: number; // in minutes
  maxParticipants: number;
  category: string;
  createdBy: string;
  createdAt: string;
};

const DebateRooms = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    topic: "",
    rules: [""],
    duration: 30,
    maxParticipants: 10,
    category: "politics",
    createdBy: "Anonymous"
  });
  const [rooms, setRooms] = useState<Room[]>([]);
  const [joinedRoom, setJoinedRoom] = useState<Room | null>(null);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [categories] = useState([
    "politics",
    "technology",
    "science",
    "health",
    "education",
    "economics",
    "sports",
    "entertainment"
  ]);

  // Listener for incoming messages
  useEffect(() => {
    socket.on("receive-message", (data) => {
      setChat((prev) => [...prev, `${data.sender}: ${data.message}`]);
    });

    return () => {
      socket.off("receive-message");
    };
  }, []);

  // Fetch existing rooms on component mount
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/v1/rooms");
        setRooms(res.data);
      } catch (err) {
        console.error("Failed to fetch rooms:", err);
      }
    };
    fetchRooms();
  }, []);

  const handleSendMessage = () => {
    if (joinedRoom && message) {
      socket.emit("send-message", {
        roomId: joinedRoom.roomId,
        message,
        sender: "You",
      });
      setMessage("");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleRuleChange = (index: number, value: string) => {
    const newRules = [...formData.rules];
    newRules[index] = value;
    setFormData({
      ...formData,
      rules: newRules
    });
  };

  const addRuleField = () => {
    setFormData({
      ...formData,
      rules: [...formData.rules, ""]
    });
  };

  const removeRuleField = (index: number) => {
    const newRules = formData.rules.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      rules: newRules
    });
  };

  const handleSubmitRoom = async () => {
    try {
      // Filter out empty rules
      const filteredRules = formData.rules.filter(rule => rule.trim() !== "");
      
      const res = await axios.post("http://localhost:3000/api/v1/create-room", {
        ...formData,
        rules: filteredRules
      });

      const newRoom: Room = {
        roomId: res.data.roomId,
        name: res.data.name,
        description: res.data.description,
        topic: res.data.topic,
        rules: res.data.rules,
        duration: res.data.duration,
        maxParticipants: res.data.maxParticipants,
        category: res.data.category,
        createdBy: res.data.createdBy,
        createdAt: res.data.createdAt
      };

      setRooms((prev) => [...prev, newRoom]);
      setShowModal(false);
      setFormData({
        name: "",
        description: "",
        topic: "",
        rules: [""],
        duration: 30,
        maxParticipants: 10,
        category: "politics",
        createdBy: "Anonymous"
      });
      setCurrentStep(1);
    } catch (err) {
      console.error("Failed to create room:", err);
    }
  };

  const handleJoinRoom = (room: Room) => {
    socket.emit("join-room", room.roomId);
    setJoinedRoom(room);
    setChat([]);
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <div className="text-white p-10">
      <h1 className="text-3xl mb-4 font-bold">A country that debates irrelevant will never solve the essential</h1>

      <button
        onClick={() => setShowModal(true)}
        className="bg-white text-black px-4 py-2 rounded-lg mb-8 hover:bg-gray-200 transition"
      >
        Create Debate Room
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-zinc-900 p-6 rounded-xl shadow-xl w-full max-w-2xl">
            <h2 className="text-2xl mb-4 font-bold">Create Debate Room</h2>
            
            {/* Step indicator */}
            <div className="flex mb-6">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= step ? "bg-white text-black" : "bg-gray-700"}`}>
                    {step}
                  </div>
                  {step < 3 && <div className="w-8 h-1 bg-gray-600 mx-1"></div>}
                </div>
              ))}
            </div>

            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div>
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium">Room Name*</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded bg-zinc-800 text-white"
                    placeholder="e.g., Climate Change Discussion"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium">Topic*</label>
                  <input
                    name="topic"
                    value={formData.topic}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded bg-zinc-800 text-white"
                    placeholder="e.g., Should governments ban fossil fuels?"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium">Description*</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded bg-zinc-800 text-white"
                    placeholder="Brief description of what this debate will cover"
                    rows={3}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium">Category*</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded bg-zinc-800 text-white"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Step 2: Debate Rules */}
            {currentStep === 2 && (
              <div>
                <h3 className="text-lg font-medium mb-4">Debate Rules</h3>
                <p className="text-gray-400 mb-4 text-sm">
                  Set clear rules to ensure a productive discussion. Participants will see these rules when joining.
                </p>

                {formData.rules.map((rule, index) => (
                  <div key={index} className="flex mb-3">
                    <input
                      value={rule}
                      onChange={(e) => handleRuleChange(index, e.target.value)}
                      className="flex-1 p-3 rounded bg-zinc-800 text-white mr-2"
                      placeholder={`Rule ${index + 1}`}
                    />
                    {formData.rules.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRuleField(index)}
                        className="bg-red-500 text-white px-3 rounded"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addRuleField}
                  className="text-blue-400 hover:text-blue-300 text-sm mt-2"
                >
                  + Add another rule
                </button>
              </div>
            )}

            {/* Step 3: Room Settings */}
            {currentStep === 3 && (
              <div>
                <h3 className="text-lg font-medium mb-4">Room Settings</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium">Duration (minutes)*</label>
                    <input
                      type="number"
                      name="duration"
                      min="5"
                      max="120"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded bg-zinc-800 text-white"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium">Max Participants*</label>
                    <input
                      type="number"
                      name="maxParticipants"
                      min="2"
                      max="50"
                      value={formData.maxParticipants}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded bg-zinc-800 text-white"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium">Created By</label>
                  <input
                    name="createdBy"
                    value={formData.createdBy}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded bg-zinc-800 text-white"
                    placeholder="Your name (optional)"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-between mt-6">
              <div>
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="bg-gray-700 text-white px-4 py-2 rounded-lg mr-2"
                  >
                    Back
                  </button>
                )}
              </div>
              
              <div>
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="bg-white text-black px-4 py-2 rounded-lg"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmitRoom}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                    disabled={!formData.name || !formData.topic || !formData.description}
                  >
                    Create Room
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {!joinedRoom && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div
              key={room.roomId}
              className="border border-zinc-800 p-5 rounded-lg bg-zinc-900 shadow-md hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold">{room.name}</h3>
                <span className="text-xs bg-zinc-700 px-2 py-1 rounded-full">
                  {room.category}
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-2">{room.topic}</p>
              <p className="text-gray-400 mb-4 text-sm">{room.description}</p>
              
              <div className="flex flex-wrap gap-1 mb-4">
                {room.rules.slice(0, 3).map((rule, i) => (
                  <span key={i} className="text-xs bg-zinc-800 px-2 py-1 rounded">
                    {rule}
                  </span>
                ))}
                {room.rules.length > 3 && (
                  <span className="text-xs bg-zinc-800 px-2 py-1 rounded">
                    +{room.rules.length - 3} more
                  </span>
                )}
              </div>
              
              <div className="flex justify-between text-xs text-gray-400 mb-4">
                <span>⏱️ {room.duration} min</span>
                <span>👥 {room.maxParticipants} max</span>
                <span>by {room.createdBy}</span>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => handleJoinRoom(room)}
                  className="bg-white text-black px-4 py-2 rounded-lg text-sm hover:bg-gray-200 transition"
                >
                  Join Debate
                </button>
                <button className="border border-white px-4 py-2 rounded-lg text-sm hover:bg-zinc-800 transition">
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {joinedRoom && (
        <div className="mt-10 border border-zinc-800 p-6 rounded-lg bg-zinc-900">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold">{joinedRoom.name}</h2>
              <p className="text-gray-400">{joinedRoom.topic}</p>
            </div>
            <button
              onClick={() => setJoinedRoom(null)}
              className="text-gray-400 hover:text-white"
            >
              Leave Room
            </button>
          </div>

          <div className="mb-6">
            <p className="text-gray-300 mb-4">{joinedRoom.description}</p>
            
            <div className="bg-zinc-800 p-4 rounded-lg mb-4">
              <h4 className="font-medium mb-2">Debate Rules</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                {joinedRoom.rules.map((rule, i) => (
                  <li key={i}>{rule}</li>
                ))}
              </ul>
            </div>

            <div className="flex gap-4 text-sm text-gray-400">
              <span>⏱️ Duration: {joinedRoom.duration} minutes</span>
              <span>👥 Participants: 2/{joinedRoom.maxParticipants}</span>
              <span>🏷️ Category: {joinedRoom.category}</span>
            </div>
          </div>

          <div className="h-64 overflow-y-auto bg-zinc-800 p-4 rounded mb-4 space-y-2">
            {chat.length > 0 ? (
              chat.map((msg, i) => (
                <p key={i} className="break-words">{msg}</p>
              ))
            ) : (
              <p className="text-gray-500 text-center py-10">No messages yet. Start the discussion!</p>
            )}
          </div>

          <div className="flex gap-3">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1 p-3 rounded bg-zinc-800 text-white"
              placeholder="Type your argument..."
            />
            <button
              onClick={handleSendMessage}
              className="bg-white text-black px-4 py-3 rounded-lg hover:bg-gray-200 transition"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DebateRooms;