"use client";

import { WebAudioContext } from "@/providers/audio/webAudio";
import { BottomBar } from "@/components/BottomBar";
import { RoomInfo } from "@/components/RoomInfo";
import { UsernameInput } from "@/components/UsernameInput";
import {Transcriber} from "@/components/Transcriber"
import {RemoteParticipantController} from "@/components/RemoteParticipantController"
import {
  ConnectionDetails,
  ConnectionDetailsBody,
} from "@/pages/api/connection_details";
import { LiveKitRoom} from "@livekit/components-react";
import { RoomAudioRenderer} from "@livekit/components-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast, Toaster } from "react-hot-toast";

import { useMobile } from "@/util/useMobile";



type Props = {
  params: { room_name: string };
};

export default function Page({ params: { room_name } }: Props) {
  const [connectionDetails, setConnectionDetails] =
    useState<ConnectionDetails | null>(null);
  const isMobile = useMobile();
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  useEffect(() => {
    setAudioContext(new AudioContext());
    return () => {
      setAudioContext((prev) => {
        prev?.close();
        return null;
      });
    };
  }, []);

  const humanRoomName = useMemo(() => {
    return decodeURI(room_name);
  }, [room_name]);

  const requestConnectionDetails = useCallback(
    async (username: string) => {
      const body: ConnectionDetailsBody = {
        room_name,
        username,
      };
      const response = await fetch("/audio/api/connection_details", {
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

  if (!audioContext) {
    return null;
  }

  // If we don't have any connection details yet, show the username form
  if (connectionDetails === null) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center">
        <Toaster />
        <h2 className="text-4xl mb-4">{humanRoomName}</h2>
        <RoomInfo roomName={room_name} />
        <div className="divider"></div>
        <UsernameInput
          submitText="Join Room"
          onSubmit={async (username) => {
            try {
              // TODO unify this kind of pattern across examples, either with the `useToken` hook or an equivalent
              const connectionDetails = await requestConnectionDetails(
                username
              );
              setConnectionDetails(connectionDetails);
            } catch (e: any) {
              toast.error(e);
            }
          }}
        />
      </div>
    );
  }

  // Show the room UI
  return (
    <div>
      <LiveKitRoom
        token={connectionDetails.token}
        serverUrl={connectionDetails.ws_url}
        connect={true}
        connectOptions={{ autoSubscribe: false }}
        options={{ expWebAudioMix: { audioContext } }}
      >
        <WebAudioContext.Provider value={audioContext}>
          <div className="flex h-screen w-screen">
            <div
              className={`flex ${
                isMobile ? "flex-col-reverse" : "flex-col"
              } w-full h-full`}
            >
              <div className="bg-neutral">
                <BottomBar />
        	      <Transcriber></Transcriber>
                <RemoteParticipantController></RemoteParticipantController>
              </div>
            </div>
          </div>
        </WebAudioContext.Provider>
        <RoomAudioRenderer/>
      </LiveKitRoom>
    </div>
  );
}
