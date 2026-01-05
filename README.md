## Web Pets

Outline:
description of project
explain all the scripts
-how to build and run
-how to generate documentation


### Getting Started

To get started, create and populate the environment variables in `server/.env`, then run:

```
npm install
npm run build
npm run style
npm start
```

##### Overview of environment variables

* `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` - generated while registering the app with the [Google Cloud Platform](https://console.cloud.google.com/) to use Google authentication. Remember to also register the correct redirect API while registering the app. See [the Passport documentation](https://www.passportjs.org/tutorials/google/register/) for more information.
* `WEATHER_API_KEY` - the key for [Weather API](https://www.weatherapi.com/)
* `UPDATE_AT` - the hour from 0 to 23, where 0 is midnight and 23 is 11 PM, at which the server will run `UpdateAllPets` and `ClearWeatherCache`. Used to account for differing server timezones.

See `server/.env.example` for a template file.

### Scripts

### Tech Stack

* Client-side: React with Hooks
* Server-side: Node.js and Express
* Database: MongoDB with Mongoose
* Authentication: Passport with Google Authentication
* Styling: Tailwind CSS
* Building: Webpack and Babel
* External API: [Weather API](https://www.weatherapi.com/)