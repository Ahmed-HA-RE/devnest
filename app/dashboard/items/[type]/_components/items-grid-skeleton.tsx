import ItemCardSkeleton from './item-card-skeleton';

const ITEMS_GRID_SKELETON_COUNT = 6;

const ItemsGridSkeleton = () => (
  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
    {Array.from({ length: ITEMS_GRID_SKELETON_COUNT }).map((_, i) => (
      <ItemCardSkeleton key={i} />
    ))}
  </div>
);

export default ItemsGridSkeleton;