import { useNavigate } from 'react-router-dom';
import { LiveKitRoom } from '@livekit/components-react';
import { useEffect, useState } from 'react';
import api from '../../../api/api';
import { LiveVideoGrid } from '../videos';
import { createLocalTracks } from 'livekit-client';

const LIVEKIT_URL = 'wss://delta-mt9b8dd8.livekit.cloud';

const LiveNowList = () => {
  const navigate = useNavigate();
 

  const [username, setUsername] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);

  const liveUsers = ['vipul', 'mohit', 'aarti']; // Simulate live users (you can dynamically replace this later)

  // Get logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/me');
        const user = res.data.user;
        setUsername(user.username);
      } catch (err) {
        console.error('Failed to fetch user', err);
      }
    };

    fetchUser();
  }, []);

  // Handle Go Live button
  const handleGoLive = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identity: username,
        roomName: `live-${username}`,
        role: 'broadcaster',
      }),
    });

    const data = await res.json();
    setToken(data.token);
    setIsLive(true);

    // ✅ Manually create local tracks using your external camera deviceId
    const tracks = await createLocalTracks({
      video: {
        deviceId: { exact: 'a1ca19f609966cb947b047e5c865b8399bd2df591c9d4270e76bf05c47ec1c25' },
      },
      audio: true,
    });

    // ✅ Append video element for visual confirmation (only for debugging)
    const stream = new MediaStream(tracks.map(t => t.mediaStreamTrack));
    const video = document.createElement('video');
    video.srcObject = stream;
    video.autoplay = true;
    video.muted = true;
    video.playsInline = true;
    video.style.position = 'fixed';
    video.style.bottom = '10px';
    video.style.right = '10px';
    video.style.width = '200px';
    video.style.border = '2px solid white';
    document.body.appendChild(video);
  } catch (error) {
    console.error('Error starting live stream:', error);
  }
};

  

  // Show the stream when live
  if (isLive && token) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">You are now live</h2>
        <LiveKitRoom
          token={token}
          serverUrl={LIVEKIT_URL}
          connect
          video
          audio
          data-lk-theme="default"
          
        >
            
          <p className="text-md text-white mt-2">Streaming as {username}</p>
          <LiveVideoGrid/>
          
        </LiveKitRoom>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Live Now</h2>
        <button
          onClick={handleGoLive}
          className="bg-white text-black font-semibold rounded-xl px-4 py-2 hover:bg-gray-200 transition"
        >
          Go Live
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {liveUsers
          .filter((user) => user !== username) // Don't list yourself
          .map((user) => (
            <div
              key={user}
              className="bg-gray-900 p-4 rounded-xl cursor-pointer hover:bg-gray-700 transition"
              onClick={() => navigate(`/live/${user}`)}
            >
              <p className="text-lg font-semibold capitalize">{user}</p>
              <p className="text-sm text-gray-400">is streaming now</p>
              <button className="mt-2 bg-blue-600 text-white px-3 py-1 rounded">
                Watch
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default LiveNowList;
