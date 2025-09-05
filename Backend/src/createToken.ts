import { AccessToken } from 'livekit-server-sdk';
import dotenv from 'dotenv';
dotenv.config();

export async function createToken(
  identity: string,
  roomName: string,
  role: 'viewer' | 'broadcaster'
) {
  const token = new AccessToken(
    process.env.LIVEKIT_API_KEY!,
    process.env.LIVEKIT_API_SECRET!,
    { identity }
  );

  const grant: any = {
    roomJoin: true,
    room: roomName,
  };

  if (role === 'viewer') {
    grant.canSubscribe = true;
    grant.canPublish = false;
  } else {
    grant.canSubscribe = true;
    grant.canPublish = true;
  }

  token.addGrant(grant);

  return token.toJwt();
}
