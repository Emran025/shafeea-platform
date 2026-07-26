import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';
import BlockRenderer from '../blocks/BlockRenderer';
import LabelPill from '../ui/LabelPill';
import { getTextField } from '../../utils/blockFields';
import type { SectionPayload, BlockPayload, PageCore, VideoEmbedFields } from '../../types/engine';

interface Props { section: SectionPayload; blocks: BlockPayload[]; page: PageCore; }

interface CustomPlayerProps {
    src: string;
}

function CustomVideoPlayer({ src }: CustomPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);

    useEffect(() => {
        let timeoutId: number;

        const handleMouseMove = () => {
            setShowControls(true);
            clearTimeout(timeoutId);
            if (isPlaying) {
                timeoutId = window.setTimeout(() => {
                    setShowControls(false);
                }, 2500);
            }
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener('mousemove', handleMouseMove);
            container.addEventListener('mouseleave', () => {
                if (isPlaying) {
                    setShowControls(false);
                }
            });
        }

        return () => {
            if (container) {
                container.removeEventListener('mousemove', handleMouseMove);
            }
            clearTimeout(timeoutId);
        };
    }, [isPlaying]);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    const togglePlay = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        const video = videoRef.current;
        if (!video) return;

        if (isPlaying) {
            video.pause();
            setIsPlaying(false);
        } else {
            video.play().then(() => {
                setIsPlaying(true);
            }).catch(err => {
                console.error("Play failed:", err);
            });
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = parseFloat(e.target.value);
        setCurrentTime(time);
        if (videoRef.current) {
            videoRef.current.currentTime = time;
        }
    };

    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation();
        const video = videoRef.current;
        if (!video) return;

        const nextMute = !isMuted;
        video.muted = nextMute;
        setIsMuted(nextMute);
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const vol = parseFloat(e.target.value);
        setVolume(vol);
        const video = videoRef.current;
        if (video) {
            video.volume = vol;
            video.muted = vol === 0;
            setIsMuted(vol === 0);
        }
    };

    const toggleFullscreen = (e: React.MouseEvent) => {
        e.stopPropagation();
        const container = containerRef.current;
        if (!container) return;

        if (!document.fullscreenElement) {
            container.requestFullscreen().catch(err => {
                console.error("Error attempting to enable full-screen mode:", err);
            });
        } else {
            document.exitFullscreen();
        }
    };

    const formatTime = (timeInSeconds: number) => {
        if (isNaN(timeInSeconds)) return '0:00';
        const mins = Math.floor(timeInSeconds / 60);
        const secs = Math.floor(timeInSeconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div 
            ref={containerRef} 
            className="custom-player"
            onClick={() => togglePlay()}
        >
            <video
                ref={videoRef}
                src={src}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
                playsInline
            />

            <div className={`custom-player__overlay ${(!isPlaying || showControls) ? 'custom-player__overlay--visible' : ''}`}>
                <button 
                    className="custom-player__center-btn"
                    onClick={togglePlay}
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                    {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" style={{ marginLeft: 3 }} />}
                </button>
            </div>

            <div 
                className={`custom-player__controls ${showControls ? 'custom-player__controls--visible' : ''}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="custom-player__timeline-container">
                    <input
                        type="range"
                        min={0}
                        max={duration || 100}
                        value={currentTime}
                        onChange={handleSeek}
                        className="custom-player__timeline-slider"
                        style={{
                            background: `linear-gradient(to right, var(--brand-gold) 0%, var(--brand-gold) ${duration ? (currentTime / duration) * 100 : 0}%, rgba(255, 255, 255, 0.25) ${duration ? (currentTime / duration) * 100 : 0}%, rgba(255, 255, 255, 0.25) 100%)`
                        }}
                    />
                </div>

                <div className="custom-player__control-row">
                    <div className="custom-player__group">
                        <button 
                            className="custom-player__btn"
                            onClick={togglePlay}
                            aria-label={isPlaying ? 'Pause' : 'Play'}
                        >
                            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                        </button>

                        <div className="custom-player__volume-container">
                            <button 
                                className="custom-player__btn"
                                onClick={toggleMute}
                                aria-label={isMuted ? 'Unmute' : 'Mute'}
                            >
                                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                            </button>
                            <input
                                type="range"
                                min={0}
                                max={1}
                                step={0.05}
                                value={isMuted ? 0 : volume}
                                onChange={handleVolumeChange}
                                className="custom-player__volume-slider"
                            />
                        </div>

                        <span className="custom-player__time">
                            {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                    </div>

                    <div className="custom-player__group">
                        <button 
                            className="custom-player__btn"
                            onClick={toggleFullscreen}
                            aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                        >
                            {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * VideoFeatureSection — video_feature
 * Prominent video presentation section: centred header (label + headline + body)
 * followed by a large, framed video player. Supports both embed URLs (video_embed
 * block) and uploaded video assets (media block with type=video).
 */
export default function VideoFeatureSection({ blocks }: Props) {
    const label    = blocks.find(b => b.type === 'label');
    const headline = blocks.find(b => b.type === 'headline');
    const richText = blocks.find(b => b.type === 'rich_text');
    const videoEmbed = blocks.find(b => b.type === 'video_embed');
    const mediaVideo = blocks.find(b => b.type === 'media' && b.media?.type?.startsWith('video'));
    const captionBlock = blocks.find(b => b.type === 'caption');

    const embedFields  = videoEmbed ? (videoEmbed.fields as unknown as VideoEmbedFields) : null;
    const embedUrl     = embedFields?.video_url ?? null;
    const uploadedUrl  = mediaVideo?.media?.variants?.[0]?.url ?? null;
    const captionText  = embedFields?.caption
        ?? (captionBlock ? getTextField(captionBlock, 'text') : null);

    const hasSideBySide = (label || headline || richText) && (embedUrl || uploadedUrl);

    if (hasSideBySide) {
        return (
            <div className="container">
                <div className="video-feature__split">
                    <motion.div
                        initial={{ opacity: 0, x: -24 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="video-feature__split-content"
                    >
                        {label && <LabelPill text={getTextField(label, 'text')} variant="light" />}
                        {headline && (
                            <h2 className="video-feature__headline">
                                {getTextField(headline, 'text')}
                            </h2>
                        )}
                        {richText && (
                            <div className="video-feature__body">
                                <BlockRenderer block={richText} />
                            </div>
                        )}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 24 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="video-feature__split-media"
                    >
                        <div className="video-feature__frame">
                            {embedUrl ? (
                                <iframe
                                    src={embedUrl}
                                    title={captionText || 'Video player'}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            ) : (
                                <CustomVideoPlayer src={uploadedUrl!} />
                            )}
                        </div>
                        {captionText && (
                            <p className="video-feature__caption">{captionText}</p>
                        )}
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            {(label || headline || richText) && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="video-feature__header"
                >
                    {label && <LabelPill text={getTextField(label, 'text')} variant="light" />}
                    {headline && (
                        <h2 className="video-feature__headline">
                            {getTextField(headline, 'text')}
                        </h2>
                    )}
                    {richText && (
                        <div className="video-feature__body">
                            <BlockRenderer block={richText} />
                        </div>
                    )}
                </motion.div>
            )}

            {(embedUrl || uploadedUrl) && (
                <motion.div
                    initial={{ opacity: 0, y: 36 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.8, delay: 0.12 }}
                >
                    <div className="video-feature__frame">
                        {embedUrl ? (
                            <iframe
                                src={embedUrl}
                                title={captionText || 'Video player'}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        ) : (
                            <CustomVideoPlayer src={uploadedUrl!} />
                        )}
                    </div>
                    {captionText && (
                        <p className="video-feature__caption">{captionText}</p>
                    )}
                </motion.div>
            )}
        </div>
    );
}
