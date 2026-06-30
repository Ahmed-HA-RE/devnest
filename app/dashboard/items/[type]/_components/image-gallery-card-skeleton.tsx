import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const ImageGalleryCardSkeleton = () => (
  <Card className='overflow-hidden pt-0'>
    <CardContent className='px-0'>
      <Skeleton className='aspect-video w-full rounded-t-xl rounded-b-none' />
    </CardContent>
    <CardHeader className='pt-3'>
      <Skeleton className='h-4 w-3/4' />
    </CardHeader>
  </Card>
);

export default ImageGalleryCardSkeleton;