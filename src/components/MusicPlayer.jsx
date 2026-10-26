import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * =======================================================================
 * MusicPlayer Component
 * =======================================================================
 * Styled after the Spotify/Apple Music Vinyl player card with the website's
 * mauve (#8c657a / #58323e / #965b79) and cream (#f3e3ce) palette.
 *
 * ASSET SLOTS:
 *  - Song Cover Image: /public/images/musicpic.jpg
 *  - Song Audio File:  /public/audio/song.mp3
 * =======================================================================
 */

export default function MusicPlayer({
  audioSrc = '/audio/song.mp3',
  coverSrc = '/images/musicpic.jpg',
  title = 'Our Song',
  subtitle = 'every word for you',
}) {
  const audioRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Sync volume with audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Toggle Play / Pause
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn('Audio playback failed or blocked:', err);
          setIsPlaying(true);
        });
    }
  };

  // Time update handler
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Metadata loaded (duration)
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  // Song finished
  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  // Seek bar
  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  // Skip 10s backwards
  const handleSkipBack = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
    } else {
      setCurrentTime((prev) => Math.max(0, prev - 10));
    }
  };

  // Skip 10s forwards
  const handleSkipForward = () => {
    if (audioRef.current) {
      const target = duration ? Math.min(duration, audioRef.current.currentTime + 10) : audioRef.current.currentTime + 10;
      audioRef.current.currentTime = target;
    } else {
      setCurrentTime((prev) => prev + 10);
    }
  };

  // Volume slider
  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (newVol > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  // Toggle mute
  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  // Time formatter (mm:ss or -mm:ss)
  const formatTime = (secs, isRemaining = false) => {
    if (isNaN(secs) || secs === 0) return isRemaining ? '-0:00' : '0:00';
    const absSecs = Math.abs(Math.floor(secs));
    const mins = Math.floor(absSecs / 60);
    const remSecs = absSecs % 60;
    const formatted = `${mins}:${remSecs < 10 ? '0' : ''}${remSecs}`;
    return isRemaining ? `-${formatted}` : formatted;
  };

  // Progress percentage
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const remainingTime = duration > 0 ? duration - currentTime : 0;

  return (
    <div className="relative w-full max-w-[360px] sm:max-w-[390px] mx-auto select-none">
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={audioSrc}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        preload="metadata"
      />

      {/* ================= MAIN PLAYER CARD ================= */}
      <div className="relative w-full rounded-[32px] bg-[#24131e]/95 border border-[#58323E]/90 p-5 sm:p-6 shadow-[0_25px_60px_rgba(0,0,0,0.7)] backdrop-blur-md">
        
        {/* ================= 1. VINYL RECORD ARTWORK CONTAINER ================= */}
        <div className="relative w-full aspect-square rounded-2xl bg-white p-3 sm:p-4 flex items-center justify-center overflow-hidden shadow-[inset_0_2px_8px_rgba(0,0,0,0.12)]">
          
          {/* Vinyl Disc with Grooves & Spinning Animation */}
          <div
            className={`relative w-full h-full rounded-full flex items-center justify-center vinyl-spin ${
              isPlaying ? '' : 'vinyl-paused'
            }`}
            style={{
              background: 'radial-gradient(circle, #1a1a1a 0%, #0d0d0d 38%, #262626 40%, #111111 44%, #282828 48%, #141414 55%, #222222 62%, #0a0a0a 70%, #1a1a1a 85%, #050505 100%)',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.45)',
            }}
          >
            {/* Concentric grooved rings on the vinyl */}
            <div className="pointer-events-none absolute inset-[12%] rounded-full border border-white/[0.04]" />
            <div className="pointer-events-none absolute inset-[22%] rounded-full border border-white/[0.06]" />
            <div className="pointer-events-none absolute inset-[30%] rounded-full border border-white/[0.04]" />

            {/* Specular sheen / conic reflection overlay */}
            <div
              className="pointer-events-none absolute inset-0 rounded-full opacity-25"
              style={{
                background:
                  'conic-gradient(from 45deg, transparent 0deg, rgba(255,255,255,0.3) 45deg, transparent 90deg, transparent 180deg, rgba(255,255,255,0.3) 225deg, transparent 270deg)',
              }}
            />

            {/* Center Label (Song Cover Photo & Text) */}
            <div className="relative z-10 w-[48%] h-[48%] rounded-full overflow-hidden border-[3px] border-[#965b79] shadow-[0_0_15px_rgba(0,0,0,0.6)] flex items-center justify-center bg-[#58323E]">
              <img
                src={imageError ? '/images/photo2.jpg' : coverSrc}
                alt={title}
                onError={() => setImageError(true)}
                className="w-full h-full object-cover rounded-full"
              />
              
              {/* Subtle translucent vignette over center photo */}
              <div className="absolute inset-0 bg-[#58323E]/10 rounded-full pointer-events-none" />

              {/* Center spindle hole */}
              <div className="absolute z-20 w-3 h-3 rounded-full bg-[#f3e3ce] border border-black/50 shadow-inner" />
            </div>
          </div>
        </div>

        {/* ================= 2. SONG INFO ================= */}
        <div className="mt-5 text-left">
          <h3 className="font-serif text-2xl font-bold tracking-tight text-[#f3e3ce] drop-shadow-sm">
            {title}
          </h3>
          <p className="mt-1 font-serif italic text-sm sm:text-base font-normal text-[#dcc6ad] tracking-wide">
            {subtitle}
          </p>
        </div>

        {/* ================= 3. TIMELINE & PROGRESS SLIDER ================= */}
        <div className="mt-5">
          <div className="relative w-full flex items-center">
            {/* Background Track */}
            <div className="absolute inset-x-0 h-1 rounded-full bg-[#3a1a2c]" />
            
            {/* Active Mauve Progress Track */}
            <div
              className="absolute left-0 h-1 rounded-full bg-[#965b79] pointer-events-none"
              style={{ width: `${progressPercent}%` }}
            />

            {/* Range Input for Scrubbing */}
            <input
              type="range"
              min="0"
              max={duration || 100}
              step="0.1"
              value={currentTime}
              onChange={handleSeek}
              className="music-range relative z-10"
              aria-label="Song progress"
            />
          </div>

          {/* Time Labels */}
          <div className="mt-2 flex items-center justify-between font-mono text-[11px] text-[#f3e3ce]/75">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(remainingTime, true)}</span>
          </div>
        </div>

        {/* ================= 4. PLAYBACK CONTROLS ================= */}
        <div className="mt-4 flex items-center justify-center gap-7">
          {/* Previous / Skip Back Button */}
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSkipBack}
            className="flex items-center justify-center text-[#f3e3ce]/80 hover:text-[#f3e3ce] transition-colors p-2"
            aria-label="Skip backward 10 seconds"
          >
            <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
              <path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z" />
            </svg>
          </motion.button>

          {/* Mauve Play / Pause Button */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={togglePlay}
            className="flex items-center justify-center w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-[#58323E] text-[#f3e3ce] border border-[#f3e3ce]/30 shadow-[0_0_20px_rgba(88,50,62,0.6)] transition-all hover:bg-[#6e3e4e]"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16" rx="1.5" />
                <rect x="14" y="4" width="4" height="16" rx="1.5" />
              </svg>
            ) : (
              <svg className="w-7 h-7 fill-current ml-1" viewBox="0 0 24 24">
                <polygon points="6 4 20 12 6 20 6 4" />
              </svg>
            )}
          </motion.button>

          {/* Next / Skip Forward Button */}
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSkipForward}
            className="flex items-center justify-center text-[#f3e3ce]/80 hover:text-[#f3e3ce] transition-colors p-2"
            aria-label="Skip forward 10 seconds"
          >
            <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
              <path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z" />
            </svg>
          </motion.button>
        </div>

        {/* ================= 5. VOLUME CONTROLS ================= */}
        <div className="mt-6 flex items-center gap-3 px-1 text-[#f3e3ce]/70">
          {/* Mute / Low Volume Icon */}
          <button
            onClick={toggleMute}
            className="hover:text-[#f3e3ce] transition-colors"
            aria-label="Mute or low volume"
          >
            {isMuted || volume === 0 ? (
              <svg className="w-4 h-4 fill-current text-white/40" viewBox="0 0 24 24">
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M7 9v6h4l5 5V4l-5 5H7z" />
              </svg>
            )}
          </button>

          {/* Volume Slider Track */}
          <div className="relative flex-1 flex items-center">
            <div className="absolute inset-x-0 h-1 rounded-full bg-[#3a1a2c]" />
            <div
              className="absolute left-0 h-1 rounded-full bg-[#965b79] pointer-events-none"
              style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
            />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="music-range relative z-10"
              aria-label="Volume slider"
            />
          </div>

          {/* High Volume Icon */}
          <div className="text-[#f3e3ce]/70">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            </svg>
          </div>
        </div>

      </div>
    </div>
  );
}
