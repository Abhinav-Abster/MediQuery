"use client";

export default function GlitchText({
  children,
  speed = 1,
  enableShadows = true,
  enableOnHover = true,
  className = "",
}) {
  const inlineStyles = {
    "--after-duration": `${speed * 3}s`,
    "--before-duration": `${speed * 2}s`,
    "--after-shadow": enableShadows ? "-5px 0 var(--accent)" : "none",
    "--before-shadow": enableShadows ? "5px 0 var(--teal)" : "none",
  };

  const hoverClass = enableOnHover ? "glitch-hover-only" : "";

  return (
    <div
      className={`glitch-text ${hoverClass} ${className}`}
      style={inlineStyles}
      data-text={children}
    >
      {children}
    </div>
  );
}
