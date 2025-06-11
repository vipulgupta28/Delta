import { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

type Room = {
  roomId: string;
  name: string;
  description: string;
};

const DebateRooms = () => {
  const [showModal, setShowModal] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [roomDesc, setRoomDesc] = useState("");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [joinedRoom, setJoinedRoom] = useState<Room | null>(null);

  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<string[]>([]);

  // 👥 Listener for incoming messages
  useEffect(() => {
    socket.on("receive-message", (data) => {
      setChat((prev) => [...prev, `${data.sender}: ${data.message}`]);
    });

    return () => {
      socket.off("receive-message");
    };
  }, []);

  // 📤 Send Message to Room
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

  // 🧠 Create Room
  const handleSubmitRoom = async () => {
    try {
      const res = await axios.post("http://localhost:3000/api/v1/create-room", {
        name: roomName,
        description: roomDesc,
      });

      const newRoom: Room = {
        roomId: res.data.roomId,
        name: res.data.name,
        description: res.data.description,
      };

      setRooms((prev) => [...prev, newRoom]);
      setShowModal(false);
      setRoomName("");
      setRoomDesc("");
    } catch (err) {
      console.error("Failed to create room:", err);
    }
  };

  // 🔗 Join Room
  const handleJoinRoom = (room: Room) => {
    socket.emit("join-room", room.roomId);
    setJoinedRoom(room);
    setChat([]); // clear chat from previous room
  };

  return (
    <div className="text-white p-10">
      <h1 className="text-3xl mb-4 font-bold">Create Debate Rooms or Join One</h1>

      {/* ➕ Create Room */}
      <button
        onClick={() => setShowModal(true)}
        className="bg-white text-black px-4 py-2 rounded-lg mb-8"
      >
        Create Room
      </button>

      {/* 🧾 Modal for Room Creation */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-zinc-900 p-6 rounded-xl shadow-xl w-full max-w-md">
            <h2 className="text-xl mb-4 font-bold">Create a Debate Room</h2>
            <input
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="w-full mb-3 p-2 rounded bg-zinc-800 text-white"
              placeholder="Room Name"
            />
            <textarea
              value={roomDesc}
              onChange={(e) => setRoomDesc(e.target.value)}
              className="w-full mb-4 p-2 rounded bg-zinc-800 text-white"
              placeholder="Room Description"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitRoom}
                className="bg-white text-black px-4 py-1 rounded-lg"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🧩 List of Available Rooms */}
      {!joinedRoom && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div
              key={room.roomId}
              className="border border-zinc-800 p-5 rounded-lg bg-zinc-900 shadow-md"
            >
              <h3 className="text-xl font-bold mb-2">{room.name}</h3>
              <p className="text-gray-400 mb-4">{room.description}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleJoinRoom(room)}
                  className="bg-white text-black px-4 py-2 rounded-lg"
                >
                  Join Room
                </button>
                <button className="border border-white px-4 py-2 rounded-lg">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 💬 Chat Interface */}
      {joinedRoom && (
        <div className="mt-10 border border-zinc-800 p-6 rounded-lg bg-zinc-900">
          <h2 className="text-2xl font-bold mb-4">Room: {joinedRoom.name}</h2>
          <p className="text-gray-400 mb-4">{joinedRoom.description}</p>

          <div className="h-64 overflow-y-auto bg-zinc-800 p-4 rounded mb-4 space-y-2">
            {chat.map((msg, i) => (
              <p key={i}>{msg}</p>
            ))}
          </div>

          <div className="flex gap-3">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 p-2 rounded bg-zinc-800 text-white"
              placeholder="Type a message..."
            />
            <button
              onClick={handleSendMessage}
              className="bg-white text-black px-4 py-2 rounded-lg"
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
