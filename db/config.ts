import { column, defineDb, defineTable } from 'astro:db';

const User = defineTable({
  columns: {
    id: column.text({primaryKey: true, unique: true}),
    email: column.text({unique: true}),
    username: column.text(),
    userimage: column.text(),
    providerID: column.text(),
  }
})

const Session = defineTable({
  columns: {
    id: column.text({ primaryKey: true, optional: false, unique: true }),
    userId: column.text({ optional: false, references: () => User.columns.id }),
    createdAt: column.date({ optional: false, default: new Date() }),
    expiresAt: column.number({ optional: false }),
  },
});

const ShortenedUrl = defineTable({
  columns: {
    userID: column.text({
      references: () => User.columns.id}),
    url: column.text(),
    shortUrl: column.text({unique: true, primaryKey: true}),
    createDate: column.date(),
    nameURL: column.text({default: 'No name'}),
  }
})

const Analytics = defineTable({
  columns: {
    shortUrl: column.text({
      references: () => ShortenedUrl.columns.shortUrl}),
    visits: column.number(),
    date: column.date(),
  }
})

// https://astro.build/db/config
export default defineDb({
  tables: {
    User,
    ShortenedUrl,
    Analytics,
    Session,
  }
});
