import { column, defineDb, defineTable } from 'astro:db';

const User = defineTable({
  columns: {
    id: column.number({primaryKey: true, unique: true, autoIncrement: true,}),
    email: column.text({unique: true}),
    name: column.text(),
    userimage: column.text(),
  
  }
})

const ShortenedUrl = defineTable({
  columns: {
    userID: column.number({
      references: () => User.columns.id}),
    url: column.text(),
    shortUrl: column.text({unique: true, primaryKey: true}),
    createdate: column.date(),
    name: column.text({default: 'No name'}),
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
  }
});
