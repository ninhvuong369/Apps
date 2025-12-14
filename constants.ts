import { WasteCategory } from './types';

export const CATEGORY_COLORS: Record<WasteCategory, string> = {
  [WasteCategory.RECYCLABLE]: 'bg-blue-100 text-blue-800 border-blue-200',
  [WasteCategory.ORGANIC]: 'bg-green-100 text-green-800 border-green-200',
  [WasteCategory.HAZARDOUS]: 'bg-red-100 text-red-800 border-red-200',
  [WasteCategory.RESIDUAL]: 'bg-gray-100 text-gray-800 border-gray-200',
  [WasteCategory.UNKNOWN]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
};

export const CATEGORY_ICONS: Record<WasteCategory, string> = {
  [WasteCategory.RECYCLABLE]: '♻️',
  [WasteCategory.ORGANIC]: '🍎',
  [WasteCategory.HAZARDOUS]: '☣️',
  [WasteCategory.RESIDUAL]: '🗑️',
  [WasteCategory.UNKNOWN]: '❓',
};
