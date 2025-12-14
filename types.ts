export enum WasteCategory {
  RECYCLABLE = 'Tái chế',
  ORGANIC = 'Hữu cơ',
  HAZARDOUS = 'Nguy hại',
  RESIDUAL = 'Rác còn lại',
  UNKNOWN = 'Không xác định'
}

export interface WasteAnalysis {
  itemName: string;
  category: WasteCategory;
  explanation: string;
  disposalInstruction: string;
  confidence: number;
}
