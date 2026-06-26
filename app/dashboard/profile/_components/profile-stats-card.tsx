import { FaRegFolderOpen } from 'react-icons/fa';
import { LuTag } from 'react-icons/lu';

import { getIcon } from '@/components/icon-map';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getTextColor } from '@/lib/colors';
import { prisma } from '@/lib/db';
import { cn } from '@/lib/utils';

// Display order for system item types, matching the dashboard sidebar.
const ITEM_TYPE_ORDER = [
  'snippet',
  'command',
  'note',
  'file',
  'prompt',
  'image',
  'link',
];

const ProfileStatsCard = async ({ userId }: { userId: string }) => {
  const [itemTypes, collectionCount, tagCount] = await Promise.all([
    prisma.itemType.findMany({
      where: { isSystem: true },
      include: {
        _count: { select: { items: { where: { userId } } } },
      },
    }),
    prisma.collection.count({ where: { userId } }),
    prisma.tag.count({ where: { userId } }),
  ]);

  const sortedItemTypes = [...itemTypes].sort(
    (a, b) => ITEM_TYPE_ORDER.indexOf(a.name) - ITEM_TYPE_ORDER.indexOf(b.name),
  );

  const stats = [
    ...sortedItemTypes.map((type) => ({
      label: `${type.name.charAt(0).toUpperCase()}${type.name.slice(1)}s`,
      value: type._count.items,
      icon: getIcon(type.name),
      color: type.color,
    })),
    {
      label: 'Collections',
      value: collectionCount,
      icon: FaRegFolderOpen,
      color: 'purple',
    },
    { label: 'Tags', value: tagCount, icon: LuTag, color: 'blue' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Stats</CardTitle>
        <CardDescription>
          A quick look at everything you&apos;ve stored.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4'>
          {stats.map(({ label, value, icon: Icon, color }) => {
            const { className, style } = getTextColor(color ?? undefined);

            return (
              <div
                key={label}
                className='flex items-center gap-3 rounded-lg border p-3'
              >
                <div className='flex size-9 items-center justify-center rounded-lg bg-muted'>
                  <Icon className={cn('size-4', className)} style={style} />
                </div>
                <div>
                  <p className='text-lg leading-none font-semibold'>
                    {value}
                  </p>
                  <p className='text-xs text-muted-foreground'>{label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileStatsCard;