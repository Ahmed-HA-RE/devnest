import { Skeleton } from '@/components/ui/skeleton';

const CollectionsGridSkeleton = () => (
  <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
    {Array.from({ length: 8 }).map((_, i) => (
      <Skeleton key={i} className='h-32 w-full rounded-md' />
    ))}
  </div>
);

export default CollectionsGridSkeleton;
