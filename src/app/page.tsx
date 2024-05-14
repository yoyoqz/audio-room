"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast, Toaster } from "react-hot-toast";

export default function Home() {
  const router = useRouter();
  const [roomName, setRoomName] = useState("");

  const joinRoom = useCallback(() => {
    if (roomName === "") {
      toast.error("Please enter a room name");
      return;
    }
    router.push(`/audio/room/${roomName}`);
  }, [roomName, router]);

  return (
    <main>
      <Toaster />
      <div className="relative flex flex-col items-center justify-center h-screen w-screen">
        <h1 className="text-4xl mb-8 p-2">Audio Room</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            joinRoom();
          }}
        >
          <div className="form-control">
            <div className="input-group">
              <input
                value={roomName}
                onChange={(e) => setRoomName(e.currentTarget.value)}
                type="text"
                placeholder="Room Name"
                className="input input-bordered input-secondary"
              />
              <button className="btn">Enter Room</button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
