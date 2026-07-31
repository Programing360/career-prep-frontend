import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Maximize2, Minus, Plus, X, ZoomIn, ImageOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NonVerbalImageRendererProps {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
}

interface Point {
  x: number;
  y: number;
}

const MIN_SCALE = 1;
const MAX_SCALE = 5;
const DOUBLE_TAP_ZOOM = 2.5;
const PAN_MARGIN = 24;
const PAN_KEY_STEP = 40;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function distance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function midpoint(a: Point, b: Point): Point {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

function DiagramSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 flex animate-pulse items-center justify-center bg-[rgb(var(--color-surface-elevated))]"
    >
      <div className="h-10 w-10 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-border))]" />
    </div>
  );
}

function LightboxToolbarButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex h-10 w-10 items-center justify-center rounded-lg text-white transition-colors focus-ring',
        'bg-white/10 hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40'
      )}
    >
      {children}
    </button>
  );
}

export function NonVerbalImageRenderer({
  src,
  alt,
  caption,
  className,
}: NonVerbalImageRendererProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [imageState, setImageState] = useState<{
    src: string;
    status: 'loading' | 'loaded' | 'error';
  }>({ src: '', status: 'loading' });
  const [scale, setScale] = useState(MIN_SCALE);
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });
  const [stageSize, setStageSize] = useState<Point | null>(null);
  const [imgSize, setImgSize] = useState<Point | null>(null);

  const scaleRef = useRef(MIN_SCALE);
  const offsetRef = useRef<Point>({ x: 0, y: 0 });
  const stageRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const pointersRef = useRef<Map<number, Point>>(new Map());
  const pinchStartRef = useRef<{
    dist: number;
    scale: number;
    offset: Point;
  } | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const applyTransform = useCallback((nextScale: number, nextOffset: Point) => {
    const clampedScale = clamp(nextScale, MIN_SCALE, MAX_SCALE);
    scaleRef.current = clampedScale;
    setScale(clampedScale);

    const stage = stageRef.current;
    const img = imgRef.current;
    if (!stage || !img) {
      offsetRef.current = nextOffset;
      setOffset(nextOffset);
      return;
    }
    const displayW = img.clientWidth * clampedScale;
    const displayH = img.clientHeight * clampedScale;
    const maxX = Math.max(0, (displayW - stage.clientWidth) / 2 + PAN_MARGIN);
    const maxY = Math.max(0, (displayH - stage.clientHeight) / 2 + PAN_MARGIN);
    const clampedOffset = {
      x: clamp(nextOffset.x, -maxX, maxX),
      y: clamp(nextOffset.y, -maxY, maxY),
    };
    offsetRef.current = clampedOffset;
    setOffset(clampedOffset);
  }, []);

  const getCenterTranslation = useCallback((): Point => {
    const stage = stageRef.current;
    const img = imgRef.current;
    if (!stage || !img) return { x: 0, y: 0 };
    return {
      x: (stage.clientWidth - img.clientWidth) / 2,
      y: (stage.clientHeight - img.clientHeight) / 2,
    };
  }, []);

  const zoomAt = useCallback(
    (focal: Point, nextScale: number, baseOffset = offsetRef.current) => {
      const currentScale = scaleRef.current;
      const ratio = nextScale / currentScale;
      if (nextScale <= MIN_SCALE) {
        applyTransform(MIN_SCALE, { x: 0, y: 0 });
        return;
      }
      const t = getCenterTranslation();
      const offsetX = focal.x - t.x - ratio * (focal.x - t.x - baseOffset.x);
      const offsetY = focal.y - t.y - ratio * (focal.y - t.y - baseOffset.y);
      applyTransform(nextScale, { x: offsetX, y: offsetY });
    },
    [applyTransform, getCenterTranslation]
  );

  const handleImageLoad = useCallback(() => {
    setImageState({ src, status: 'loaded' });
    const img = imgRef.current;
    if (img) {
      setImgSize({
        x: img.clientWidth,
        y: img.clientHeight,
      });
    }
  }, [src]);

  const handleImageError = useCallback(() => {
    setImageState({ src, status: 'error' });
  }, [src]);

  const open = useCallback(() => {
    applyTransform(MIN_SCALE, { x: 0, y: 0 });
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    setIsOpen(true);
  }, [applyTransform]);

  const close = useCallback(() => {
    setIsOpen(false);
    previousFocusRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
        return;
      }
      const panDir: Partial<Record<string, Point>> = {
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
      };
      const dir = panDir[e.key];
      if (dir && scaleRef.current > MIN_SCALE) {
        e.preventDefault();
        const current = offsetRef.current;
        applyTransform(scaleRef.current, {
          x: current.x + dir.x * PAN_KEY_STEP,
          y: current.y + dir.y * PAN_KEY_STEP,
        });
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, applyTransform, close]);

  useEffect(() => {
    if (!isOpen) return;
    closeButtonRef.current?.focus();
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new ResizeObserver(() => {
      setStageSize({ x: stage.clientWidth, y: stage.clientHeight });
    });
    observer.observe(stage);
    return () => observer.disconnect();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const stage = stageRef.current;
    if (!stage) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = stage.getBoundingClientRect();
      const focal = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      const factor = Math.exp(-e.deltaY * 0.002);
      zoomAt(focal, scaleRef.current * factor);
    };
    stage.addEventListener('wheel', onWheel, { passive: false });
    return () => stage.removeEventListener('wheel', onWheel);
  }, [isOpen, zoomAt]);

  const handlePointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      stageRef.current?.setPointerCapture(e.pointerId);
      pointersRef.current.set(e.pointerId, {
        x: e.clientX,
        y: e.clientY,
      });
      if (pointersRef.current.size === 2) {
        const points = [...pointersRef.current.values()];
        pinchStartRef.current = {
          dist: distance(points[0], points[1]),
          scale: scaleRef.current,
          offset: offsetRef.current,
        };
      }
    },
    []
  );

  const handlePointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      const previous = pointersRef.current.get(e.pointerId);
      if (!previous) return;
      pointersRef.current.set(e.pointerId, {
        x: e.clientX,
        y: e.clientY,
      });

      const stage = stageRef.current;
      if (!stage) return;
      const rect = stage.getBoundingClientRect();

      if (pointersRef.current.size === 2 && pinchStartRef.current) {
        const other = [...pointersRef.current.entries()].find(
          ([id]) => id !== e.pointerId
        )?.[1];
        if (!other) return;
        const current = { x: e.clientX, y: e.clientY };
        const dist = distance(current, other);
        if (dist > 0) {
          const mid = midpoint(current, other);
          const start = pinchStartRef.current;
          zoomAt(
            { x: mid.x - rect.left, y: mid.y - rect.top },
            start.scale * (dist / start.dist),
            start.offset
          );
        }
        return;
      }

      if (scaleRef.current > MIN_SCALE) {
        const delta = {
          x: e.clientX - previous.x,
          y: e.clientY - previous.y,
        };
        const currentOffset = offsetRef.current;
        applyTransform(scaleRef.current, {
          x: currentOffset.x + delta.x,
          y: currentOffset.y + delta.y,
        });
      }
    },
    [zoomAt, applyTransform]
  );

  const handlePointerUp = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      pointersRef.current.delete(e.pointerId);
      pinchStartRef.current = null;
    },
    []
  );

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const stage = stageRef.current;
      if (!stage) return;
      const rect = stage.getBoundingClientRect();
      const focal = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      zoomAt(focal, scaleRef.current > 1.01 ? MIN_SCALE : DOUBLE_TAP_ZOOM);
    },
    [zoomAt]
  );

  const centerFocal = useCallback((): Point => {
    const stage = stageRef.current;
    return {
      x: (stage?.clientWidth ?? 0) / 2,
      y: (stage?.clientHeight ?? 0) / 2,
    };
  }, []);

  const centerTranslationX =
    stageSize && imgSize ? (stageSize.x - imgSize.x) / 2 : 0;
  const centerTranslationY =
    stageSize && imgSize ? (stageSize.y - imgSize.y) / 2 : 0;

  const isLoading = imageState.src !== src || imageState.status === 'loading';
  const hasError = imageState.src === src && imageState.status === 'error';

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-label={`Expand diagram: ${alt}`}
        aria-haspopup="dialog"
        className={cn(
          'group relative block w-full overflow-hidden rounded-xl border text-left transition-all duration-200 focus-ring',
          'border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))]',
          'hover:border-primary-400/70 hover:shadow-lg hover:shadow-primary-500/5 dark:hover:border-primary-600/70',
          className
        )}
      >
        <div className="relative flex min-h-44 w-full items-center justify-center overflow-hidden">
          {isLoading && <DiagramSkeleton />}
          {hasError ? (
            <div className="flex flex-col items-center gap-2 py-10 text-[rgb(var(--color-text-muted))]">
              <ImageOff size={28} aria-hidden="true" />
              <span className="text-xs">Diagram unavailable</span>
            </div>
          ) : (
            <img
              src={src}
              alt={alt}
              loading="lazy"
              draggable={false}
              onLoad={handleImageLoad}
              onError={handleImageError}
              className="max-h-56 w-full select-none object-contain transition-transform duration-300 group-hover:scale-[1.02]"
            />
          )}
          <span className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center pb-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900/85 px-3 py-1 text-[11px] font-medium text-white shadow-lg ring-1 ring-white/25 backdrop-blur-sm">
              <ZoomIn size={12} aria-hidden="true" />
              Tap to expand diagram
            </span>
          </span>
        </div>
        {caption && (
          <span className="block border-t border-[rgb(var(--color-border))] px-3 py-2 text-xs text-[rgb(var(--color-text-muted))]">
            {caption}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="nonverbal-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={alt}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[60] flex flex-col bg-black/90 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) close();
            }}
          >
            <div className="flex items-center justify-between gap-4 px-4 py-3 text-white sm:px-6">
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-semibold">{alt}</h3>
                {caption && (
                  <p className="mt-0.5 truncate text-xs text-white/60">
                    {caption}
                  </p>
                )}
              </div>
              <span
                className="shrink-0 rounded-md bg-white/10 px-2 py-1 text-xs font-medium tabular-nums"
                aria-live="polite"
              >
                {Math.round(scale * 100)}%
              </span>
              <button
                ref={closeButtonRef}
                type="button"
                aria-label="Close diagram"
                onClick={close}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white transition-colors hover:bg-white/20 focus-ring"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <div
              ref={stageRef}
              className="relative min-h-0 flex-1 overflow-hidden"
              style={{ touchAction: 'none' }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onDoubleClick={handleDoubleClick}
            >
              {hasError ? (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-white/60">
                  <ImageOff size={32} aria-hidden="true" />
                  <span className="text-sm">Diagram unavailable</span>
                </div>
              ) : (
                <img
                  ref={imgRef}
                  src={src}
                  alt={alt}
                  draggable={false}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  className="absolute left-0 top-0 max-h-full max-w-full select-none object-contain"
                  style={{
                    transformOrigin: '0 0',
                    transform: `translate(${centerTranslationX + offset.x}px, ${centerTranslationY + offset.y}px) scale(${scale})`,
                    cursor: scale > 1 ? 'grab' : 'zoom-in',
                  }}
                />
              )}
            </div>

            <div className="flex items-center justify-center gap-2 px-4 py-3">
              <LightboxToolbarButton
                label="Zoom out"
                disabled={scale <= MIN_SCALE}
                onClick={() => zoomAt(centerFocal(), scaleRef.current - 0.5)}
              >
                <Minus size={16} aria-hidden="true" />
              </LightboxToolbarButton>
              <LightboxToolbarButton
                label="Reset zoom"
                onClick={() => applyTransform(MIN_SCALE, { x: 0, y: 0 })}
              >
                <Maximize2 size={16} aria-hidden="true" />
              </LightboxToolbarButton>
              <LightboxToolbarButton
                label="Zoom in"
                disabled={scale >= MAX_SCALE}
                onClick={() => zoomAt(centerFocal(), scaleRef.current + 0.5)}
              >
                <Plus size={16} aria-hidden="true" />
              </LightboxToolbarButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
