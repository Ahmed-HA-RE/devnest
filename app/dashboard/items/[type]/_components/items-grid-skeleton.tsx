import FileListCardSkeleton from './file-list-card-skeleton';
import ImageGalleryCardSkeleton from './image-gallery-card-skeleton';
import ItemCardSkeleton from './item-card-skeleton';

const ITEMS_GRID_SKELETON_COUNT = 6;

export const ImageGalleryGridSkeleton = () => (
  <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
    {Array.from({ length: ITEMS_GRID_SKELETON_COUNT }).map((_, i) => (
      <ImageGalleryCardSkeleton key={i} />
    ))}
  </div>
);

export const FileListGridSkeleton = () => (
  <div className='flex flex-col gap-3'>
    {Array.from({ length: ITEMS_GRID_SKELETON_COUNT }).map((_, i) => (
      <FileListCardSkeleton key={i} />
    ))}
  </div>
);

const ItemsGridSkeleton = () => (
  <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
    {Array.from({ length: ITEMS_GRID_SKELETON_COUNT }).map((_, i) => (
      <ItemCardSkeleton key={i} />
    ))}
  </div>
);

export default ItemsGridSkeleton;