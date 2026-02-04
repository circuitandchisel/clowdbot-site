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
      {/* Grid lines */}
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
        width: 600,
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
          <span style={{ color: COLORS.softWhite, fontSize: 18, fontFamily: "monospace" }}>
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

// Main Composition
export const ClowdbotAd: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Scene timing (in seconds)
  const SCENE_1_END = 3 * fps; // 0-3s: Hook
  const SCENE_2_END = 6 * fps; // 3-6s: Solution
  const SCENE_3_END = 10 * fps; // 6-10s: Product reveal
  const SCENE_4_END = 13 * fps; // 10-13s: Value prop
  // 13-15s: CTA

  // Animations
  const hookTextProgress = interpolate(frame, [0, 2.5 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });

  const problemFadeOut = interpolate(frame, [SCENE_1_END - 15, SCENE_1_END], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const solutionFadeIn = interpolate(frame, [SCENE_1_END, SCENE_1_END + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const solutionFadeOut = interpolate(frame, [SCENE_2_END - 15, SCENE_2_END], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cloudScale = spring({
    frame: frame - SCENE_1_END,
    fps,
    config: { damping: 200 },
  });

  const headlineSpring = spring({
    frame: frame - SCENE_2_END,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const priceSpring = spring({
    frame: frame - SCENE_3_END,
    fps,
    config: { damping: 12, stiffness: 80 },
  });

  const ctaSpring = spring({
    frame: frame - SCENE_4_END,
    fps,
    config: { damping: 200 },
  });

  // Cursor blink
  const cursorBlink = Math.floor(frame / 15) % 2 === 0;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      {/* Background */}
      <GridBackground />

      {/* Audio */}
      <Audio src={staticFile("voiceover.mp3")} />

      {/* Keyboard sound at start */}
      <Sequence from={0} durationInFrames={2 * fps}>
        <Audio src={staticFile("keyboard.mp3")} volume={0.4} />
      </Sequence>

      {/* Whoosh at scene transitions */}
      <Sequence from={SCENE_1_END - 10} durationInFrames={fps}>
        <Audio src={staticFile("whoosh.mp3")} volume={0.3} />
      </Sequence>
      <Sequence from={SCENE_2_END - 10} durationInFrames={fps}>
        <Audio src={staticFile("whoosh.mp3")} volume={0.25} />
      </Sequence>

      {/* Scene 1: Hook - Terminal with problem text */}
      {frame < SCENE_2_END && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            opacity: frame < SCENE_1_END ? 1 : problemFadeOut,
          }}
        >
          <Terminal
            text="Your AI assistant stops when you close your laptop..."
            showCursor={cursorBlink}
            progress={hookTextProgress}
          />
        </AbsoluteFill>
      )}

      {/* Scene 2: Solution - "What if it didn't?" + Cloud */}
      {frame >= SCENE_1_END && frame < SCENE_2_END + 15 && (
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
              What if it didn't?
            </h2>
            <Cloud scale={cloudScale} opacity={cloudScale} />
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 3: Product Reveal - Headline */}
      {frame >= SCENE_2_END && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: 100,
          }}
        >
          <div
            style={{
              transform: `translateY(${interpolate(headlineSpring, [0, 1], [50, 0])}px)`,
              opacity: headlineSpring,
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
              Run Your AI Assistant
            </h1>
            <h1
              style={{
                fontSize: 96,
                fontWeight: 800,
                color: COLORS.terminalGlow,
                margin: 0,
              }}
            >
              24/7
            </h1>

            {/* Price badge - appears in Scene 4 */}
            {frame >= SCENE_3_END && (
              <div
                style={{
                  marginTop: 50,
                  transform: `scale(${priceSpring})`,
                  opacity: priceSpring,
                }}
              >
                <p
                  style={{
                    fontSize: 36,
                    color: COLORS.mutedGray,
                    margin: 0,
                  }}
                >
                  $0.01 to launch · Pay only for what you use
                </p>
              </div>
            )}

            {/* CTA - appears at end */}
            {frame >= SCENE_4_END && (
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
