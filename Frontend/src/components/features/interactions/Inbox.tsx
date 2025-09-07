import { useState, useEffect, useRef } from "react";
import api from "../../../api/api";
import { io, Socket } from "socket.io-client";

interface User {
  user_id: string;
  username: string;
  email: string;
  profile_img: string;
}

interface Message {
  id: string;
  from_user: string;
  to_user: string;
  text?: string;
  created_at: string;
  room: string;
  type?: "text" | "post_share";
  post_id?: string;
  post_data?: any; // contains full post JSON from Supabase
  status?: "sent" | "delivered" | "read";
}


let socket: Socket | null = null;
const SOCKET_SERVER_URL = "https://delta-3-vm3v.onrender.com";

const Inbox = () => {
  const [mutuals, setMutuals] = useState<User[]>([]);
  const [filteredMutuals, setFilteredMutuals] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userId, setUserId] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/me");
        setUserId(res.data.user.user_id);
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };
    fetchUser();
  }, []);

  // Socket initialization and event handlers
  useEffect(() => {
    if (!userId) return;

    socket = io(SOCKET_SERVER_URL, {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("Connected to socket:", socket?.id);
      socket?.emit("authenticate", { userId });
    });

    socket.on("message:new", (msg: Message) => {
      if (
        selectedUser &&
        (msg.from_user === selectedUser.user_id || msg.to_user === selectedUser.user_id)
      ) {
        setMessages((prev) => [...prev, { ...msg, status: "delivered" }]);
      }
    });

    socket.on("typing:status", ({ userId: typingUserId, isTyping: typing }) => {
      if (selectedUser?.user_id === typingUserId) {
        setIsTyping(typing);
      }
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from socket");
    });

    return () => {
      socket?.disconnect();
      socket = null;
    };
  }, [userId, selectedUser]);

  // Fetch mutuals
  useEffect(() => {
    if (!userId) return;

    const fetchMutuals = async () => {
      try {
        const { data } = await api.get(
          `/getMutuals/${userId}`
        );
        setMutuals(data.mutuals);
        setFilteredMutuals(data.mutuals);
      } catch (err) {
        console.error("Error fetching mutuals", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMutuals();
  }, [userId]);

  // Search filter
  useEffect(() => {
    setFilteredMutuals(
      mutuals.filter((u) =>
        u.username.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, mutuals]);

  // Load messages when user is selected
  useEffect(() => {
    if (!selectedUser || !userId) return;

    const loadMessages = async () => {
      try {
        const { data } = await api.get(
          `/messages?me=${userId}&other=${selectedUser.user_id}`
        );
        setMessages(data.map((msg: Message) => ({ ...msg, status: "delivered" })));
      } catch (err) {
        console.error("Error loading messages", err);
      }
    };

    loadMessages();
    socket?.emit("join:room", { otherUserId: selectedUser.user_id });
  }, [selectedUser, userId]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Typing indicator
  useEffect(() => {
    if (!text.trim() || !selectedUser || !socket) return;

    const timer = setTimeout(() => {
      socket?.emit("typing", { 
        to: selectedUser.user_id, 
        isTyping: !!text.trim() 
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [text, selectedUser]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    if (!text.trim() || !selectedUser || !socket) return;

    const makeRoom = (u1: string, u2: string) =>
      [u1, u2].sort().join(":");
    

    // Optimistically add the message to the UI
    const tempId = Date.now().toString();
    const newMessage: Message = {
      id: tempId,
      from_user: userId,
      to_user: selectedUser.user_id,
      text: text.trim(),
      created_at: new Date().toISOString(),
      room: makeRoom(userId, selectedUser.user_id),
      status: "sent",
    };

    setMessages((prev) => [...prev, newMessage]);
    setText("");
    inputRef.current?.focus();

    try {
      // Send the message via socket
      socket.on("messages:recent", (msgs: Message[]) => {
        setMessages(msgs.map((m) => ({ ...m, status: "delivered" })));
      });
      
      socket.emit(
        "message:send",
        { to: selectedUser.user_id, text: text.trim() },
        (ack: { ok: boolean; message?: Message; error?: string }) => {
          if (ack.ok && ack.message) {
            setMessages(prev =>
              prev.map(msg =>
                msg.id === tempId ? { ...ack.message!, status: "delivered" } : msg
              )
            );
          }
        }
      );
      
    } catch (err) {
     
    
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-[90vh] w-full bg-gradient-to-br from-[#0d0d0d] via-[#121212] to-[#1a1a1a]   overflow-hidden border-r border-gray-700">
      {/* Sidebar */}
      <div className="w-1/3 border-r border-zinc-700 flex flex-col ">
        <div className="p-4 ">
          <h2 className="text-xl ml-3 font-bold text-white">Messages</h2>
          <div className="mt-3 ml-3 relative">
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full p-2  bg-zinc-700 text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
       
          </div>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 "></div>
          </div>
        ) : filteredMutuals.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-4">
        
            <p>No conversations found</p>
          </div>
        ) : (
          <ul className="flex-1 overflow-y-auto">
            {filteredMutuals.map((user) => (
              <li
                key={user.user_id}
                onClick={() => setSelectedUser(user)}
                className={`flex items-center ml-3 p-3  cursor-pointer hover:bg-zinc-700 transition-colors ${
                  selectedUser?.user_id === user.user_id ? "bg-zinc-800" : ""
                }`}
              >
                <div className="relative">
                  <div className="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center text-white">
                    {user.profile_img ? (
                      <img
                        src={user.profile_img}
                        alt={user.username}
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      user.username.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-zinc-800"></div>
                </div>
                <div className="ml-3">
                  <h3 className="text-white font-medium">{user.username}</h3>
              
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Chat Window */}
      <div className="w-2/3 flex flex-col bg-gray-900">
        {selectedUser ? (
          <>
            <div className="p-4  flex items-center bg-zinc-800">
              <div className="relative">
                <div className="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center text-white">
                  {selectedUser.profile_img ? (
                    <img
                      src={selectedUser.profile_img}
                      alt={selectedUser.username}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    selectedUser.username.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-zinc-800"></div>
              </div>
              <div className="ml-3">
                <h2 className="text-white font-semibold">
                  {selectedUser.username}
                </h2>
                <p className="text-xs text-gray-400">
                  {isTyping ? "typing..." : "online"}
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-zinc-900">
            {messages.map((message) => (
  <div
    key={message.id}
    className={`mb-3 flex ${
      message.from_user === userId
        ? "justify-end"
        : "justify-start"
    }`}
  >
    <div
      className={`max-w-xs flex gap-3 lg:max-w-md px-4 py-2 rounded-lg ${
        message.from_user === userId
          ? "bg-white text-black rounded-br-none"
          : "bg-zinc-700 text-white rounded-bl-none"
      }`}
    >
      {message.type === "post_share" && message.post_data ? (
        <div className="bg-gray-800 p-2 rounded-lg">
          <img
            src={message.post_data.image_url}
            alt={message.post_data.title}
            className="w-full rounded-md mb-2"
          />
          <h4 className="font-semibold">{message.post_data.title}</h4>
          <p className="text-sm text-gray-300">{message.post_data.description}</p>
          <a
            href={`/posts/${message.post_id}`}
            className="text-blue-400 text-sm mt-2 inline-block"
          >
            View Post
          </a>
        </div>
      ) : (
        <p className="text-sm">{message.text}</p>
      )}

      <div className="flex items-center justify-end  space-x-1">
        <span className="text-xs flex text-gray-500 opacity-70">
          {new Date(message.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
        {message.from_user === userId && (
          <span className="text-xs">
            {message.status === "sent" && "🕒"}
            {message.status === "delivered" && "✓"}
          </span>
        )}
      </div>
    </div>
  </div>
))}

              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-zinc-700 bg-zinc-800">
              <div className="flex gap-3 items-center">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Type a message..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 p-3 bg-zinc-700 text-white rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  onClick={handleSend}
                  disabled={!text.trim()}
                  className={`px-4 py-3 rounded-lg ${
                    text.trim()
                      ? "bg-white text-black hover:bg-blue-700"
                      : "bg-white text-black opacity-50 cursor-not-allowed"
                  } text-black transition-colors`}
                >
                Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 bg-zinc-800 flex flex-col items-center justify-center text-gray-400 p-4">
          
            <h3 className="text-xl font-medium mb-2">Select a conversation</h3>
            <p className="text-center max-w-md">
              Choose from your existing conversations or start a new one
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inbox;