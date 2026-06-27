import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const ItemCardSkeleton = () => (
  <Card>
    <CardHeader className='flex-row items-center justify-between'>
      <div className='flex items-center gap-2'>
        <Skeleton className='size-4 rounded-full' />
        <Skeleton className='h-4 w-32' />
      </div>
      <Skeleton className='size-3 rounded-full' />
    </CardHeader>
    <CardContent className='space-y-3'>
      <Skeleton className='h-4 w-full' />
      <div className='flex gap-1'>
        <Skeleton className='h-5 w-14 rounded-full' />
        <Skeleton className='h-5 w-14 rounded-full' />
      </div>
      <Skeleton className='h-3 w-20' />
    </CardContent>
  </Card>
);

export default ItemCardSkeleton;