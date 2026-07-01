import Link from 'next/link';
import { FaRegFolderOpen, FaStar } from 'react-icons/fa6';

import { getIcon } from '@/components/icon-map';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { getBorderColor, getTextColor } from '@/lib/colors';
import { cn } from '@/lib/utils';

export type CollectionType = { id: string; name: string; color: string | null };

type CollectionCardProps = {
  id: string;
  name: string;
  isFavorite: boolean;
  description: string | null;
  itemCount: number;
  types: CollectionType[];
  primaryType: CollectionType | null;
};

const CollectionCard = ({
  id,
  name,
  isFavorite,
  description,
  itemCount,
  types,
  primaryType,
}: CollectionCardProps) => {
  const { className: borderClassName, style: borderStyle } = getBorderColor(
    primaryType?.color ?? undefined,
  );

  return (
    <Link href={`/dashboard/collections/${id}`} className='block h-full'>
      <Card
        className={cn(
          'h-full cursor-pointer border-l-4 transition-colors hover:bg-accent/50',
          borderClassName,
        )}
        style={borderStyle}
      >
        <CardHeader className='flex-row items-center justify-between'>
          <div className='flex items-center gap-2'>
            <FaRegFolderOpen />
            <span className='font-medium'>{name}</span>
            {isFavorite && <FaStar className='size-3 text-yellow-500' />}
          </div>
        </CardHeader>
        <CardContent>
          <p className='text-sm text-muted-foreground'>
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </p>
          {description && (
            <p className='mt-1 text-sm text-muted-foreground'>{description}</p>
          )}
          {types.length > 0 && (
            <div className='mt-3 flex gap-2'>
              {types.map((type) => {
                const TypeIcon = getIcon(type.name);
                const { className, style } = getTextColor(
                  type.color ?? undefined,
                );
                return (
                  <TypeIcon
                    key={type.id}
                    className={cn('size-4 text-muted-foreground', className)}
                    style={style}
                  />
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default CollectionCard;
