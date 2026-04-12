"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function AnimatedCounter({
  value,
  suffix = "",
  prefix = "",
  duration = 2,
  delay = 0,
  className = "",
}) {
  const counterRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Parse numeric value from string like "10K+", "99.2%", "<3s"
  const parseValue = (val) => {
    const cleaned = val.replace(/[^0-9.]/g, "");
    return parseFloat(cleaned) || 0;
  };

  const numericValue = parseValue(value);
  const isDecimal = value.includes(".");
  const hasK = value.includes("K");

  useGSAP(
    () => {
      if (!counterRef.current || hasAnimated) return;

      const obj = { val: 0 };

      gsap.to(obj, {
        val: numericValue,
        duration,
        delay,
        ease: "power2.out",
        scrollTrigger: {
          trigger: counterRef.current,
          start: "top 85%",
          once: true,
        },
        onUpdate: () => {
          if (counterRef.current) {
            let display;
            if (isDecimal) {
              display = obj.val.toFixed(1);
            } else {
              display = Math.round(obj.val).toString();
            }
            // Add K suffix if original had it
            if (hasK) display += "K";
            counterRef.current.textContent =
              prefix + display + suffix;
          }
        },
        onComplete: () => setHasAnimated(true),
      });
    },
    { scope: counterRef, dependencies: [numericValue] }
  );

  return (
    <span ref={counterRef} className={className}>
      {prefix}0{suffix}
    </span>
  );
}
