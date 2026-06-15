"use client";

import { useCallback, useRef, useState } from "react";

export type RecorderStatus = "idle" | "recording" | "stopped" | "denied";

interface UseMediaRecorder {
  status: RecorderStatus;
  seconds: number;
  audioUrl: string | null;
  start: () => Promise<void>;
  stop: () => void;
  reset: () => void;
  supported: boolean;
}

/**
 * Thin wrapper over the browser MediaRecorder API for voice notes.
 * Produces an object URL the UI can play back. No upload in v1.
 */
export function useMediaRecorder(): UseMediaRecorder {
  const [status, setStatus] = useState<RecorderStatus>("idle");
  const [seconds, setSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const supported =
    typeof window !== "undefined" &&
    typeof navigator !== "undefined" &&
    !!navigator.mediaDevices &&
    typeof window.MediaRecorder !== "undefined";

  const cleanupTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const stopStream = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

  const start = useCallback(async () => {
    if (!supported) {
      setStatus("denied");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return URL.createObjectURL(blob);
        });
      };

      setAudioUrl(null);
      setSeconds(0);
      recorder.start();
      setStatus("recording");
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } catch {
      setStatus("denied");
    }
  }, [supported]);

  const stop = useCallback(() => {
    cleanupTimer();
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    }
    stopStream();
    setStatus("stopped");
  }, []);

  const reset = useCallback(() => {
    cleanupTimer();
    stopStream();
    setAudioUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setSeconds(0);
    setStatus("idle");
  }, []);

  return { status, seconds, audioUrl, start, stop, reset, supported };
}