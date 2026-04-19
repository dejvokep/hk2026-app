'use client';

import { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import {ApiReceipt} from "@/app/zone/scan/page";

export default function ScannerStage({setReceipt}: {setReceipt: (v: ApiReceipt) => void}) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameRef = useRef<number | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'environment' },
                });
                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                setError('Failed to access camera');
                console.error(err);
            }
        };

        startCamera();

        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        if (!canvas || !video) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const onLoadedMetadata = () => {
            // Set canvas size to display size, not video resolution
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * window.devicePixelRatio;
            canvas.height = rect.height * window.devicePixelRatio;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        };

        video.addEventListener('loadedmetadata', onLoadedMetadata);

        const drawGuideLines = () => {
            if (!canvas || !ctx) return;

            // Draw two vertical guide lines
            const lineWidth = 3;
            const lineColor = 'rgba(255, 255, 255, 0.7)';
            const lineSpacing = canvas.width / 4 / window.devicePixelRatio;

            ctx.strokeStyle = lineColor;
            ctx.lineWidth = lineWidth;

            // Left vertical line
            ctx.beginPath();
            ctx.moveTo(lineSpacing, 0);
            ctx.lineTo(lineSpacing, canvas.height / window.devicePixelRatio);
            ctx.stroke();

            // Right vertical line
            ctx.beginPath();
            ctx.moveTo(lineSpacing * 3, 0);
            ctx.lineTo(lineSpacing * 3, canvas.height / window.devicePixelRatio);
            ctx.stroke();

            animationFrameRef.current = requestAnimationFrame(drawGuideLines);
        };

        animationFrameRef.current = requestAnimationFrame(drawGuideLines);

        return () => {
            video.removeEventListener('loadedmetadata', onLoadedMetadata);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    const handleCapture = async () => {
        if (!videoRef.current || !canvasRef.current) return;

        setLoading(true);
        setError(null);

        try {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                setError('Failed to get canvas context');
                setLoading(false);
                return;
            }

            // Get video dimensions
            const videoWidth = video.videoWidth;
            const videoHeight = video.videoHeight;
            const containerWidth = canvas.width / window.devicePixelRatio;
            const containerHeight = canvas.height / window.devicePixelRatio;

            // Calculate object-cover scaling
            const videoAspect = videoWidth / videoHeight;
            const containerAspect = containerWidth / containerHeight;

            let sourceX = 0;
            let sourceY = 0;
            let sourceWidth = videoWidth;
            let sourceHeight = videoHeight;

            if (videoAspect > containerAspect) {
                // Video is wider, crop left and right
                sourceWidth = videoHeight * containerAspect;
                sourceX = (videoWidth - sourceWidth) / 2;
            } else {
                // Video is taller, crop top and bottom
                sourceHeight = videoWidth / containerAspect;
                sourceY = (videoHeight - sourceHeight) / 2;
            }

            // Draw the visible portion of the video to canvas
            ctx.drawImage(
                video,
                sourceX,
                sourceY,
                sourceWidth,
                sourceHeight,
                0,
                0,
                containerWidth,
                containerHeight
            );

            // Convert canvas to blob
            canvas.toBlob(async (blob) => {
                if (!blob) {
                    setError('Failed to capture image');
                    setLoading(false);
                    return;
                }

                try {
                    const formData = new FormData();
                    formData.append('image', blob, 'scan.png');

                    const response = await fetch('/api/scan', {
                        method: 'POST',
                        body: formData,
                    });

                    if (!response.ok) {
                        setError(`API error: ${response.statusText}`);
                        return;
                    }

                    const result = await response.json();
                    setReceipt(result);
                    console.log('Scan result:', result);
                    // Handle success - redirect or show result
                } catch (err) {
                    setError(err instanceof Error ? err.message : 'Failed to submit scan');
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            }, 'image/png');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to capture image');
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4">
            <div className="relative w-full max-w-md h-[70vh] bg-black rounded-lg overflow-hidden">
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                />
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full pointer-events-none"
                />
                {/* Overlay text */}
                <div className="absolute bottom-8 left-0 right-0 text-center text-white text-xs opacity-75">
                    Place check between the lines
                </div>
            </div>

            {error && (
                <div className="mt-4 text-red-500 text-sm text-center max-w-md">
                    {error}
                </div>
            )}

            <Button
                onClick={handleCapture}
                disabled={loading}
                className="mt-6"
                variant={"secondary"}
                size={"bl"}
            >
                {loading ? (
                    'Processing...'
                ) : (
                    'Capture'
                )}
            </Button>
        </div>
    );
}