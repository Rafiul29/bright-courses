"use client";

export const VideoPlayer = ({url}) => {
  return (
    <div className="relative aspect-video">
      <iframe
        className="w-full h-full"
        src={url}
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
      ></iframe>
    </div>
  );
};
