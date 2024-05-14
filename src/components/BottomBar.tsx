import { useMobile } from "@/util/useMobile";
import { MicrophoneMuteButton } from "./MicrophoneMuteButton";
import { MicrophoneSelector } from "./MicrophoneSelector";

export function BottomBar() {
  const mobile = useMobile();
  return (
    <div className="flex w-full h-full justify-between">
      <div className="flex h-full">
        <MicrophoneMuteButton />
        <div className="">
          <MicrophoneSelector />
        </div>
      </div>
    </div>
  );
}
