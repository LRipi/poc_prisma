## poc Prisma

#### install

```
docker-compose up -d
npm i
```
apply migrations
```
npx prisma migrate dev
```
seed the db
```
npx prisma db seed --preview-feature
```

#### run

```
npm start
```
or for development
```
npm run dev
```

#### generating Prisma Client

```
prisma generate
```

After each new changes in `schema.prisma` the Prisma Client needs to be re-generated:

> Whenever you make changes to your database that are reflected in the Prisma schema, you need to manually re-generate Prisma Client to update the generated code [...].

