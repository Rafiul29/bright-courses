"use client";

import ReactPlayer from "react-player/youtube";
import { useEffect, useState } from "react";
import { Router } from "lucide-react";
import { useRouter } from "next/navigation";

const LessonVideo = ({ courseId, lesson, module }) => {
  const [hasWindow, setHasWindow] = useState(false);
  const [started, setStarted] = useState(false);
  const [ended, setEnded] = useState(false);
  const [duration, setDuration] = useState(0);

  const router = useRouter()

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasWindow(true);
    }
  }, []);

  useEffect(() => {
    async function updateLessonWatch() {
      const response = await fetch("/api/lesson-watch", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          lastTime: 0,
          lessonId: lesson.id,
          moduleSlug: module,
          state: "started",
          courseId: courseId,
        }),
      });

      if (response.status == 200) {
        const result = await response.text();
        console.log(result);
        setStarted(true);
      }
    }

    started && updateLessonWatch();
  }, [started]);

  useEffect(() => {
    async function updateLessonWatch() {
      const response = await fetch("/api/lesson-watch", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          lastTime: 0,
          lessonId: lesson.id,
          moduleSlug: module,
          state: "completed",
          courseId: courseId,
        }),
      });

      if (response.status == 200) {
        const result = await response.text();
        console.log(result);
        setEnded(false);
        router.refresh()
      }
    }
    ended && updateLessonWatch();
  }, [ended]);

  const handleOnStart = () => {
    setStarted(true);
    console.log("Video started");
  };

  const handleOnEnded = () => {
    setEnded(true);
    console.log("Video ended");
  };

  const handleOnDuration = (duration) => {
    setDuration(duration);
  };

  const handleOnProgress = (state) => console.log("Video progress:", state);

  const handleOnReady = (player) => {
    const duration = player.getDuration(); // Manually fetch duration
    console.log("Video duration:", duration);
  };

  return (
    <>
      {hasWindow && lesson?.video_url && (
        <ReactPlayer
          url={lesson.video_url}
          width="100%"
          height="470px"
          loop={false}
          controls
          playing // Ensures autoplay
          onStart={handleOnStart}
          onReady={handleOnReady} // Use onReady to get duration
          onDuration={handleOnDuration}
          onProgress={handleOnProgress}
          onEnded={handleOnEnded}
        />
      )}
    </>
  );
};

export default LessonVideo;


