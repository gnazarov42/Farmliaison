import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed User Data
  const user1 = await prisma.user.create({
    data: {
      email: 'farmer1@example.com',
      password: 'password123',
      name: 'John Doe',
      phone: '1234567890',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'urbanite1@example.com',
      password: 'password123',
      name: 'Jane Doe',
      phone: '0987654321',
    },
  });

  // Seed FarmProfile Data
  const farm1 = await prisma.farmProfile.create({
    data: {
      userId: user1.id,
      name: 'Happy Farm',
      description: JSON.stringify({
        en: 'A peaceful place',
        es: 'Un lugar tranquilo',
        // Add more languages as needed
      }),
      location: 'Countryside',
      latitude: 40.7128,
      longitude: 74.006,
    },
  });

  // Seed Activity Data
  const activity1 = await prisma.activity.create({
    data: {
      name: JSON.stringify({
        en: 'Farm Tour',
        es: 'Recorrido por la Granja',
        // Add more languages as needed
      }),
    },
  });

  // Seed FarmActivity Data
  await prisma.farmActivity.create({
    data: {
      farmId: farm1.id,
      activityId: activity1.id,
    },
  });

  // Seed Product Data
  await prisma.product.create({
    data: {
      farmId: farm1.id,
      name: JSON.stringify({
        en: 'Organic Carrots',
        es: 'Zanahorias orgánicas',
      }),
      description: JSON.stringify({
        en: 'Freshly picked organic carrots.',
        es: 'Zanahorias orgánicas recién recogidas.',
      }),
      price: 3.99,
      pictures: [],
    },
  });

  // Seed Booking Data
  await prisma.booking.create({
    data: {
      userId: user2.id,
      farmId: farm1.id,
      date: new Date(),
    },
  });

  // Seed JobOpening Data
  await prisma.jobOpening.create({
    data: {
      farmId: farm1.id,
      title: JSON.stringify({
        en: 'Harvest Helper',
        es: 'Ayudante de cosecha',
      }),
      description: JSON.stringify({
        en: 'Need someone to help with the harvest.',
        es: 'Necesito alguien para ayudar con la cosecha.',
      }),
      startDate: new Date(),
    },
  });

  // Seed Review Data
  await prisma.review.create({
    data: {
      rating: 5,
      content: JSON.stringify({
        en: 'Fantastic experience!',
        es: '¡Experiencia fantástica!',
      }),
      reviewerId: user2.id,
      reviewedId: user1.id,
      pictures: [],
    },
  });

  // Seed Event Data
  await prisma.event.create({
    data: {
      name: JSON.stringify({
        en: 'Summer Festival',
        es: 'Festival de verano',
      }),
      description: JSON.stringify({
        en: 'A celebration of summer at Happy Farm.',
        es: 'Una celebración del verano en Happy Farm.',
      }),
      date: new Date(),
      location: 'Happy Farm',
      latitude: 40.7128,
      longitude: 74.006,
      creatorFarmId: farm1.id,
    },
  });

  // Seed Favorite Data
  await prisma.favorite.create({
    data: {
      userId: user2.id,
      farmId: farm1.id,
    },
  });

  // console.log('Seeding complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
