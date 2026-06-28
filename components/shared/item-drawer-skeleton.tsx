import { DrawerDescription, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Skeleton } from '@/components/ui/skeleton';

const ItemDrawerSkeleton = () => (
  <>
    <DrawerHeader>
      <DrawerTitle asChild>
        <div className='flex items-center gap-3'>
          <Skeleton className='size-10 rounded-lg' />
          <Skeleton className='h-6 w-40' />
        </div>
      </DrawerTitle>
      <DrawerDescription asChild>
        <div className='flex gap-2 pt-2'>
          <Skeleton className='h-5 w-16 rounded-full' />
          <Skeleton className='h-5 w-16 rounded-full' />
        </div>
      </DrawerDescription>
    </DrawerHeader>
    <div className='flex flex-col gap-6 overflow-y-auto px-4 pb-4'>
      <div className='flex gap-4'>
        <Skeleton className='h-8 w-20' />
        <Skeleton className='h-8 w-20' />
        <Skeleton className='h-8 w-20' />
      </div>
      <div className='space-y-2'>
        <Skeleton className='h-4 w-24' />
        <Skeleton className='h-4 w-full' />
      </div>
      <div className='space-y-2'>
        <Skeleton className='h-4 w-24' />
        <Skeleton className='h-40 w-full' />
      </div>
    </div>
  </>
);

export default ItemDrawerSkeleton;