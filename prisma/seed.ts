import 'dotenv/config';
import { randomUUID } from 'crypto';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from './generated/prisma/client';
import { itemTypes, collections, items } from './seed-data';

const currentUser = { id: 'DLDeIPI8SS6g4FiWEkdZlifEjKGn1JFd', name: 'Ahmed Haitham', email: 'ah607k@gmail.com' };
const demoUserId = 'user-1';

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.itemTag.deleteMany({ where: { tag: { userId: { in: [currentUser.id, demoUserId] } } } });
  await prisma.tag.deleteMany({ where: { userId: { in: [currentUser.id, demoUserId] } } });
  await prisma.item.deleteMany({ where: { userId: { in: [currentUser.id, demoUserId] } } });
  await prisma.collection.deleteMany({ where: { userId: { in: [currentUser.id, demoUserId] } } });
  await prisma.user.deleteMany({ where: { id: demoUserId } });

  await prisma.itemType.createMany({
    data: itemTypes.map((type) => ({
      id: type.id,
      name: type.name,
      icon: type.icon,
      color: type.color,
      isSystem: type.isSystem,
    })),
    skipDuplicates: true,
  });

  await prisma.collection.createMany({
    data: collections.map((collection) => ({
      id: collection.id,
      name: collection.name,
      description: collection.description,
      isFavorite: collection.isFavorite,
      userId: currentUser.id,
      createdAt: new Date(collection.createdAt),
      updatedAt: new Date(collection.updatedAt),
    })),
  });

  await prisma.item.createMany({
    data: items.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      contentType: item.contentType,
      content: item.content,
      language: item.language,
      isFavorite: item.isFavorite,
      isPinned: item.isPinned,
      userId: currentUser.id,
      typeId: item.typeId,
      collectionId: item.collectionId,
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt),
    })),
  });

  const tagNames = [...new Set(items.flatMap((item) => item.tags))];
  const tagIds = new Map(tagNames.map((name) => [name, randomUUID()]));

  await prisma.tag.createMany({
    data: tagNames.map((name) => ({
      id: tagIds.get(name)!,
      name,
      userId: currentUser.id,
    })),
  });

  await prisma.itemTag.createMany({
    data: items.flatMap((item) =>
      item.tags.map((tagName) => ({
        itemId: item.id,
        tagId: tagIds.get(tagName)!,
      })),
    ),
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
