"use client";

import { useEffect, useRef } from "react";

const VIDEO_SRC = "/videos/magali-brand.mp4";

export function HomeHeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      if (media.matches) {
        video.pause();
        video.removeAttribute("autoplay");
        video.setAttribute("controls", "");
      } else {
        video.removeAttribute("controls");
        void video.play().catch(() => {
          video.setAttribute("controls", "");
        });
      }
    };

    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden border border-border bg-ink sm:aspect-video lg:aspect-[16/10]">
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label="Magali brand film — botanical hair care and wellness"
      >
        <source src={VIDEO_SRC} type="video/mp4" />
      </video>
    </div>
  );
}
