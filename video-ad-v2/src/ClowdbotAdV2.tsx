import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
  Sequence,
  Audio,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "600", "700", "800"],
  subsets: ["latin"],
});

// Color palette - Digital Persistence
const COLORS = {
  deepIndigo: "#0c1026",
  midnightBlue: "#141e3c",
  twilightPurple: "#28235a",
  terminalGlow: "#64b4ff",
  warmAmber: "#ffb464",
  statusGreen: "#64dca0",
  softWhite: "#f5f8ff",
  mutedGray: "#8c96b4",
  accentPurple: "#8c78ff",
};

// Grid Background
const GridBackground: React.FC = () => {
  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        background: `linear-gradient(180deg, ${COLORS.deepIndigo} 0%, ${COLORS.midnightBlue} 100%)`,
      }}
    >
      <svg width="100%" height="100%" style={{ position: "absolute", opacity: 0.15 }}>
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={COLORS.twilightPurple} strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
};

// Terminal Window Component
const Terminal: React.FC<{ text: string; showCursor: boolean; progress: number }> = ({
  text,
  showCursor,
  progress,
}) => {
  const visibleChars = Math.floor(text.length * progress);
  const displayText = text.slice(0, visibleChars);

  return (
    <div
      style={{
        backgroundColor: "#12162a",
        borderRadius: 16,
        border: `2px solid ${COLORS.twilightPurple}`,
        width: 800,
        boxShadow: `0 0 60px rgba(100, 180, 255, 0.15)`,
        overflow: "hidden",
      }}
    >
      {/* Title bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "14px 20px",
          backgroundColor: "#1c2240",
          borderBottom: `1px solid ${COLORS.twilightPurple}`,
        }}
      >
        <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#ff5f55" }} />
        <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#ffbd2e" }} />
        <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#27c93f" }} />
        <span style={{ marginLeft: 12, color: COLORS.mutedGray, fontSize: 14, fontFamily }}>
          terminal
        </span>
      </div>
      {/* Content */}
      <div style={{ padding: 24, minHeight: 120 }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ color: COLORS.statusGreen, marginRight: 12, fontSize: 18 }}>▸</span>
          <span style={{ color: COLORS.softWhite, fontSize: 20, fontFamily: "monospace" }}>
            {displayText}
          </span>
          {showCursor && (
            <span
              style={{
                display: "inline-block",
                width: 12,
                height: 24,
                backgroundColor: COLORS.warmAmber,
                marginLeft: 2,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Cloud Shape
const Cloud: React.FC<{ scale: number; opacity: number }> = ({ scale, opacity }) => {
  return (
    <div style={{ transform: `scale(${scale})`, opacity }}>
      <svg width="300" height="200" viewBox="0 0 300 200">
        <defs>
          <linearGradient id="cloudGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={COLORS.twilightPurple} stopOpacity="0.8" />
            <stop offset="100%" stopColor={COLORS.midnightBlue} stopOpacity="0.6" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="8" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <ellipse cx="150" cy="120" rx="120" ry="60" fill="url(#cloudGradient)" filter="url(#glow)" />
        <ellipse cx="90" cy="130" rx="70" ry="50" fill="url(#cloudGradient)" />
        <ellipse cx="210" cy="130" rx="70" ry="50" fill="url(#cloudGradient)" />
        <ellipse cx="150" cy="90" rx="80" ry="50" fill={COLORS.twilightPurple} opacity="0.7" />
      </svg>
    </div>
  );
};

// Shield Icon for "Safe & Secure"
const ShieldIcon: React.FC<{ opacity: number }> = ({ opacity }) => (
  <svg width="80" height="90" viewBox="0 0 24 24" fill="none" style={{ opacity }}>
    <path
      d="M12 2L4 6v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V6l-8-4z"
      fill={COLORS.statusGreen}
      opacity={0.3}
    />
    <path
      d="M12 2L4 6v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V6l-8-4z"
      stroke={COLORS.statusGreen}
      strokeWidth="1.5"
      fill="none"
    />
    <path d="M9 12l2 2 4-4" stroke={COLORS.statusGreen} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// Message Icon
const MessageIcon: React.FC<{ opacity: number }> = ({ opacity }) => (
  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" style={{ opacity }}>
    <path
      d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
      fill={COLORS.terminalGlow}
      opacity={0.3}
    />
    <path
      d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
      stroke={COLORS.terminalGlow}
      strokeWidth="1.5"
      fill="none"
    />
  </svg>
);

// Family Icon
const FamilyIcon: React.FC<{ scale: number; opacity: number }> = ({ scale, opacity }) => (
  <div style={{ transform: `scale(${scale})`, opacity }}>
    <svg width="120" height="100" viewBox="0 0 24 20" fill="none">
      <circle cx="12" cy="5" r="3" fill={COLORS.accentPurple} opacity={0.8} />
      <circle cx="5" cy="8" r="2.5" fill={COLORS.terminalGlow} opacity={0.8} />
      <circle cx="19" cy="8" r="2.5" fill={COLORS.statusGreen} opacity={0.8} />
      <path
        d="M12 10c-2.5 0-4.5 2-4.5 4.5V18h9v-3.5c0-2.5-2-4.5-4.5-4.5z"
        fill={COLORS.accentPurple}
        opacity={0.6}
      />
      <path
        d="M5 12c-1.5 0-3 1.5-3 3v3h5v-2.5c0-1-.3-2-.8-2.8-.5-.5-1.2-.7-1.2-.7z"
        fill={COLORS.terminalGlow}
        opacity={0.6}
      />
      <path
        d="M19 12c1.5 0 3 1.5 3 3v3h-5v-2.5c0-1 .3-2 .8-2.8.5-.5 1.2-.7 1.2-.7z"
        fill={COLORS.statusGreen}
        opacity={0.6}
      />
    </svg>
  </div>
);

// Main Composition
export const ClowdbotAdV2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene timing (30 seconds total at 30fps = 900 frames)
  const SCENE_1_END = 4 * fps; // 0-4s: Hook (terminal typing)
  const SCENE_2_END = 7 * fps; // 4-7s: Problem statement
  const SCENE_3_END = 11 * fps; // 7-11s: Solution + Cloud
  const SCENE_4_END = 16 * fps; // 11-16s: Benefits (Safe, Secure, Messages)
  const SCENE_5_END = 22 * fps; // 16-22s: Family angle
  const SCENE_6_END = 27 * fps; // 22-27s: Value prop
  // 27-30s: CTA

  // Animations
  const hookTextProgress = interpolate(frame, [0, 3.5 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });

  const hookFadeOut = interpolate(frame, [SCENE_1_END - 15, SCENE_1_END], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const problemFadeIn = interpolate(frame, [SCENE_1_END, SCENE_1_END + 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const problemFadeOut = interpolate(frame, [SCENE_2_END - 15, SCENE_2_END], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const solutionFadeIn = interpolate(frame, [SCENE_2_END, SCENE_2_END + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const solutionFadeOut = interpolate(frame, [SCENE_3_END - 15, SCENE_3_END], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cloudScale = spring({
    frame: frame - SCENE_2_END - 10,
    fps,
    config: { damping: 200 },
  });

  // Benefits animations
  const benefitsVisible = frame >= SCENE_3_END;
  const safeSecureSpring = spring({
    frame: frame - SCENE_3_END,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  const messageSpring = spring({
    frame: frame - SCENE_3_END - 30,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  const benefitsFadeOut = interpolate(frame, [SCENE_4_END - 15, SCENE_4_END], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Family scene
  const familyFadeIn = interpolate(frame, [SCENE_4_END, SCENE_4_END + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const familySpring = spring({
    frame: frame - SCENE_4_END,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  const familyFadeOut = interpolate(frame, [SCENE_5_END - 15, SCENE_5_END], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Value prop
  const valueSpring = spring({
    frame: frame - SCENE_5_END,
    fps,
    config: { damping: 12, stiffness: 80 },
  });

  // CTA
  const ctaSpring = spring({
    frame: frame - SCENE_6_END,
    fps,
    config: { damping: 200 },
  });

  // Cursor blink
  const cursorBlink = Math.floor(frame / 15) % 2 === 0;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      {/* Background */}
      <GridBackground />

      {/* Scene voiceovers - each synced to its visual scene */}
      <Sequence from={0}>
        <Audio src={staticFile("clowdbot-ad-v2-scene1.mp3")} />
      </Sequence>
      <Sequence from={SCENE_1_END}>
        <Audio src={staticFile("clowdbot-ad-v2-scene2.mp3")} />
      </Sequence>
      <Sequence from={SCENE_2_END}>
        <Audio src={staticFile("clowdbot-ad-v2-scene3.mp3")} />
      </Sequence>
      <Sequence from={SCENE_3_END}>
        <Audio src={staticFile("clowdbot-ad-v2-scene4.mp3")} />
      </Sequence>
      <Sequence from={SCENE_4_END}>
        <Audio src={staticFile("clowdbot-ad-v2-scene5.mp3")} />
      </Sequence>
      <Sequence from={SCENE_5_END}>
        <Audio src={staticFile("clowdbot-ad-v2-scene6.mp3")} />
      </Sequence>
      <Sequence from={SCENE_6_END}>
        <Audio src={staticFile("clowdbot-ad-v2-scene7.mp3")} />
      </Sequence>

      {/* Keyboard sound at start */}
      <Sequence from={0} durationInFrames={3.5 * fps}>
        <Audio src={staticFile("keyboard.mp3")} volume={0.4} />
      </Sequence>

      {/* Whoosh at scene transitions */}
      <Sequence from={SCENE_1_END - 10} durationInFrames={fps}>
        <Audio src={staticFile("whoosh.mp3")} volume={0.3} />
      </Sequence>
      <Sequence from={SCENE_2_END - 10} durationInFrames={fps}>
        <Audio src={staticFile("whoosh.mp3")} volume={0.25} />
      </Sequence>
      <Sequence from={SCENE_3_END - 10} durationInFrames={fps}>
        <Audio src={staticFile("whoosh.mp3")} volume={0.25} />
      </Sequence>
      <Sequence from={SCENE_4_END - 10} durationInFrames={fps}>
        <Audio src={staticFile("whoosh.mp3")} volume={0.25} />
      </Sequence>
      <Sequence from={SCENE_5_END - 10} durationInFrames={fps}>
        <Audio src={staticFile("whoosh.mp3")} volume={0.25} />
      </Sequence>

      {/* Scene 1: Hook - Terminal with punchy text */}
      {frame < SCENE_1_END + 15 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            opacity: hookFadeOut,
          }}
        >
          <Terminal
            text="Your AI assistant ghosts you the moment you close your laptop."
            showCursor={cursorBlink}
            progress={hookTextProgress}
          />
        </AbsoluteFill>
      )}

      {/* Scene 2: Problem - emphasize the pain */}
      {frame >= SCENE_1_END && frame < SCENE_2_END + 15 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            opacity: problemFadeIn * problemFadeOut,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <h2
              style={{
                fontSize: 64,
                color: COLORS.mutedGray,
                margin: 0,
                fontWeight: 600,
              }}
            >
              No memory. No follow-through.
            </h2>
            <h2
              style={{
                fontSize: 72,
                color: COLORS.warmAmber,
                marginTop: 20,
                fontWeight: 700,
              }}
            >
              Just... gone.
            </h2>
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 3: Solution - "What if your Claude stayed?" */}
      {frame >= SCENE_2_END && frame < SCENE_3_END + 15 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            opacity: solutionFadeIn * solutionFadeOut,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <h2
              style={{
                fontSize: 72,
                color: COLORS.softWhite,
                marginBottom: 60,
                fontWeight: 600,
              }}
            >
              What if your Clawdbot{" "}
              <span style={{ color: COLORS.terminalGlow }}>stayed</span>?
            </h2>
            <Cloud scale={cloudScale} opacity={cloudScale} />
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 4: Benefits - Safe, Secure, Messages */}
      {benefitsVisible && frame < SCENE_4_END + 15 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            opacity: benefitsFadeOut,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 120,
              alignItems: "center",
            }}
          >
            {/* Safe & Secure */}
            <div
              style={{
                textAlign: "center",
                transform: `translateY(${interpolate(safeSecureSpring, [0, 1], [40, 0])}px)`,
                opacity: safeSecureSpring,
              }}
            >
              <ShieldIcon opacity={1} />
              <h3
                style={{
                  fontSize: 48,
                  color: COLORS.statusGreen,
                  marginTop: 20,
                  fontWeight: 700,
                }}
              >
                Safe & Secure
              </h3>
              <p style={{ fontSize: 28, color: COLORS.mutedGray, marginTop: 10 }}>
                Always on
              </p>
            </div>

            {/* Messages You Back */}
            <div
              style={{
                textAlign: "center",
                transform: `translateY(${interpolate(messageSpring, [0, 1], [40, 0])}px)`,
                opacity: messageSpring,
              }}
            >
              <MessageIcon opacity={1} />
              <h3
                style={{
                  fontSize: 48,
                  color: COLORS.terminalGlow,
                  marginTop: 20,
                  fontWeight: 700,
                }}
              >
                Messages You
              </h3>
              <p style={{ fontSize: 28, color: COLORS.mutedGray, marginTop: 10 }}>
                When it's done
              </p>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 5: Family angle */}
      {frame >= SCENE_4_END && frame < SCENE_5_END + 15 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            opacity: familyFadeIn * familyFadeOut,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <FamilyIcon scale={familySpring} opacity={familySpring} />
            <h2
              style={{
                fontSize: 64,
                color: COLORS.softWhite,
                marginTop: 40,
                fontWeight: 600,
                transform: `translateY(${interpolate(familySpring, [0, 1], [30, 0])}px)`,
                opacity: familySpring,
              }}
            >
              An AI assistant your{" "}
              <span style={{ color: COLORS.accentPurple }}>whole family</span>
            </h2>
            <h2
              style={{
                fontSize: 64,
                color: COLORS.softWhite,
                fontWeight: 600,
                transform: `translateY(${interpolate(familySpring, [0, 1], [30, 0])}px)`,
                opacity: familySpring,
              }}
            >
              can trust.
            </h2>
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 6 & 7: Value prop + CTA */}
      {frame >= SCENE_5_END && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: 100,
          }}
        >
          <div
            style={{
              transform: `translateY(${interpolate(valueSpring, [0, 1], [50, 0])}px)`,
              opacity: valueSpring,
              textAlign: "center",
            }}
          >
            <h1
              style={{
                fontSize: 96,
                fontWeight: 800,
                color: COLORS.softWhite,
                margin: 0,
                lineHeight: 1.1,
              }}
            >
              Your Claude.
            </h1>
            <h1
              style={{
                fontSize: 96,
                fontWeight: 800,
                color: COLORS.terminalGlow,
                margin: 0,
              }}
            >
              Always On.
            </h1>

            {/* Price badge */}
            <div
              style={{
                marginTop: 50,
                transform: `scale(${valueSpring})`,
                opacity: valueSpring,
              }}
            >
              <p
                style={{
                  fontSize: 36,
                  color: COLORS.mutedGray,
                  margin: 0,
                }}
              >
                $0.50 to launch · Pay only for what you use
              </p>
            </div>

            {/* CTA - appears at end */}
            {frame >= SCENE_6_END && (
              <div
                style={{
                  marginTop: 60,
                  opacity: ctaSpring,
                  transform: `translateY(${interpolate(ctaSpring, [0, 1], [20, 0])}px)`,
                }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 16,
                    backgroundColor: COLORS.terminalGlow,
                    padding: "20px 48px",
                    borderRadius: 16,
                  }}
                >
                  <span style={{ fontSize: 32, fontWeight: 700, color: COLORS.deepIndigo }}>
                    clowd.bot
                  </span>
                </div>
              </div>
            )}
          </div>
        </AbsoluteFill>
      )}

      {/* Brand watermark - always visible */}
      <div
        style={{
          position: "absolute",
          top: 40,
          right: 60,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <span style={{ fontSize: 32 }}>☁️🦞</span>
        <span style={{ fontSize: 28, fontWeight: 700, color: COLORS.softWhite }}>Clowdbot</span>
      </div>
    </AbsoluteFill>
  );
};
