import { categoriesFilter } from '../utils/constants';
import { cn } from '@/utils/tw-merge';
import { Button } from '@/components/foundation/button/button';

type PlayCategoryFilterProps = {
  activeCategory: string;
  setActiveCategory: (id: string) => void;
};

export const PlayCategoryFilter = ({
  activeCategory,
  setActiveCategory,
}: PlayCategoryFilterProps) => {
  return (
    <div className="mb-12 grid w-full grid-cols-3 gap-3 md:grid-cols-4">
      {categoriesFilter.map((category) => {
        const Icon = category.icon;
        const isActive = activeCategory === category.id;

        return (
          <Button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            size="full"
            className={cn(
              'group relative flex w-full items-center gap-1 overflow-hidden rounded-2xl border px-2 py-4 text-[0.735rem] sm:gap-2 sm:px-3 sm:py-3 sm:text-xs md:px-4 md:py-4 md:text-sm',
              isActive
                ? `${category.gradient} border-transparent`
                : 'border-gray-800/50',
            )}
          >
            <div
              className={cn(
                isActive ? `bg-gradient-${category.gradient}` : '',
                'absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100',
              )}
            />
            <div className="z-10 flex flex-1 items-center justify-start gap-1 p-2 sm:gap-2">
              <div
                className={cn(
                  category.gradient,
                  'hidden h-5 w-5 shrink-0 items-center justify-center rounded-xl transition-all duration-300 sm:flex sm:h-6 sm:w-6',
                )}
              >
                <Icon className="h-4 w-4 text-white sm:h-3.5 sm:w-3.5" />
              </div>
              <h3 className="min-w-0 flex-1 truncate text-left text-[10px] font-medium sm:text-xs md:text-sm">
                {category.label}
              </h3>
              <div className="shrink-0 rounded bg-gray-300/30 px-1.5 py-0.5 text-[0.725rem] font-bold sm:text-xs">
                {category.count}
              </div>
            </div>
          </Button>
        );
      })}
    </div>
  );
};
