import { format } from 'date-fns';
import { FaStar, FaThumbtack } from 'react-icons/fa6';

import { getIcon } from '@/components/icon-map';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { getBorderColor } from '@/lib/colors';
import { cn } from '@/lib/utils';
import { Prisma } from '@/prisma/generated/prisma/client';

export type ItemCardData = Prisma.ItemGetPayload<{
  select: {
    id: true;
    title: true;
    isPinned: true;
    isFavorite: true;
    createdAt: true;
    type: { select: { name: true; color: true } };
    tags: { select: { tag: { select: { name: true } } } };
  };
}>;

const renderTypeIcon = (item: ItemCardData) => {
  const Icon = getIcon(item.type.name);
  return (
    <Icon className='size-4' style={{ color: item.type.color ?? undefined }} />
  );
};

const ItemCard = ({
  item,
  onSelect,
}: {
  item: ItemCardData;
  onSelect: (itemId: string) => void;
}) => {
  const { className, style } = getBorderColor(item.type.color ?? undefined);

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
      <CardHeader className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          {renderTypeIcon(item)}
          <span className='font-medium'>{item.title}</span>
        </div>
        <div className='flex items-center gap-1.5'>
          {item.isPinned && (
            <FaThumbtack className='size-4 text-muted-foreground' />
          )}
          {item.isFavorite && <FaStar className='size-4 text-yellow-500' />}
        </div>
      </CardHeader>
      <CardContent>
        {item.tags.length > 0 && (
          <div className='flex flex-wrap gap-1'>
            {item.tags.map(({ tag }) => (
              <Badge key={tag.name} variant='secondary'>
                {tag.name}
              </Badge>
            ))}
          </div>
        )}
        <p className='mt-3 text-xs text-muted-foreground'>
          {format(item.createdAt, 'MMM d, yyyy')}
        </p>
      </CardContent>
    </Card>
  );
};

export default ItemCard;