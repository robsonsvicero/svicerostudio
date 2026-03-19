// src/components/UI/ImageUploadSlot.jsx
import React, { useState } from 'react';

const ImageUploadSlot = ({
  title,
  description,
  onUpload,
  currentImageUrl,
  isUploading,
  multiple = false,   // 1) nova prop
}) => {
  const [fileName, setFileName] = useState('');

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (multiple) {
      setFileName(
        files.length === 1 ? files[0].name : `${files.length} arquivos selecionados`
      );
      await onUpload(files);   // 2) passa array
    } else {
      const file = files[0];
      setFileName(file.name);
      await onUpload(file);    // 2) passa um arquivo
    }
  };

  const hasImage = currentImageUrl && currentImageUrl !== '';

  return (
    <div
      className={`relative rounded-[24px] border border-dashed p-5 transition ${
        hasImage
          ? 'border-green-500/30 bg-green-900/10'
          : 'border-white/12 bg-dark-bg/55 hover:border-[#B87333]/35 hover:bg-dark-bg/75'
      }`}
    >
      <input
        type="file"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={handleFileChange}
        disabled={isUploading}
        accept="image/*"
        multiple={multiple}  // 3) aqui é fundamental
      />

      {hasImage ? (
        <div className="flex items-center gap-4">
          <img src={currentImageUrl} alt={title} className="w-16 h-16 object-cover rounded-xl" />
          <div>
            <h3 className="font-[Manrope] text-lg font-semibold text-white">{title}</h3>
            <p className="mt-1 text-sm leading-6 text-white/55 truncate">
              {fileName || 'Imagem carregada.'}
            </p>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onUpload(null);
                setFileName('');
              }}
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