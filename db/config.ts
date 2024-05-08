import { column, defineDb, defineTable } from 'astro:db';

const User = defineTable({
  columns: {
    id: column.number({primaryKey: true, unique: true, autoIncrement: true,}),
    email: column.text(),
    name: column.text(),
    userimage: column.text(),
  }
})

const ShortenedUrl = defineTable({
  columns: {
    userID: column.number({
      references: () => User.columns.id}),
    url: column.text(),
    shortUrl: column.text(),
    visits: column.number(),
  }

})

// https://astro.build/db/config
export default defineDb({
  tables: {
    User,
    ShortenedUrl,
  }
});
