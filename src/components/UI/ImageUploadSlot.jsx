import React, { useState } from 'react';

const ImageUploadSlot = ({ title, description, onUpload, currentImageUrl, isUploading }) => {
  const [fileName, setFileName] = useState('');

   console.log('ImageUploadSlot currentImageUrl:', currentImageUrl);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    await onUpload(file);
  };

  const hasImage = currentImageUrl && currentImageUrl !== '';

  return (
    <div
      className={`relative rounded-[24px] border border-dashed  p-5 transition  ${hasImage ? 'border-green-500/30 bg-green-900/10' : 'border-white/12 bg-dark-bg/55 hover:border-[#B87333]/35 hover:bg-dark-bg/75'}`}
    >
      <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange} disabled={isUploading} accept="image/*" />
      {hasImage ? (
        <div className="flex items-center gap-4">
          <img src={currentImageUrl} alt={title} className="w-16 h-16 object-cover rounded-xl" />
          <div>
            <h3 className="font-[Manrope] text-lg font-semibold text-white">{title}</h3>
            <p className="mt-1 text-sm leading-6 text-white/55 truncate">
              {fileName || 'Imagem carregada.'}
            </p>
            <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onUpload(null); setFileName(''); }}
                className="text-xs text-red-400 hover:underline mt-1"
            >
                Remover
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/80">
            {isUploading ? '...' : '⊕'}
          </div>
          <h3 className="mt-5 font-[Manrope] text-lg font-semibold text-white">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-white/55">
            {isUploading ? `Enviando ${fileName}...` : description}
          </p>
        </>
      )}
    </div>
  );
};

export default ImageUploadSlot;
