# Changelog

All notable changes to Driver Log are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html). Versions below 1.0.0 may include changes that affect how existing data is stored.

## [Unreleased]

## [0.3.0] - 2026-11-28

### Added

- Expense categories for meals and for coffee and energy drinks.
- Dashboard cards for coffee and meals spending, as a total and per shift.

### Changed

- README rewritten: current features, how fuel economy works, an updated roadmap, and a note on how the app was built.

### Fixed

- Date and time inputs overflowing their columns on iOS Safari.
- Date and time inputs being slightly taller than the other form fields.

## [0.2.0] - 2026-11-27

### Added

- Fuel expenses now record liters, the odometer reading, and whether the tank was filled to full.
- Fuel economy (km per liter) on the dashboard, calculated between full-tank fill-ups.
- Work versus personal kilometers, and the estimated fuel cost of work driving.
- Backup and CSV export include the new fuel fields. Backups made before this version still restore.

## [0.1.0] - 2026-11-26

### Added

- Shift log with odometer readings, earnings, and tips, including shifts that cross midnight.
- Expense log with categories.
- Dashboard with weekly, monthly, and all-time views, net profit, per-km and per-hour figures, and a net-profit chart.
- Backup and restore as JSON, and CSV export.
- Installable, offline-capable PWA with all data stored locally in the browser.

[Unreleased]: https://github.com/alexvickers/driver-log/compare/v0.3.0...HEAD
[0.3.0]: https://github.com/alexvickers/driver-log/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/alexvickers/driver-log/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/alexvickers/driver-log/releases/tag/v0.1.0
