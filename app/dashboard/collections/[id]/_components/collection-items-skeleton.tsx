import { Skeleton } from '@/components/ui/skeleton';

const CollectionItemsSkeleton = () => (
  <div className='flex flex-col gap-8'>
    {/* Images section */}
    <section>
      <Skeleton className='mb-3 h-5 w-20' />
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className='aspect-video w-full rounded-md' />
        ))}
      </div>
    </section>

    {/* Files section */}
    <section>
      <Skeleton className='mb-3 h-5 w-16' />
      <div className='flex flex-col gap-3'>
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className='h-20 w-full rounded-md' />
        ))}
      </div>
    </section>

    {/* Other items section */}
    <section>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className='h-32 w-full rounded-md' />
        ))}
      </div>
    </section>
  </div>
);

export default CollectionItemsSkeleton;
