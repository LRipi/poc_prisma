import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const foo = await prisma.user.upsert({
    where: { email: 'foo@foo.foo' },
    update: {},
    create: {
      email: 'foo@foo.foo',
      name: 'foo',
      role: 'USER',
      posts: {
        create: [
          {
            title: 'nmrhi',
            published: true,
            content: 'f**k we fail again..',
          },
          {
            title: 'nmrhiII',
            published: false,
            content: 'f**k we fail again..',
          },
        ],
      },
    },
  })
  const bar = await prisma.user.upsert({
    where: { email: 'bar@bar.bar' },
    update: {},
    create: {
      email: 'bar@bar.bar',
      name: 'bar',
      role: 'ADMIN',
      posts: {
        create: [
          {
            title: 'eheh',
            published: true,
            content: 'ohoh',
          },
        ],
      },
    },
  })
  console.log({ foo, bar })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
