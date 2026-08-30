'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';
import { useRouter } from 'next/navigation';
import { useCanvasCourtImage } from '../hooks/use-canvas-court-image';
import { useCanvasDraw } from '../hooks/use-canvas-draw';
import { useInteractionHandlers } from '../hooks/use-interaction-handlers';
import { useResponsiveCanvas } from '../hooks/use-responsive-canvas';
import { getEventPosition } from '../utils/canvas/get-event-position';
import { getPlayerAtPosition } from '../utils/canvas/get-player-position';
import {
  categories,
  colors,
  initialPlayerPosition,
  tools,
} from '../utils/constants';
import { DrawingLine, Player } from '../utils/types';
import { Play, playSchema } from '../zod';
import { useTeam } from '@/context/team-context';
import { toastStyling } from '@/features/toast-notification/styling';
import { RichTextEditor } from '@/features/wysiwyg/text-editor';
import { cn } from '@/utils/tw-merge';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { RotateCcw, Save, Trash2 } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { gqlRequest } from '@/lib/graphql/client-request';
import {
  Category,
  CreatePlayDocument,
  type CreatePlayInput,
} from '@/graphql/graphql';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/card';
import { Button } from '@/components/foundation/button/button';
import { Input } from '@/components/foundation/input';
import { RadioGroup } from '@/components/foundation/radio/radio-group';
import { RadioGroupItem } from '@/components/foundation/radio/radio-group-item';

export function PlayForm() {
  const { routeKey } = useTeam();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();
  const [currentTool, setCurrentTool] = useState<
    'select' | 'pass' | 'movement'
  >('select');
  const [currentColor, setCurrentColor] = useState('#f97316');
  const [isDrawing, setIsDrawing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedPlayer, setDraggedPlayer] = useState<string | null>(null);
  const [drawingLines, setDrawingLines] = useState<DrawingLine[]>([]);
  const [players, setPlayers] = useState<Player[]>(initialPlayerPosition);

  const { mutateAsync: createPlay } = useMutation({
    mutationFn: (input: CreatePlayInput) =>
      gqlRequest(CreatePlayDocument, { input }),
    onSuccess: () => {
      toast.success('Your Play has been successfully created', {
        ...toastStyling,
        position: 'top-center',
      });
      router.push(`/team/${routeKey}/playbook`);
      router.refresh();
    },
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Play>({
    resolver: zodResolver(playSchema),
    defaultValues: {},
  });

  const descriptionContent = watch('description');

  const { courtImgRef, courtImgLoaded } = useCanvasCourtImage('/BG-court.png');
  const canvasSize = useResponsiveCanvas(
    canvasRef as RefObject<HTMLCanvasElement>,
  );

  const { drawCourt } = useCanvasDraw(
    canvasRef as RefObject<HTMLCanvasElement>,
    courtImgRef,
    canvasSize,
    players,
    drawingLines,
  );

  const { startInteraction, continueInteraction } = useInteractionHandlers({
    canvasRef: canvasRef as RefObject<HTMLCanvasElement>,
    currentTool,
    currentColor,
    players,
    setPlayers,
    setDrawingLines,
    setIsDrawing,
    setIsDragging,
    setDraggedPlayer,
    isDragging,
    isDrawing,
    draggedPlayer,
  });

  useEffect(() => {
    if (courtImgLoaded) drawCourt();
  }, [canvasSize, players, drawingLines, courtImgLoaded, drawCourt]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging && currentTool === 'select') {
      const { x, y } = getEventPosition(e, canvasRef.current);
      const player = getPlayerAtPosition(x, y, players);
      if (canvasRef.current) {
        canvasRef.current.style.cursor = player ? 'grab' : 'default';
      }
    }
  };

  useEffect(() => {
    setValue('canvas', JSON.stringify({ players, lines: drawingLines }));
    register('description', { required: true });
  }, [players, drawingLines, setValue, register]);

  const endInteraction = () => {
    setIsDrawing(false);
    setIsDragging(false);
    setDraggedPlayer(null);
  };

  const resetPlayers = () => setPlayers(initialPlayerPosition);
  const clearDrawings = () => setDrawingLines([]);
  const undoLastLine = () => setDrawingLines((prev) => prev.slice(0, -1));

  const onSubmit = async (data: Play) => {
    if (!canvasRef.current) return;
    // Get the base64 data URL from the canvas
    const canvasDataUrl = canvasRef.current.toDataURL();

    const categoryMap: Record<string, Category> = {
      offense: Category.Offensive,
      defense: Category.Defensive,
      special: Category.Special,
      OFFENSE: Category.Offensive,
      DEFENSE: Category.Defensive,
      [Category.Offensive]: Category.Offensive,
      [Category.Defensive]: Category.Defensive,
      [Category.Special]: Category.Special,
    };

    const normalizedCategory =
      categoryMap[data.category] ?? categoryMap[data.category.toLowerCase()];

    if (!normalizedCategory) {
      toast.error('Invalid play category');
      return;
    }

    // error toast handled globally by MutationCache; catch to keep isSubmitting accurate
    await createPlay({
      name: data.name,
      description: data.description,
      category: normalizedCategory,
      canvas: canvasDataUrl,
      routeKey,
    }).catch(() => {});
  };

  return (
    <div className="mx-auto my-auto w-full max-w-7xl space-y-6 p-2 sm:p-4">
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-linear-to-b from-slate-900/95 to-slate-950 px-4 py-5">
        <div className="absolute top-0 left-0 h-1 w-full bg-linear-to-r from-orange-500 via-amber-300 to-orange-500 opacity-80" />
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            Create New Play
          </h1>
          <p className="text-sm text-gray-400">Design and describe your play</p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col-reverse gap-6 xl:grid xl:grid-cols-[1.6fr_1fr]"
      >
        <div className="flex w-full flex-1 flex-col gap-4">
          <Card className="overflow-hidden rounded-2xl border border-white/10 bg-linear-to-b from-slate-900/95 to-slate-950 px-0 shadow-[0_0_30px_rgba(0,0,0,0.35)]">
            <div className="h-1 w-full bg-linear-to-r from-orange-500 via-amber-300 to-orange-500 opacity-80" />
            <CardHeader className="pt-6">
              <CardTitle className="text-white">Draw Your Play</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {tools.map(({ id, icon: Icon, label }) => (
                  <Button
                    aria-label="Select Tool"
                    key={id}
                    onClick={() =>
                      setCurrentTool(id as 'select' | 'pass' | 'movement')
                    }
                    variant={currentTool === id ? 'primary' : 'outline'}
                    className="flex min-w-28 items-center justify-center"
                  >
                    <Icon className="h-4 w-4" /> {label}
                  </Button>
                ))}
                <Button
                  aria-label="Undo Last Line"
                  variant="outline"
                  onClick={undoLastLine}
                  className="border-white/20 bg-slate-900/80 hover:border-orange-300/40"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Undo Line
                </Button>
                <Button
                  aria-label="Clear Drawings"
                  variant="outline"
                  onClick={clearDrawings}
                  className="border-white/20 bg-slate-900/80 hover:border-orange-300/40"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear Lines
                </Button>
                <Button
                  aria-label="Reset Players"
                  variant="outline"
                  onClick={resetPlayers}
                  className="border-white/20 bg-slate-900/80 hover:border-orange-300/40"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset Players
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-white/70">
                <span className="inline-flex items-center gap-2">
                  <span className="h-[2px] w-8 rounded bg-white" />
                  Pass line
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-0 w-8 border-t-2 border-dashed border-white" />
                  Movement line
                </span>
              </div>
              <div>
                <h3 className="mb-2 text-xs tracking-wide text-gray-400 uppercase">
                  Color
                </h3>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <Button
                      key={color}
                      variant="ghost"
                      size="icon"
                      style={{ backgroundColor: color }}
                      className={cn(
                        'h-8 w-8 rounded-full border-2 p-0 hover:bg-transparent',
                        currentColor === color
                          ? 'border-white ring-2 ring-white/20'
                          : 'border-white/20',
                      )}
                      onClick={() => setCurrentColor(color)}
                      aria-label={`Select color ${color}`}
                    />
                  ))}
                </div>
              </div>
              <Controller
                name="canvas"
                control={control}
                rules={{ required: true }}
                defaultValue={JSON.stringify({ players, lines: drawingLines })}
                render={() => (
                  <canvas
                    ref={canvasRef}
                    width={canvasSize.width}
                    height={canvasSize.height}
                    className="w-full max-w-full rounded-xl border border-white/10 bg-slate-950/80"
                    onMouseDown={startInteraction}
                    onTouchStart={startInteraction}
                    onMouseMove={(e) => {
                      handleMouseMove(e);
                      if (isDrawing || isDragging) continueInteraction(e);
                    }}
                    onTouchMove={continueInteraction}
                    onMouseUp={endInteraction}
                    onTouchEnd={endInteraction}
                    onMouseLeave={endInteraction}
                    defaultValue={JSON.stringify({
                      players,
                      lines: drawingLines,
                    })}
                  />
                )}
              />
            </CardContent>
          </Card>
        </div>
        <div className="flex w-full max-w-full min-w-0 flex-col gap-4 lg:w-full">
          <Card className="overflow-hidden rounded-2xl border border-white/10 bg-linear-to-b from-slate-900/95 to-slate-950 shadow-[0_0_30px_rgba(0,0,0,0.35)]">
            <div className="h-1 w-full bg-linear-to-r from-orange-500 via-amber-300 to-orange-500 opacity-80" />
            <CardHeader className="pt-6">
              <CardTitle className="text-white">Play Details</CardTitle>
              <CardDescription className="text-gray-400">
                Name and describe your play.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex w-full flex-col gap-4">
                <Input
                  id="name"
                  label="Name"
                  labelColor="light"
                  className="border-white/10 bg-slate-900/70 text-white placeholder:text-gray-500"
                  aria-label="Play name input"
                  {...register('name')}
                  error={errors.name}
                  errorMessage={errors.name?.message}
                />
                <div className="flex w-full flex-col gap-3">
                  <span className="text-xs font-semibold tracking-wide text-gray-300 uppercase">
                    Category
                  </span>
                  <div>
                    <Controller
                      name="category"
                      control={control}
                      rules={{ required: 'Please select a category' }}
                      render={({ field }) => (
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          className="flex flex-wrap gap-4 sm:flex-nowrap sm:gap-6"
                        >
                          {categories.map((option) => (
                            <div
                              key={option.id}
                              className={cn(
                                'flex items-center gap-2 rounded-lg border px-4 py-2 shadow-sm transition',
                                field.value === option.id
                                  ? 'border-orange-300/50 bg-orange-500/15 text-white'
                                  : 'border-white/10 bg-slate-900/60 text-gray-100 hover:border-orange-300/40',
                              )}
                            >
                              <RadioGroupItem
                                value={option.id}
                                id={`position-${option.id}`}
                                className="border-white/30 bg-slate-950 text-white ring-0 focus-visible:ring-orange-300 data-[state=checked]:border-orange-300 data-[state=checked]:bg-orange-300 data-[state=checked]:text-orange-900"
                              />
                              <label
                                htmlFor={`position-${option.id}`}
                                className="text-md cursor-pointer"
                              >
                                {option.label}
                              </label>
                            </div>
                          ))}
                        </RadioGroup>
                      )}
                    />
                    {errors.category && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.category.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <RichTextEditor
                  label="Explain the Play"
                  className="max-h-96 w-full max-w-full"
                  content={descriptionContent ?? ''}
                  onChange={(content) =>
                    setValue('description', content, { shouldValidate: true })
                  }
                />
                {errors.description && <p>{errors.description.message}</p>}
              </div>
              <Button type="submit" variant="primary" className="w-full">
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting ? 'Saving...' : 'Save Play'}
              </Button>
              {/* <Button
                onClick={savePlay}
                disabled={!playData.name || !playData.category}
                className="w-full"
              >
                <Save className="mr-2 h-4 w-4" />
                Save Play
              </Button> */}
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
