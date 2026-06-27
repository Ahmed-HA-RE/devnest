import { format } from 'date-fns';
import { FaStar, FaThumbtack } from 'react-icons/fa6';

import type { ItemWithRelations } from '@/app/dashboard/_components/item-row';
import { getIcon } from '@/components/icon-map';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { getBorderColor } from '@/lib/colors';
import { cn } from '@/lib/utils';

const renderTypeIcon = (item: ItemWithRelations) => {
  const Icon = getIcon(item.type.name);
  return (
    <Icon className='size-4' style={{ color: item.type.color ?? undefined }} />
  );
};

const ItemCard = ({ item }: { item: ItemWithRelations }) => {
  const { className, style } = getBorderColor(item.type.color ?? undefined);

  return (
    <Card className={cn('border-l-4', className)} style={style}>
      <CardHeader className='flex-row items-center justify-between'>
        <div className='flex items-center gap-2'>
          {renderTypeIcon(item)}
          <span className='font-medium'>{item.title}</span>
        </div>
        <div className='flex items-center gap-1.5'>
          {item.isPinned && (
            <FaThumbtack className='size-3 text-muted-foreground' />
          )}
          {item.isFavorite && <FaStar className='size-3 text-yellow-500' />}
        </div>
      </CardHeader>
      <CardContent>
        {item.description && (
          <p className='text-sm text-muted-foreground'>{item.description}</p>
        )}
        {item.tags.length > 0 && (
          <div className='mt-3 flex flex-wrap gap-1'>
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