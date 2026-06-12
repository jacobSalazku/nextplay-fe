export const formatReportDate = (date: string | Date) =>
  new Intl.DateTimeFormat('nl-BE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));

export const reportNumber = (totalReports: number, index: number) =>
  String(totalReports - index).padStart(2, '0');
