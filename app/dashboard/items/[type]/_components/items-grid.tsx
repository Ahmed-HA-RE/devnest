import { notFound } from 'next/navigation';

import { getIcon } from '@/components/icon-map';
import EmptyState from '@/components/shared/empty-state';
import { prisma } from '@/lib/db';
import ItemsGridClient from './items-grid-client';

const ItemsGrid = async ({
  userId,
  type,
}: {
  userId: string;
  type: string;
}) => {
  const itemType = await prisma.itemType.findFirst({
    where: { name: type, OR: [{ isSystem: true }, { userId }] },
  });

  if (!itemType) {
    return notFound();
  }

  const items = await prisma.item.findMany({
    where: { userId, typeId: itemType.id },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      isPinned: true,
      isFavorite: true,
      createdAt: true,
      type: { select: { name: true, color: true } },
      tags: { select: { tag: { select: { name: true } } } },
    },
  });

  if (items.length === 0) {
    const label = `${type.charAt(0).toUpperCase()}${type.slice(1)}s`;
    return (
      <EmptyState
        icon={getIcon(type)}
        title={`No ${label.toLowerCase()} yet`}
        description={`${label} you create will show up here.`}
      />
    );
  }

  return <ItemsGridClient items={items} />;
};

export default ItemsGrid;