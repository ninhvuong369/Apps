import React, { useState, useRef } from 'react';
import { CameraCapture } from './components/CameraCapture';
import { AnalysisResult } from './components/AnalysisResult';
import { analyzeWasteImage } from './services/geminiService';
import { WasteAnalysis } from './types';

function App() {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<WasteAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCapture = (imgSrc: string) => {
    setImage(imgSrc);
    setIsCameraOpen(false);
    processImage(imgSrc);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImage(result);
        processImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async (imgSrc: string) => {
    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    try {
      const result = await analyzeWasteImage(imgSrc);
      setAnalysis(result);
    } catch (err) {
      console.error(err);
      setError("Có lỗi xảy ra khi phân tích ảnh. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetApp = () => {
    setImage(null);
    setAnalysis(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 text-gray-800 font-sans">
      <div className="max-w-md mx-auto min-h-screen flex flex-col p-4">
        
        {/* Header */}
        <header className="flex items-center justify-between py-4 mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white text-xl shadow-lg">
              🌱
            </div>
            <h1 className="text-xl font-bold text-green-800 tracking-tight">EcoSort AI</h1>
          </div>
          <div className="text-xs font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full">
            Beta
          </div>
        </header>

        <main className="flex-1 flex flex-col">
          {/* State: Camera Open */}
          {isCameraOpen ? (
            <div className="flex-1 flex flex-col rounded-3xl overflow-hidden shadow-2xl">
              <CameraCapture 
                onCapture={handleCapture} 
                onCancel={() => setIsCameraOpen(false)} 
              />
            </div>
          ) : (
            <>
              {/* State: Initial or Result Display */}
              <div className="flex-1 flex flex-col items-center">
                
                {/* Image Preview Area */}
                <div className="w-full relative rounded-3xl overflow-hidden shadow-lg bg-white mb-6 aspect-square max-h-[350px] flex items-center justify-center border-4 border-white">
                  {image ? (
                    <>
                      <img src={image} alt="Waste to analyze" className="w-full h-full object-cover" />
                      {isLoading && (
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center text-white z-10">
                          <div className="w-12 h-12 border-4 border-green-400 border-t-transparent rounded-full animate-spin mb-3"></div>
                          <p className="font-medium animate-pulse">Đang phân tích...</p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center p-8 text-gray-400 flex flex-col items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mb-4 opacity-50 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p>Chụp hoặc tải ảnh rác lên để AI phân loại giúp bạn</p>
                    </div>
                  )}
                </div>

                {/* Error Message */}
                {error && (
                  <div className="w-full bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                {/* Analysis Result */}
                {analysis && !isLoading && (
                  <AnalysisResult analysis={analysis} onReset={resetApp} />
                )}

                {/* Initial Controls (Only show if not loading and no analysis) */}
                {!isLoading && !analysis && (
                  <div className="w-full space-y-4 animate-fade-in-up">
                    <button
                      onClick={() => setIsCameraOpen(true)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white text-lg font-bold py-4 rounded-2xl shadow-green-200 shadow-xl transition-all active:scale-95 flex items-center justify-center space-x-3"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>Chụp ảnh ngay</span>
                    </button>

                    <div className="relative">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <button className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-4 rounded-2xl shadow-lg border border-gray-100 transition-all active:scale-95 flex items-center justify-center space-x-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        <span>Tải ảnh từ thư viện</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </main>
        
        {/* Footer */}
        {!isCameraOpen && (
          <footer className="py-6 text-center text-xs text-gray-500">
            <p>Powered by Google Gemini 2.5 Flash</p>
          </footer>
        )}
      </div>
    </div>
  );
}

export default App;
