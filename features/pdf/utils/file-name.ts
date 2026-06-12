export const sanitizePdfFileName = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export const formatPdfDate = (date: Date | string) =>
  new Date(date).toISOString().split('T')[0];
