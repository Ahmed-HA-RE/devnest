import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const FileListCardSkeleton = () => (
  <Card>
    <CardContent className='flex flex-col gap-4 md:flex-row md:items-center'>
      <Skeleton className='size-14 shrink-0 rounded-lg' />
      <div className='min-w-0 flex-1 space-y-2'>
        <Skeleton className='h-4 w-2/3' />
        <Skeleton className='h-3 w-full' />
        <div className='flex gap-3'>
          <Skeleton className='h-3 w-16' />
          <Skeleton className='h-3 w-24' />
        </div>
      </div>
      <Skeleton className='size-9 shrink-0 rounded-md self-end md:self-auto' />
    </CardContent>
  </Card>
);

export default FileListCardSkeleton;