import { format } from 'date-fns';
import { FaDownload, FaFileAlt, FaStar, FaThumbtack } from 'react-icons/fa';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getBorderColor } from '@/lib/colors';
import { cn } from '@/lib/utils';
import { Prisma } from '@/prisma/generated/prisma/client';

export type FileListCardData = Prisma.ItemGetPayload<{
  select: {
    id: true;
    title: true;
    description: true;
    fileUrl: true;
    fileName: true;
    fileSize: true;
    isPinned: true;
    isFavorite: true;
    createdAt: true;
    type: { select: { name: true; color: true } };
  };
}>;

const formatFileSize = (bytes: number | null): string => {
  if (bytes === null) return 'Unknown size';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1073741824) return `${(bytes / 1048576).toFixed(1)} MB`;
  return `${(bytes / 1073741824).toFixed(1)} GB`;
};

const FileListCard = ({
  item,
  onSelect,
}: {
  item: FileListCardData;
  onSelect: (itemId: string) => void;
}) => {
  const { className, style } = getBorderColor(item.type.color ?? undefined);
  const downloadUrl = item.fileUrl?.replace('/upload/', '/upload/fl_attachment/');

  return (
    <Card
      role='button'
      tabIndex={0}
      onClick={() => onSelect(item.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onSelect(item.id);
      }}
      className={cn('cursor-pointer border-l-4', className)}
      style={style}
    >
      <CardContent className='flex flex-col gap-4 md:flex-row md:items-center'>
        <div
          className='flex size-14 shrink-0 items-center justify-center rounded-lg bg-muted'
          style={{ color: item.type.color ?? undefined }}
        >
          <FaFileAlt className='size-7' />
        </div>

        <div className='min-w-0 flex-1'>
          <div className='flex items-start justify-between gap-2'>
            <p className='truncate text-sm font-semibold'>{item.title}</p>
            <div className='flex shrink-0 items-center gap-1.5'>
              {item.isPinned && (
                <FaThumbtack className='size-3.5 text-muted-foreground' />
              )}
              {item.isFavorite && (
                <FaStar className='size-3.5 text-yellow-500' />
              )}
            </div>
          </div>

          {item.description && (
            <p className='mt-1 line-clamp-2 text-xs text-muted-foreground'>
              {item.description}
            </p>
          )}

          <div className='mt-2 flex items-center gap-3 text-xs text-muted-foreground'>
            <span>{formatFileSize(item.fileSize)}</span>
            <span className='text-muted-foreground/40'>•</span>
            <span>{format(item.createdAt, 'MMM d, yyyy')}</span>
          </div>
        </div>

        {downloadUrl && (
          <a
            href={downloadUrl}
            download={item.fileName ?? item.title}
            onClick={(e) => e.stopPropagation()}
            className='shrink-0 self-end md:self-auto'
          >
            <Button size='icon' variant='outline' tabIndex={-1}>
              <FaDownload />
            </Button>
          </a>
        )}
      </CardContent>
    </Card>
  );
};

export default FileListCard;