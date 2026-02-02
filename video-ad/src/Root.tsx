import { Composition } from "remotion";
import { ClowdbotAd } from "./ClowdbotAd";

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
    </>
  );
};
