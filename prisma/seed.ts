import 'dotenv/config';
import { randomUUID } from 'crypto';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from './generated/prisma/client';
import { itemTypes, collections, items } from './seed-data';

const currentUser = { id: 'user-1', name: 'John Doe', email: 'john@example.com', image: '/images/default-avatar.png', isPro: false };

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.itemTag.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.item.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.itemType.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.create({
    data: {
      id: currentUser.id,
      name: currentUser.name,
      email: currentUser.email,
      emailVerified: true,
      image: currentUser.image,
      isPro: currentUser.isPro,
    },
  });

  await prisma.itemType.createMany({
    data: itemTypes.map((type) => ({
      id: type.id,
      name: type.name,
      icon: type.icon,
      color: type.color,
      isSystem: type.isSystem,
    })),
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
