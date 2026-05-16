import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type Props = {
    src: string;
    size?: number; // output size in px
    aspectRatio?: number; // width / height
    onCancel: () => void;
    onCrop: (dataUrl: string) => void;
};

export default function ImageCropper({ src, size = 512, aspectRatio = 3 / 4, onCancel, onCrop }: Props) {
    const MIN_OUTPUT_SIZE = 256;
    const MAX_OUTPUT_SIZE = 1600;
    const previewSize = 420;
    const [portalRoot, setPortalRoot] = useState<HTMLDivElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const imgRef = useRef<HTMLImageElement | null>(null);
    const [scale, setScale] = useState(1);
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const dragging = useRef(false);
    const dragStart = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const element = document.createElement('div');
        document.body.appendChild(element);
        setPortalRoot(element);

        return () => {
            document.body.removeChild(element);
            setPortalRoot(null);
        };
    }, []);

    const getCanvasPoint = (e: React.PointerEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: e.clientX, y: e.clientY };

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY,
        };
    };

    const getCropRect = (canvasSize: number) => {
        const maxFrame = Math.floor(canvasSize * 0.78);
        let cropW = maxFrame;
        let cropH = maxFrame;

        if (aspectRatio >= 1) {
            cropW = maxFrame;
            cropH = Math.floor(maxFrame / aspectRatio);
        } else {
            cropH = maxFrame;
            cropW = Math.floor(maxFrame * aspectRatio);
        }

        const cropX = Math.floor((canvasSize - cropW) / 2);
        const cropY = Math.floor((canvasSize - cropH) / 2);
        return { cropX, cropY, cropW, cropH };
    };

    const getEstimatedOutputSize = (currentScale: number) => {
        const { cropW, cropH } = getCropRect(size);
        const sourceW = Math.max(1, Math.round(cropW / Math.max(currentScale, 0.01)));
        const sourceH = Math.max(1, Math.round(cropH / Math.max(currentScale, 0.01)));

        const longEdge = Math.max(sourceW, sourceH);
        const outLongEdge = Math.max(MIN_OUTPUT_SIZE, Math.min(MAX_OUTPUT_SIZE, longEdge));

        if (sourceW >= sourceH) {
            return {
                width: outLongEdge,
                height: Math.max(1, Math.round(outLongEdge * (sourceH / sourceW))),
            };
        }

        return {
            width: Math.max(1, Math.round(outLongEdge * (sourceW / sourceH))),
            height: outLongEdge,
        };
    };

    const clampPosition = (nextPos: { x: number; y: number }, nextScale: number) => {
        const img = imgRef.current;
        if (!img) return nextPos;

        const drawW = img.width * nextScale;
        const drawH = img.height * nextScale;
        const { cropX, cropY, cropW, cropH } = getCropRect(size);

        const minX = cropX + cropW - drawW;
        const maxX = cropX;
        const minY = cropY + cropH - drawH;
        const maxY = cropY;

        return {
            x: Math.min(maxX, Math.max(minX, nextPos.x)),
            y: Math.min(maxY, Math.max(minY, nextPos.y)),
        };
    };

    useEffect(() => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = src;
        img.onload = () => {
            imgRef.current = img;
            const { cropW, cropH, cropX, cropY } = getCropRect(size);
            const fitScale = Math.max(cropW / img.width, cropH / img.height, 0.1);
            const drawW = img.width * fitScale;
            const drawH = img.height * fitScale;

            setScale(fitScale);
            setPos({
                x: cropX + (cropW - drawW) / 2,
                y: cropY + (cropH - drawH) / 2,
            });
            draw();
        };
        img.onerror = () => {
            console.error('Failed to load image for cropping');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [src]);

    useEffect(() => {
        draw();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scale, pos]);

    const draw = () => {
        const canvas = canvasRef.current;
        const img = imgRef.current;
        if (!canvas || !img) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // clear
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // draw background
        ctx.fillStyle = '#111827';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // compute draw size
        const drawW = img.width * scale;
        const drawH = img.height * scale;

        ctx.save();
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        // draw image at pos
        ctx.drawImage(img, pos.x, pos.y, drawW, drawH);
        ctx.restore();

        // overlay — dim outside centered square crop
        ctx.save();
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        const { cropW, cropH, cropX, cropY } = getCropRect(canvas.width);
        ctx.beginPath();
        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.rect(cropX, cropY, cropW, cropH);
        ctx.fill('evenodd');
        ctx.restore();

        // draw frame border
        ctx.beginPath();
        ctx.rect(cropX + 0.5, cropY + 0.5, cropW - 1, cropH - 1);
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'rgba(255,255,255,0.9)';
        ctx.stroke();
    };

    const toCroppedDataUrl = (): string | null => {
        const img = imgRef.current;
        if (!img) return null;

        const sizePx = size;
        const { cropW, cropH, cropX, cropY } = getCropRect(sizePx);
        const sourceWidth = cropW / Math.max(scale, 0.01);
        const sourceHeight = cropH / Math.max(scale, 0.01);
        const sourceX = (cropX - pos.x) / Math.max(scale, 0.01);
        const sourceY = (cropY - pos.y) / Math.max(scale, 0.01);

        const outSize = getEstimatedOutputSize(scale);
        const outCanvas = document.createElement('canvas');
        outCanvas.width = outSize.width;
        outCanvas.height = outSize.height;
        const outCtx = outCanvas.getContext('2d');
        if (!outCtx) return null;

        outCtx.fillStyle = '#000';
        outCtx.fillRect(0, 0, outCanvas.width, outCanvas.height);
        outCtx.imageSmoothingEnabled = true;
        outCtx.imageSmoothingQuality = 'high';
        outCtx.drawImage(
            img,
            sourceX,
            sourceY,
            sourceWidth,
            sourceHeight,
            0,
            0,
            outCanvas.width,
            outCanvas.height,
        );

        return outCanvas.toDataURL('image/jpeg', 0.92);
    };

    const handlePointerDown = (e: React.PointerEvent) => {
        dragging.current = true;
        dragStart.current = getCanvasPoint(e);
        (e.target as Element).setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!dragging.current) return;
        const nextPoint = getCanvasPoint(e);
        const dx = nextPoint.x - dragStart.current.x;
        const dy = nextPoint.y - dragStart.current.y;
        dragStart.current = nextPoint;
        setPos((p) => clampPosition({ x: p.x + dx, y: p.y + dy }, scale));
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        dragging.current = false;
        try { (e.target as Element).releasePointerCapture(e.pointerId); } catch { }
    };

    const originalWidth = imgRef.current?.width ?? 0;
    const originalHeight = imgRef.current?.height ?? 0;
    const estimatedOutput = getEstimatedOutputSize(scale);

    if (!portalRoot) return null;

    return createPortal(
        <div className="fixed inset-0 z-[10050] flex items-center justify-center p-4 bg-black/60">
            <div className="bg-[var(--bg-primary)] rounded-2xl p-6 border border-[var(--border-primary)] shadow-2xl max-w-[720px] w-full">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-bold">Adjust Portrait</h4>
                    <div className="flex gap-2">
                        <button onClick={onCancel} className="px-3 py-1 rounded bg-gray-700/20">Cancel</button>
                        <button onClick={() => { const data = toCroppedDataUrl(); if (data) onCrop(data); }} className="px-3 py-1 rounded bg-luxury-accent text-black font-bold">Save</button>
                    </div>
                </div>

                <div className="flex gap-4 items-start">
                    <div className="border border-[var(--border-primary)] rounded overflow-hidden" style={{ width: 420, height: 420 }}>
                        <canvas
                            ref={canvasRef}
                            width={size}
                            height={size}
                            onPointerDown={handlePointerDown}
                            onPointerMove={handlePointerMove}
                            onPointerUp={handlePointerUp}
                            style={{ touchAction: 'none', width: previewSize, height: previewSize, display: 'block' }}
                        />
                    </div>

                    <div className="flex-1">
                        <label className="block text-sm mb-2">Zoom</label>
                        <input
                            type="range"
                            min="0.5"
                            max="4"
                            step="0.01"
                            value={scale}
                            onChange={(e) => {
                                const nextScale = Number(e.target.value);
                                setScale(nextScale);
                                setPos((p) => clampPosition(p, nextScale));
                            }}
                        />
                        <p className="text-xs opacity-60 mt-3">Drag to position and zoom to fit the portrait frame. Export keeps the same rectangular ratio used on Designers cards.</p>
                        <div className="mt-4 rounded-lg border border-[var(--border-primary)] bg-[var(--text-primary)]/5 p-3 text-xs space-y-1">
                            <p className="opacity-70">Original: {originalWidth > 0 ? `${originalWidth} x ${originalHeight}px` : 'Loading...'}</p>
                            <p className="opacity-90">Saved: {estimatedOutput.width} x {estimatedOutput.height}px (JPEG)</p>
                            <p className="opacity-60">Auto range: {MIN_OUTPUT_SIZE}px to {MAX_OUTPUT_SIZE}px</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        portalRoot
    );
}
