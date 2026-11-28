# Driver Log

A mobile-first, installable web app for rideshare drivers to track earnings, expenses, distance, and fuel economy, and see what they actually take home.

**Live demo:** [https://driver-log-beta.vercel.app/](https://driver-log-beta.vercel.app/)

## Why

Platform dashboards show gross earnings. They don't show what a shift really paid after fuel, tolls, coffee, and maintenance, or what each kilometer and each hour of driving is worth. Driver Log answers those questions with a few quick entries per shift.

## Features

- **Shift log:** date, start and end time, start and end odometer, gross earnings, and tips. Distance, hours, and earnings per km and per hour are calculated automatically. Overnight shifts are supported.
- **Expense log:** fuel, meals, coffee and energy drinks, maintenance, car wash, tolls, and other. Fuel entries also take liters, the odometer reading, and whether the tank was filled to full.
- **Dashboard:** weekly, monthly, and all-time views with net profit, gross, expenses, distance, time driving, gross per km, net per hour, cost per km, spending on coffee and meals (total and per shift), and a net-profit chart.
- **Fuel economy:** km per liter, the split between work and personal driving, and the estimated fuel cost of work driving (see below).
- **Backup and restore:** export all data as JSON or CSV, and restore from a JSON file.
- **Offline-first PWA:** installable on a phone's home screen and usable without a connection.
- **Private by design:** all data stays in the browser. There is no account, no backend, and no tracking.

## How fuel economy works

Driver Log uses the full-tank method. Between two fuel entries marked "filled to full" that have an odometer reading, every liter added after the first one was burned over the distance between them, including liters from partial fill-ups in between. Fuel economy is that distance divided by those liters.

That distance covers all driving, personal and work. Kilometers covered by logged shifts (matched by odometer range) count as work, and the rest counts as personal. This gives a work-versus-personal split and an estimate of the fuel cost of work driving, without having to refuel before and after every shift.

It is an average, so it assumes personal and work driving use fuel at a similar rate.

## Tech stack

- [Next.js](https://nextjs.org/) (App Router) with TypeScript, exported as a static site
- Plain CSS with design tokens and automatic dark mode
- [Dexie](https://dexie.org/) (IndexedDB) for local storage
- [Recharts](https://recharts.org/) for charts
- Web app manifest and service worker for PWA support
- Deployed on [Vercel](https://vercel.com/)

## Getting started

```bash
git clone https://github.com/alexvickers/driver-log
cd driver-log
npm install
npm run dev
```

Open <http://localhost:3000>.

To create the static production build:

```bash
npm run build
```

The output is written to `out/` and can be served by any static host. The service worker only registers in production builds, so installing the app and testing offline use require the built version.

## Data and privacy

Everything is stored in your browser's IndexedDB, and data is tied to the exact domain it was saved on. Clearing site data, switching browsers, or moving the app to a different domain starts you with an empty log. Use the backup feature to export your data periodically and to move it between devices or domains.

## Project structure

```
app/            Routes: dashboard, shifts, expenses, backup
components/     Views, navigation, and the profit chart
lib/db.ts       Dexie database
lib/stats.ts    Calculations: distance, hours, per-km and per-hour figures, fuel intervals
lib/types.ts    Shift and expense types, expense categories
lib/format.ts   Currency, number, and date helpers
public/         Web app manifest, service worker, icons
```

## Roadmap

Next:

- Weekly net-profit target with progress on the dashboard
- Editing existing shifts and expenses
- Maintenance reminders based on odometer readings
- Unit tests for the stats logic

Version 2:

- A native app (React Native or similar) with GPS trip tracking. A web app can't track location reliably in the background, so this needs a proper native build.
- Optional cloud sync and login

## How it was built

Driver Log was planned and built in collaboration with [Claude](https://claude.ai), Anthropic's AI assistant, which helped with scoping, code, and documentation. I set the requirements, made the product decisions, tested the app, and deployed it.

## License

Released under the [MIT License](LICENSE).
