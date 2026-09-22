"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const VIDEO_WEBM = "/videos/magali-brand.webm";
const VIDEO_MP4 = "/videos/magali-brand.mp4";

export function HomeHeroVideo({
  className,
}: {
  className?: string;
}) {
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
    <video
      ref={videoRef}
      className={cn("object-cover", className)}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden
    >
      <source src={VIDEO_WEBM} type="video/webm" />
      <source src={VIDEO_MP4} type="video/mp4" />
    </video>
  );
}
