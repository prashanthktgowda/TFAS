module.exports = {
  mongodb: {
    server: "mongodb", // Ensure this matches the service name
    port: 27017,
    admin: true,
    auth: [
      {
        database: "admin",
        username: "admin",
        password: "qwerty",
      },
    ],
  },
  site: {
    baseUrl: "/",
    cookieKeyName: "mongo-express",
    cookieSecret: "cookiesecret",
    sessionSecret: "sessionsecret",
  },
};
