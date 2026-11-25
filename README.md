# Driver Log

A mobile-first, installable web app for rideshare drivers to track earnings, expenses, distance, and time driving, and see what they actually take home.

**Live demo:** [https://driver-log-beta.vercel.app/](https://driver-log-beta.vercel.app/)

## Why

Platform dashboards show gross earnings. They don't show what a shift really paid after fuel, tolls, and maintenance, or what each kilometer and each hour of driving is worth. Driver Log answers those questions with a few quick entries per shift.

## Features

- **Shift log:** date, start and end time, start and end odometer, gross earnings, and tips. Distance, hours, and earnings per km and per hour are calculated automatically. Overnight shifts are supported.
- **Expense log:** fuel, maintenance, car wash, tolls, and other, with optional liters for fuel entries.
- **Dashboard:** weekly, monthly, and all-time views with net profit, gross, expenses, distance, time driving, gross per km, net per hour, cost per km, and a net-profit chart.
- **Backup and restore:** export all data as JSON and import it back.
- **Offline-first PWA:** installable on a phone's home screen and usable without a connection.
- **Private by design:** all data stays in the browser. There is no account, no backend, and no tracking.

## Tech stack

- [Next.js](https://nextjs.org/) (App Router) with TypeScript, exported as a static site
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Dexie](https://dexie.org/) (IndexedDB) for local storage
- [Recharts](https://recharts.org/) for charts
- Web app manifest and service worker for PWA support
- Deployed on [Vercel](https://vercel.com/)

## Getting started

```bash
git clone https://github.com/alexvickers/driver-log.git
cd driver-log
npm install
npm run dev
```

Open <http://localhost:3000>.

To create the static production build:

```bash
npm run build
```

The output is written to `out/` and can be served by any static host.

## Data and privacy

Everything is stored in your browser's IndexedDB, and data is tied to the exact domain it was saved on. Clearing site data, switching browsers, or moving the app to a different domain starts you with an empty log. Use the backup feature to export your data periodically and to move it between devices or domains.

## Project structure

```
app/            Pages and layout (dashboard, shifts, expenses, backup)
components/     UI components and charts
lib/db.ts       Dexie database and data access
lib/stats.ts    Calculations (distance, hours, per-km and per-hour figures)
public/         Web app manifest, service worker, icons
```

## Roadmap

- Fuel efficiency (km per liter) and cost trends
- Maintenance reminders based on odometer readings
- GPS-assisted trip tracking
- Optional cloud sync and login
- CSV export

## License

MIT. See [LICENSE](LICENSE).
