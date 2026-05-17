export const getCategoryColor = (category: string) => {
  switch (category.toUpperCase()) {
    case 'OFFENSIVE':
    case 'OFFENSE':
      return 'bg-orange-900/70 text-orange-200 border border-orange-500/40';
    case 'DEFENSIVE':
    case 'DEFENSE':
      return 'bg-blue-900/70 text-blue-200 border border-blue-500/40';
    case 'SPECIAL':
      return 'bg-violet-900/70 text-violet-200 border border-violet-500/40';
    default:
      return 'bg-slate-800 text-slate-200 border border-slate-500/40';
  }
};
