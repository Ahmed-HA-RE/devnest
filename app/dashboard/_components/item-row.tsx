import { format } from 'date-fns';
import { FaStar, FaThumbtack } from 'react-icons/fa6';

import { getIcon } from '@/components/icon-map';
import { Badge } from '@/components/ui/badge';
import { Prisma } from '@/prisma/generated/prisma/client';

export type ItemWithRelations = Prisma.ItemGetPayload<{
  include: {
    type: { select: { name: true; color: true } };
    tags: { include: { tag: { select: { name: true } } } };
  };
}>;

const ItemRow = ({ item }: { item: ItemWithRelations }) => {
  const Icon = getIcon(item.type.name);

  return (
    <div className='flex items-center gap-3 border-b px-4 py-3 last:border-b-0'>
      <div className='flex size-8 shrink-0 items-center justify-center rounded-md bg-muted'>
        {Icon({ className: 'size-4', style: { color: item.type.color ?? undefined } })}
      </div>
      <div className='min-w-0 flex-1'>
        <div className='flex items-center gap-2'>
          <span className='truncate font-medium'>{item.title}</span>
          {item.isPinned && (
            <FaThumbtack className='size-3 shrink-0 text-muted-foreground' />
          )}
          {item.isFavorite && (
            <FaStar className='size-3 shrink-0 text-yellow-500' />
          )}
        </div>
        <p className='truncate text-sm text-muted-foreground'>
          {item.description}
        </p>
        {item.tags.length > 0 && (
          <div className='mt-1.5 flex flex-wrap gap-1'>
            {item.tags.map(({ tag }) => (
              <Badge key={tag.name} variant='secondary'>
                {tag.name}
              </Badge>
            ))}
          </div>
        )}
      </div>
      <span className='shrink-0 text-xs text-muted-foreground'>
        {format(item.createdAt, 'MMM d')}
      </span>
    </div>
  );
};

export default ItemRow;
