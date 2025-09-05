import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { LiveKitRoom } from '@livekit/components-react';


const LIVEKIT_URL = 'wss://delta-mt9b8dd8.livekit.cloud';

const LiveStreamPage = () => {
  const { username } = useParams<{ username: string }>();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      if (!username) return;

      try {
        const res = await fetch('http://localhost:3000/api/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            identity: `viewer-${Date.now()}`, // generate unique viewer id
            roomName: `live-${username}`,
            role: 'viewer',
          }),
        });

        const data = await res.json();
        setToken(data.token);
      } catch (err) {
        console.error('Failed to fetch token:', err);
      }
    };

    fetchToken();
  }, [username]);

  if (!username) return <p className="p-4">No streamer specified</p>;

  if (!token) return <p className="p-4">Loading stream for {username}...</p>;

  return (
    <div className="p-4 min-h-screen bg-black text-white">
      <h2 className="text-2xl font-bold mb-4">Watching {username}'s Live Stream</h2>
      <LiveKitRoom
        token={token}
        serverUrl={LIVEKIT_URL}
        connect
        video
        audio
        data-lk-theme="default"
      >
        <p className="text-md text-white mt-2">You're watching {username}</p>
      </LiveKitRoom>
    </div>
  );
};

export default LiveStreamPage;
