## Web Pets

Welcome to Web Pets! You've found a stray alley cat, and now it falls to you to care for it. If you treat it well, it might even go home with you one day.

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

* `npm start` - starts the application.
* `npm run dev` - starts the application and watch for changes. Automatically rebuilds and restarts for server, component, and styling changes.
* `npm run lint` - lints all files.
* `npm run build` - builds the client-side application using Webpack and Babel.
* `npm run style` - generates CSS using Tailwind.
* `npm run style:dev`- generates CSS and watches for changes.
* `npm run doc` - generates documentation using JSDoc. Documentation files are served statically at the `/docs` endpoint, or can be accessed directly by navigating to the generated files in the web browser.

### Tech Stack

* Client-side: React with Hooks
* Server-side: Node.js and Express
* Database: MongoDB with Mongoose
* Authentication: Passport with Google Authentication
* Styling: Tailwind CSS
* Building: Webpack and Babel
* External API: [Weather API](https://www.weatherapi.com/)

### Roadmap

#### Known Issues

* The client never automatically refreshes. If a user is on the page when the server runs the nightly pet updates, the user won't see any indication that the pet's stats have changed until either refreshing the page or otherwise triggering a refresh.

#### Feature Ideas

* Art assets for nighttime
* Some way for weather to interact with gameplay - possibly the pet would need specific care (warmth, shelter, etc.) depending on the weather conditions or risk a health penalty
* Location specific weather - currently the weather always matches New Orleans rather than or allowing the user to specify a location or finding the location from their ip

### Contributing

This project uses a forking workflow. To contribute, fork the project onto your own account and clone down. Work on feature branches, then push changes to a feature branch on your own repo's GitHub. Open a pull request from the feature branch. Changes must be approved by at least one other team member before being merged into the organization's main branch and deployed.

### Style Guide

We used the recommended ESLint settings, but enforced using semicolons everywhere and forbade console.log statements (except for debugging, on a temporary basis). Anything that needs to be logged, such as server statuses or errors, should use console.info, console.warn, or console.error. We failed to get ESLint to stop complaining that props were missing from prop validation.

### Documentation

This project uses JSDoc to generate documentation from comments in the source code. To generate the documentation, run `npm run doc`. Documentation can be accessed after generation either by navigating to the generated html files, or by running the server and navigating to `{server address}/docs`.