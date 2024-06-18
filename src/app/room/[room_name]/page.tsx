"use client";

import { WebAudioContext } from "@/providers/audio/webAudio";
import { BottomBar } from "@/components/BottomBar";
import { RoomInfo } from "@/components/RoomInfo";
import { UsernameInput } from "@/components/UsernameInput";
import {Transcriber} from "@/components/Transcriber"

import {
  ConnectionDetails,
  ConnectionDetailsBody,
} from "@/pages/api/connection_details";
import { LiveKitRoom } from "@livekit/components-react";
import { RoomAudioRenderer} from "@livekit/components-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast, Toaster } from "react-hot-toast";

import { useMobile } from "@/util/useMobile";
import {ReconnectPolicy, ReconnectContext} from 'livekit-client/src/room/ReconnectPolicy';


const maxRetryDelay = 7000;
const DEFAULT_RETRY_DELAYS_IN_MS = [
  0,
  300,
  2 * 2 * 300,
  3 * 3 * 300,
  4 * 4 * 300,
  maxRetryDelay,
  maxRetryDelay,
  maxRetryDelay,
  maxRetryDelay,
  maxRetryDelay,
];

class CustomReconnectPolicy implements ReconnectPolicy {
  private readonly _retryDelays: number[];

  constructor(retryDelays?: number[]) {
    this._retryDelays = retryDelays !== undefined ? [...retryDelays] : DEFAULT_RETRY_DELAYS_IN_MS;
  }

  public nextRetryDelayInMs(context: ReconnectContext): number | null {
    const retryDelay = this._retryDelays[context.retryCount];
    if (context.retryCount <= 1) return retryDelay;

    return retryDelay + Math.random() * 1_000;
  }
}

type Props = {
  params: { room_name: string };
};

export default function Page({ params: { room_name } }: Props) {
  const [connectionDetails, setConnectionDetails] =
    useState<ConnectionDetails | null>(null);
  const isMobile = useMobile();
  const policy = new CustomReconnectPolicy()

  useEffect(() => {
    const fetchQueryData = async function() {
      const details = await requestConnectionDetails(
        "123"
      );
      setConnectionDetails(details)
    }
    fetchQueryData()
  }, []);

  const requestConnectionDetails = useCallback(
    async (username: string) => {
      const body: ConnectionDetailsBody = {
        room_name,
        username,
      };
      const response = await fetch("/quick/api/connection_details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (response.status === 200) {
        return response.json();
      }

      const { error } = await response.json();
      throw error;
    },
    [room_name]
  );

  return (
      <LiveKitRoom
        token={connectionDetails?.token}
        serverUrl={connectionDetails?.ws_url}
        connect={true}
        audio={true}
        options={{reconnectPolicy: policy}}
      >
        <RoomAudioRenderer/>
      </LiveKitRoom>
  );
}
