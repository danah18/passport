# Server Setup

1. Run `npm install`
2. Setup local mongodb server following these instructions https://www.prisma.io/dataguide/mongodb/setting-up-a-local-mongodb-database
3. Create new db called `passport`
4. Use `npm run dev` for local development

If you have another db url, create a `.env` file in the server folder and add a new entry `MONGODB_URI=mongodb://127.0.0.1:27017/passport`

## Testing

To run tests, execute `npm test`