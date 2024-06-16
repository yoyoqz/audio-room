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
import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { toast, Toaster } from "react-hot-toast";

import { useMobile } from "@/util/useMobile";



type Props = {
  params: { room_name: string };
};

export default function Page({ params: { room_name } }: Props) {
  const [connectionDetails, setConnectionDetails] =
    useState<ConnectionDetails | null>(null);
  const isMobile = useMobile();
  //const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const reconnectTimer = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const fetchQueryData = async function() {
      const details = await requestConnectionDetails(
        "123"
      );
      setConnectionDetails(details)
    }
    fetchQueryData()
  }, []);

  useEffect(() => {
    return () => {
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current)
        reconnectTimer.current = null
      }
    }
  }, [])

  const humanRoomName = useMemo(() => {
    return decodeURI(room_name);
  }, [room_name]);

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

  const onDisconnected = () => {
    console.log('handleDisconnect')
    reconnectTimer.current = setTimeout(() => {
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current)
        reconnectTimer.current = null
      }
      window.location.reload()
    }, 5000)
  }

  return (
    <div>
      <LiveKitRoom
        token={connectionDetails?.token}
        serverUrl={connectionDetails?.ws_url}
        connect={true}
        connectOptions={{ autoSubscribe: false }}
        audio={true}
        onDisconnected={onDisconnected}
      >
        <RoomAudioRenderer/>
      </LiveKitRoom>
    </div>
  );
}
