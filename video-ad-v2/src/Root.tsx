import { Composition } from "remotion";
import { ClowdbotAd } from "./ClowdbotAd";
import { ClowdbotAdV2 } from "./ClowdbotAdV2";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ClowdbotAd"
        component={ClowdbotAd}
        durationInFrames={450} // 15 seconds at 30fps
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="ClowdbotAdV2"
        component={ClowdbotAdV2}
        durationInFrames={900} // 30 seconds at 30fps
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
