"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  X,
  Image as ImageIcon,
  Video as VideoIcon,
  Loader2,
  CheckCircle2,
  Film,
  Sparkles,
  Plus,
} from "lucide-react";

export interface PhotoUploadProps {
  onPhotoUploaded: (url: string | null) => void;
  onVideoUploaded?: (url: string | null) => void;
  initialUrl?: string;
  initialPhotoUrl?: string;
  initialVideoUrl?: string;
}

export function PhotoUpload({
  onPhotoUploaded,
  onVideoUploaded,
  initialUrl,
  initialPhotoUrl,
  initialVideoUrl,
}: PhotoUploadProps) {
  // Photo State
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    initialPhotoUrl || initialUrl || null
  );
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [photoSize, setPhotoSize] = useState<string | null>(null);
  const [isPhotoUploading, setIsPhotoUploading] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Video State
  const [videoPreview, setVideoPreview] = useState<string | null>(
    initialVideoUrl || null
  );
  const [videoName, setVideoName] = useState<string | null>(null);
  const [videoSize, setVideoSize] = useState<string | null>(null);
  const [isVideoUploading, setIsVideoUploading] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Drag and drop state
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if ((initialPhotoUrl || initialUrl) && !photoPreview) {
      setPhotoPreview(initialPhotoUrl || initialUrl || null);
    }
  }, [initialPhotoUrl, initialUrl]);

  useEffect(() => {
    if (initialVideoUrl && !videoPreview) {
      setVideoPreview(initialVideoUrl);
    }
  }, [initialVideoUrl]);

  // Handle Photo File Selection
  const processPhotoFile = (file: File) => {
    setPhotoError(null);

    const validMimes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/heic",
      "image/gif",
    ];
    if (!validMimes.includes(file.type) && !file.type.startsWith("image/")) {
      setPhotoError("Please upload a valid image file (JPEG, PNG, WebP).");
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setPhotoError("Photo size must be under 15MB.");
      return;
    }

    setPhotoName(file.name);
    setPhotoSize((file.size / (1024 * 1024)).toFixed(2) + " MB");
    setIsPhotoUploading(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Url = event.target?.result as string;
      setPhotoPreview(base64Url);
      onPhotoUploaded(base64Url);
      setIsPhotoUploading(false);

      try {
        const formData = new FormData();
        formData.append("photo", file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        if (res.ok) {
          const data = await res.json();
          if (data.url) {
            onPhotoUploaded(data.url);
          }
        }
      } catch (err) {
        console.warn("Async photo upload warning:", err);
      }
    };

    reader.onerror = () => {
      setPhotoError("Failed to read image file.");
      setIsPhotoUploading(false);
    };

    reader.readAsDataURL(file);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processPhotoFile(file);
  };

  const handleRemovePhoto = () => {
    setPhotoPreview(null);
    setPhotoName(null);
    setPhotoSize(null);
    onPhotoUploaded(null);
    if (photoInputRef.current) {
      photoInputRef.current.value = "";
    }
  };

  // Handle Video File Selection
  const processVideoFile = async (file: File) => {
    setVideoError(null);

    const validVideoMimes = [
      "video/mp4",
      "video/webm",
      "video/quicktime",
      "video/ogg",
      "video/x-msvideo",
      "video/3gpp",
    ];
    if (!validVideoMimes.includes(file.type) && !file.type.startsWith("video/")) {
      setVideoError("Please upload a valid video file (MP4, WebM, MOV).");
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      setVideoError("Video size must be under 100MB.");
      return;
    }

    setVideoName(file.name);
    setVideoSize((file.size / (1024 * 1024)).toFixed(2) + " MB");
    setIsVideoUploading(true);

    const localUrl = URL.createObjectURL(file);
    setVideoPreview(localUrl);
    if (onVideoUploaded) {
      onVideoUploaded(localUrl);
    }

    try {
      const formData = new FormData();
      formData.append("video", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          setVideoPreview(data.url);
          if (onVideoUploaded) {
            onVideoUploaded(data.url);
          }
        }
      }
    } catch (err) {
      console.warn("Async video upload notice:", err);
    } finally {
      setIsVideoUploading(false);
    }
  };

  const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processVideoFile(file);
  };

  const handleRemoveVideo = () => {
    setVideoPreview(null);
    setVideoName(null);
    setVideoSize(null);
    if (onVideoUploaded) {
      onVideoUploaded(null);
    }
    if (videoInputRef.current) {
      videoInputRef.current.value = "";
    }
  };

  // Drag and drop handler for either file type
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (!files.length) return;

    for (const file of files) {
      if (file.type.startsWith("image/")) {
        processPhotoFile(file);
      } else if (file.type.startsWith("video/")) {
        processVideoFile(file);
      }
    }
  };

  const hasMedia = !!photoPreview || !!videoPreview;

  return (
    <div className="space-y-4">
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={photoInputRef}
        onChange={handlePhotoChange}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={videoInputRef}
        onChange={handleVideoChange}
        accept="video/*,video/mp4,video/webm,video/quicktime"
        className="hidden"
      />

      {/* Section Header */}
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span>Media Evidence (Photo or Video)</span>
            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
              Optional
            </span>
          </h3>
          {hasMedia && (
            <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              {photoPreview && videoPreview
                ? "Both Photo & Video Added"
                : photoPreview
                ? "Photo Added"
                : "Video Added"}
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          You can add a photo, a video, or both in this section — it's entirely your choice.
        </p>
      </div>

      {/* UNIFIED CONTAINER */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`rounded-3xl border-2 transition-all p-5 sm:p-6 ${
          isDragging
            ? "border-blue-500 bg-blue-50/50 shadow-md"
            : hasMedia
            ? "border-slate-200 bg-white shadow-xs"
            : "border-dashed border-slate-300 hover:border-blue-400 bg-slate-50/70"
        }`}
      >
        {/* CASE 1: NO MEDIA UPLOADED YET */}
        {!hasMedia ? (
          <div className="py-6 text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-xs">
                <ImageIcon className="w-6 h-6" />
              </div>
              <span className="text-slate-300 font-bold text-sm">/</span>
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-xs">
                <VideoIcon className="w-6 h-6" />
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-800">
                Upload Evidence (Photo or Video)
              </p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Drag and drop your file here, or choose to upload a photograph or a short video recording.
              </p>
            </div>

            {/* Side-by-side action buttons inside the same single card */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-md mx-auto">
              <button
                type="button"
                disabled={isPhotoUploading || isVideoUploading}
                onClick={() => photoInputRef.current?.click()}
                className="w-full sm:w-auto px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-xl border border-slate-300 shadow-xs flex items-center justify-center gap-2 transition-all hover:border-blue-500 cursor-pointer"
              >
                {isPhotoUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                    <span>Loading Photo...</span>
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-4 h-4 text-blue-600" />
                    <span>Choose Photo</span>
                  </>
                )}
              </button>

              <button
                type="button"
                disabled={isPhotoUploading || isVideoUploading}
                onClick={() => videoInputRef.current?.click()}
                className="w-full sm:w-auto px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-xl border border-slate-300 shadow-xs flex items-center justify-center gap-2 transition-all hover:border-indigo-500 cursor-pointer"
              >
                {isVideoUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                    <span>Loading Video...</span>
                  </>
                ) : (
                  <>
                    <Film className="w-4 h-4 text-indigo-600" />
                    <span>Choose Video</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-[11px] text-slate-400">
              Supports JPEG, PNG, WebP (up to 15MB) or MP4, WebM, MOV (up to 100MB)
            </p>
          </div>
        ) : (
          /* CASE 2: MEDIA ATTACHED - SHOW IN SAME UNIFIED SECTION */
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Photo Card (if photo attached) */}
              {photoPreview && (
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                      <span>Photo Evidence</span>
                      {photoSize && (
                        <span className="text-[10px] text-slate-500 font-normal">
                          ({photoSize})
                        </span>
                      )}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => photoInputRef.current?.click()}
                        className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
                      >
                        Change
                      </button>
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center gap-0.5 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>

                  <div className="relative w-full h-44 rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shadow-xs">
                    <img
                      src={photoPreview}
                      alt="Uploaded Photo Evidence"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Video Card (if video attached) */}
              {videoPreview && (
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <VideoIcon className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Video Evidence</span>
                      {videoSize && (
                        <span className="text-[10px] text-slate-500 font-normal">
                          ({videoSize})
                        </span>
                      )}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => videoInputRef.current?.click()}
                        className="text-[11px] font-bold text-indigo-600 hover:underline cursor-pointer"
                      >
                        Change
                      </button>
                      <button
                        type="button"
                        onClick={handleRemoveVideo}
                        className="text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center gap-0.5 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>

                  <div className="relative w-full h-44 rounded-xl overflow-hidden border border-slate-200 bg-black shadow-xs">
                    <video
                      src={videoPreview}
                      controls
                      playsInline
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Quick Option to Add the other media type if only one was selected */}
            {!photoPreview && (
              <div className="p-3 bg-blue-50/50 rounded-xl border border-dashed border-blue-200 flex items-center justify-between">
                <span className="text-xs text-blue-900 font-medium flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                  <span>Want to also attach a photo? (Optional)</span>
                </span>
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  className="px-3 py-1 bg-white hover:bg-blue-50 text-blue-700 text-xs font-bold rounded-lg border border-blue-200 shadow-2xs flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Photo</span>
                </button>
              </div>
            )}

            {!videoPreview && (
              <div className="p-3 bg-indigo-50/50 rounded-xl border border-dashed border-indigo-200 flex items-center justify-between">
                <span className="text-xs text-indigo-900 font-medium flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Want to also attach a video clip? (Optional)</span>
                </span>
                <button
                  type="button"
                  onClick={() => videoInputRef.current?.click()}
                  className="px-3 py-1 bg-white hover:bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-200 shadow-2xs flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Video</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Errors */}
        {photoError && (
          <p className="mt-3 text-xs text-rose-600 font-bold bg-rose-50 p-2 rounded-lg border border-rose-200">
            {photoError}
          </p>
        )}
        {videoError && (
          <p className="mt-3 text-xs text-rose-600 font-bold bg-rose-50 p-2 rounded-lg border border-rose-200">
            {videoError}
          </p>
        )}
      </div>
    </div>
  );
}
