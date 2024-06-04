import { useRemoteParticipants  } from "@livekit/components-react";
import { ParticipantEvent  } from "livekit-client";

export function RemoteParticipantController() {
  const remoteParticipants = useRemoteParticipants({});
  for (const rp of remoteParticipants) {
    const onIsSpeakingChanged = () => {
      //说话回调
    };

    rp.addListener(ParticipantEvent.IsSpeakingChanged, onIsSpeakingChanged)
  }

  return (
    <div>
    </div>
);
}