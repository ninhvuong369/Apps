import React from 'react';
import { WasteAnalysis } from '../types';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '../constants';

interface AnalysisResultProps {
  analysis: WasteAnalysis;
  onReset: () => void;
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ analysis, onReset }) => {
  const colorClass = CATEGORY_COLORS[analysis.category];
  const icon = CATEGORY_ICONS[analysis.category];

  return (
    <div className="w-full animate-fade-in">
      <div className={`rounded-2xl p-6 ${colorClass} border-2 mb-6 shadow-sm`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-4xl">{icon}</span>
            <div>
              <h2 className="text-2xl font-bold">{analysis.category}</h2>
              <p className="opacity-80 font-medium">{analysis.itemName}</p>
            </div>
          </div>
          <div className="bg-white/30 px-3 py-1 rounded-full text-sm font-bold backdrop-blur-sm">
            {Math.round(analysis.confidence)}% tin cậy
          </div>
        </div>
        
        <div className="bg-white/60 p-4 rounded-xl backdrop-blur-sm space-y-3">
          <div>
            <h3 className="font-semibold text-sm uppercase opacity-70 mb-1">Tại sao?</h3>
            <p className="text-base">{analysis.explanation}</p>
          </div>
          
          <div className="border-t border-black/10 pt-3">
            <h3 className="font-semibold text-sm uppercase opacity-70 mb-1">Hướng dẫn xử lý</h3>
            <p className="text-base font-medium">{analysis.disposalInstruction}</p>
          </div>
        </div>
      </div>

      <button
        onClick={onReset}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center space-x-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span>Quét rác khác</span>
      </button>
    </div>
  );
};
