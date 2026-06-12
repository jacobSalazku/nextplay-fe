import { cn } from '@/utils/tw-merge';
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';

type StatCardProps = {
  title: string;
  value: number | string;
  subtitle?: string;
  icon?: LucideIcon;
  iconColor?: string;
};

export function StatisticsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'text-orange-200',
}: StatCardProps) {
  return (
    <Card className="group relative overflow-hidden border border-orange-500/12 bg-gray-950/95 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-400/30 hover:shadow-[0_14px_26px_-20px_rgba(251,146,60,0.45)]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(155deg,rgba(251,146,60,0.14)_0%,rgba(251,146,60,0.05)_24%,rgba(0,0,0,0)_62%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-200/45 to-transparent" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-16 w-16 rounded-full bg-orange-500/12 blur-2xl transition-opacity duration-300 opacity-70 group-hover:opacity-100" />
      <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-semibold tracking-[0.12em] text-orange-100/85 uppercase">
          {title}
        </CardTitle>
        {Icon && (
          <span className="rounded-md border border-orange-400/25 bg-black/30 p-1.5">
            <Icon className={cn(iconColor, 'h-4 w-4')} />
          </span>
        )}
      </CardHeader>
      <CardContent className="relative">
        <div className="font-righteous text-3xl font-bold tracking-wide tabular-nums text-white">
          {value}
        </div>
        {subtitle && (
          <p className="mt-2 text-[11px] font-medium tracking-wide text-gray-300/80 uppercase">
            {subtitle}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
