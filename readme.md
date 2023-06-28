# About this project
Website for Paradise247 server based on Node.js. This website allows you to check Top5 players, global server statustics with graphs, stats per player and manage player account (such as password, nickname and avatar). [Live demo.](https://paradise.gta3.pl)

# Third Party Depedencies (use npm install)
- Express
- Hbs (Handlebars)
- Chart.js
- MySQL2
- Sha256
- Morgan
- Http-Errors
- Cookie-Session
- Config

# Installation
Assume that you have Node.js installed and configured with all third party depedencies (listed above) along with fully working and configured Paradise247 server (with it's database). Go to the ```/bin/config/default.config.json``` file and edit it's details. The default file should look like this:
```JSON
{
  "site": {
    "title": "Site Name"
  },
  "cookie": {
    "name": "CookieSessionName",
    "maxAge": 86400000,
    "keys": {
      "1": "TopSecretKey1",
      "2": "TopSecretKey2"
    }
  },
  "database": {
    "host": "localhost",
    "port": 3306,
    "user": "dbusername",
    "password": "dbassword",
    "database": "dbname"
  },
  "auth": {
    "maxFails": 5,
    "banTime": 900000
  }
}
```
After that you can launch ```/bin/www``` node application.