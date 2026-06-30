'use client';

import { useRef, useState } from 'react';
import { IoIosCloudDownload } from 'react-icons/io';
import { toast } from 'sonner';
import { FILE_ALLOWED_EXTENSIONS, FILE_MAX_SIZE } from '@/lib/constants/type';
import { cn } from '@/lib/utils';

type FileUploadProps = {
  itemType: 'file' | 'image';
  currentFileUrl?: string | null;
  currentFileName?: string | null;
  onUploaded: (result: {
    url: string;
    fileName: string;
    fileSize: number;
  }) => void;
};

const FileUpload = ({
  itemType,
  currentFileUrl,
  currentFileName,
  onUploaded,
}: FileUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(
    currentFileUrl ?? null,
  );
  const [uploadedName, setUploadedName] = useState<string | null>(
    currentFileName ?? null,
  );

  const extensions = FILE_ALLOWED_EXTENSIONS[itemType];
  const maxMb = FILE_MAX_SIZE[itemType];
  const label = itemType === 'image' ? 'image' : 'file';
  const isUploading = progress !== null;

  const handleUpload = (file: File) => {
    setProgress(0);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('itemType', itemType);

    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        setProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener('load', () => {
      setProgress(null);
      type UploadResponse = {
        url: string;
        fileName: string;
        fileSize: number;
        message?: string;
      };
      let data: Partial<UploadResponse> = {};
      try {
        data = JSON.parse(xhr.responseText) as Partial<UploadResponse>;
      } catch {
        // ignore
      }
      if (xhr.status >= 200 && xhr.status < 300) {
        setUploadedUrl(data.url ?? null);
        setUploadedName(data.fileName ?? null);
        onUploaded({
          url: data.url ?? '',
          fileName: data.fileName ?? '',
          fileSize: data.fileSize ?? 0,
        });
        toast.success('File uploaded successfully');
      } else {
        toast.error(data.message ?? 'Upload failed');
      }
    });

    xhr.addEventListener('error', () => {
      setProgress(null);
      toast.error('Upload failed. Please try again.');
    });

    xhr.open('POST', '/api/upload');
    xhr.send(formData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  };

  const acceptAttr =
    itemType === 'image'
      ? 'image/jpeg,image/png,image/webp'
      : '.pdf,.docx,.xlsx,.txt';

  return (
    <div className='flex flex-col gap-2'>
      <div
        role='button'
        tabIndex={0}
        onClick={() => !isUploading && inputRef.current?.click()}
        onKeyDown={(e) =>
          !isUploading && e.key === 'Enter' && inputRef.current?.click()
        }
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDragEnd={() => setIsDragging(false)}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-8 transition-colors',
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50 hover:bg-muted/50',
          isUploading && 'pointer-events-none',
        )}
      >
        <input
          ref={inputRef}
          type='file'
          accept={acceptAttr}
          className='hidden'
          onChange={handleFileChange}
          disabled={isUploading}
        />

        <IoIosCloudDownload
          className={cn(
            'size-10 transition-colors',
            isUploading ? 'text-primary' : 'text-muted-foreground',
          )}
        />

        <div className='w-full text-center'>
          {isUploading ? (
            <>
              <p className='text-sm font-medium'>Uploading… {progress}%</p>
              <div className='mx-auto mt-2 h-1.5 w-48 overflow-hidden rounded-full bg-muted'>
                <div
                  className='h-full rounded-full bg-primary transition-all duration-200'
                  style={{ width: `${progress}%` }}
                />
              </div>
            </>
          ) : (
            <>
              <p className='text-sm font-medium'>Upload your {label}</p>
              <p className='mt-1 text-xs text-muted-foreground'>
                {extensions.join(', ')} &middot; max {maxMb}MB
              </p>
            </>
          )}
        </div>
      </div>

      {uploadedUrl && uploadedName && !isUploading && (
        <div className='flex items-center gap-2 rounded-md bg-muted px-3 py-2'>
          {itemType === 'image' && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={uploadedUrl}
              alt={uploadedName}
              className='h-10 w-10 shrink-0 rounded object-cover'
            />
          )}
          <span className='min-w-0 truncate text-xs text-muted-foreground'>
            {uploadedName}
          </span>
          <button
            type='button'
            className='ml-auto shrink-0 text-xs text-primary underline-offset-4 hover:underline'
            onClick={() => inputRef.current?.click()}
          >
            Replace
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
