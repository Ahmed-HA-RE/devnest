import { Skeleton } from '@/components/ui/skeleton';

const ItemRowSkeleton = () => (
  <div className='flex items-center gap-3 border-b px-4 py-3 last:border-b-0'>
    <Skeleton className='size-8 shrink-0 rounded-md' />
    <div className='min-w-0 flex-1 space-y-2'>
      <Skeleton className='h-4 w-48' />
      <Skeleton className='h-3 w-32' />
    </div>
    <Skeleton className='h-3 w-10 shrink-0' />
  </div>
);

export default ItemRowSkeleton;
