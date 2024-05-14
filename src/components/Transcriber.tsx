import { useDataChannel } from '@livekit/components-react';
import { useCallback, useEffect, useState } from 'react';
import type { ReceivedDataMessage } from '@livekit/components-core';

export const Transcriber = () => {
//   const [visible, setVisible] = useState<boolean>(false);
//   const [activity, setActivity] = useState<number>(Date.now());
//   const [transcripts, setTranscripts] = useState<Map<string, string>>(new Map()); // transcription of every participant

  const [value, setValue] = useState<string>();

  const onData = useCallback((message: ReceivedDataMessage) => {
    const decoder = new TextDecoder();
    //const packet = JSON.parse(decoder.decode(message.payload));
    const packet = decoder.decode(message.payload)
    setValue(packet)
  }, []);

  useDataChannel("", onData);

//   useEffect(() => {
//     const currentActivity = activity;
//     const timeout = setTimeout(() => {
//       if (currentActivity == activity) {
//         setVisible(false);
//       }
//     }, 3000);

//     return () => clearTimeout(timeout);
//   }, [activity]);

    return (
        <div className="bg-white left-1/2 pl-4 bottom-32">
            <text>{value}</text>
        </div>
    );

//   return visible ? (
//     <div className="bg-white left-1/2 pl-4 bottom-32">
//         <text>{value}</text>
//     </div>
//   ) : (
//     <> </>
//   );
};


/*
    <Box
      position="fixed"
      left="50%"
      transform="translateX(-50%)"
      paddingX="4px"
      bottom="8rem"
      bgColor="rgba(255, 255, 255, 0.12)"
    >

*/
