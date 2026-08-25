import { useState } from 'react';

export default function PreviewModal({ url, onClose }) {
  const [viewMode, setViewMode] = useState('mobile'); // 'mobile' | 'desktop'

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-xl shadow-lg flex flex-col overflow-hidden transition-all ${
          viewMode === 'mobile'
            ? 'w-full max-w-md h-[85vh]'
            : 'w-full max-w-5xl h-[85vh]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <p className="text-sm font-medium text-gray-700">Davetiye Önizleme</p>

          <div className="flex items-center gap-2">
            <div className="flex rounded-md border overflow-hidden text-xs">
              <button
                onClick={() => setViewMode('mobile')}
                className={`px-3 py-1.5 ${
                  viewMode === 'mobile'
                    ? 'bg-[var(--color-primary,#d4a04a)] text-white'
                    : 'bg-white text-gray-600'
                }`}
              >
                📱 Mobil
              </button>
              <button
                onClick={() => setViewMode('desktop')}
                className={`px-3 py-1.5 ${
                  viewMode === 'desktop'
                    ? 'bg-[var(--color-primary,#d4a04a)] text-white'
                    : 'bg-white text-gray-600'
                }`}
              >
                💻 Masaüstü
              </button>
            </div>

            <button
              onClick={onClose}
              className="text-sm text-gray-500 hover:text-gray-800"
            >
              Kapat
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-gray-100 flex justify-center">
          <iframe
            src={url}
            title="Davetiye Önizleme"
            className={`border-0 bg-white ${
              viewMode === 'mobile' ? 'w-[390px] h-full' : 'w-full h-full'
            }`}
          />
        </div>
      </div>
    </div>
  );
}
