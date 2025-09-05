import { AccessToken } from 'livekit-server-sdk';
import dotenv from 'dotenv';

dotenv.config();

export async function createToken(identity: string, roomName: string) {
  if (!process.env.LIVEKIT_API_KEY || !process.env.LIVEKIT_API_SECRET) {
    throw new Error('LIVEKIT_API_KEY or LIVEKIT_API_SECRET is missing in .env');
  }

  if (!identity || !roomName) {
    throw new Error('Missing identity or roomName');
  }

  const token = new AccessToken(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
    {
      identity,
      // Optional: add TTL (time-to-live) for token
      ttl: 60 * 60, // 1 hour in seconds
    }
  );

  token.addGrant({
    roomJoin: true,
    room: roomName,
  });

  return token.toJwt();
}
