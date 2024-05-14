// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { RoomServiceClient } from "livekit-server-sdk";

export type RoomInfo = {
  num_participants: number;
};

type ErrorResponse = {
  error: string;
};

type Query = {
  room: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RoomInfo | ErrorResponse>
) {
  if (req.method !== "GET") {
    return res.status(400).json({ error: "Invalid method" });
  }

  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const wsUrl = process.env.LIVEKIT_WS_URL;
  const { room } = req.query as Query;

  if (!apiKey || !apiSecret || !wsUrl) {
    return res.status(500).json({ error: "Server misconfigured" });
  }

  const livekitHost = wsUrl?.replace("wss://", "https://");
  const roomService = new RoomServiceClient(livekitHost, apiKey, apiSecret);

  try {
    const participants = await roomService.listParticipants(room);
    return res.status(200).json({ num_participants: participants.length });
  } catch {
    return res.status(200).json({ num_participants: 0 });
  }
}
