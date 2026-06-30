import Image from 'next/image';
import { FaStar, FaThumbtack } from 'react-icons/fa6';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Prisma } from '@/prisma/generated/prisma/client';

export type ImageGalleryCardData = Prisma.ItemGetPayload<{
  select: {
    id: true;
    title: true;
    fileUrl: true;
    fileName: true;
    isPinned: true;
    isFavorite: true;
    type: { select: { name: true; color: true } };
  };
}>;

const ImageGalleryCard = ({
  item,
  onSelect,
}: {
  item: ImageGalleryCardData;
  onSelect: (itemId: string) => void;
}) => {
  return (
    <Card
      role='button'
      tabIndex={0}
      onClick={() => onSelect(item.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onSelect(item.id);
      }}
      className={cn('group cursor-pointer overflow-hidden pt-0')}
    >
      <CardContent className='px-0'>
        <div className='overflow-hidden'>
          {item.fileUrl ? (
            <Image
              src={item.fileUrl}
              alt={item.fileName ?? item.title}
              width={640}
              height={360}
              loading='eager'
              className='aspect-video w-full rounded-t-xl object-cover transition-transform duration-300 ease-in-out group-hover:scale-110'
            />
          ) : (
            <div className='flex aspect-video w-full items-center justify-center rounded-t-xl bg-muted'>
              <span className='text-xs text-muted-foreground'>No image</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardHeader className='flex flex-row items-start justify-between gap-2 pt-0'>
        <CardTitle className='line-clamp-2 text-sm font-medium leading-snug'>
          {item.title}
        </CardTitle>
        <div className='flex shrink-0 items-center gap-1.5'>
          {item.isPinned && (
            <FaThumbtack className='size-3.5 text-muted-foreground' />
          )}
          {item.isFavorite && <FaStar className='size-3.5 text-yellow-500' />}
        </div>
      </CardHeader>
    </Card>
  );
};

export default ImageGalleryCard;
