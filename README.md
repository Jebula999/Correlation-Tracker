# Daily Activity Tracker PWA

This is a minimal, mobile-friendly, offline-first Progressive Web App (PWA) built to track daily activities. It is designed to be simple, fast, and entirely private, with all data stored exclusively in your browser's `localStorage`.

The application is built with React and Vite, with a focus on having minimal dependencies.

## Features

- **Dashboard:** A central view with icon-based buttons for quickly logging events like Food, Sleep, Mood, Energy, and more.
- **Drill-Down Logging:** A recursive navigation system allows for detailed event tracking (e.g., Food > Dinner > Main > Steak).
- **Track:** A chronological list of all your recorded entries. You can sort by date and filter by category.
- **Export to CSV:** Export your tracked events and journal entries to a CSV file for your own analysis.
- **Journal:** A simple free-text journal for your thoughts, with entries listed newest-first.
- **Flags:** A view that analyzes your data to find simple, plain-text correlations (e.g., "Mood tends to be lower on days after less than 6 hours of sleep.").
- **Customization:** Add new top-level categories or new options to existing categories to tailor the tracker to your needs.
- **Offline First:** As a PWA with a service worker, the application works seamlessly without an internet connection.
- **Private:** All data is stored only on your device in the browser. Nothing is ever sent to a server.

## Tech Stack

- **React:** For building the user interface.
- **Vite:** As the build tool and development server.
- **CSS:** For clean, mobile-first styling. No CSS frameworks were used.
- **localStorage:** For all client-side data storage.

## Getting Started

Follow these instructions to get a local copy up and running.

### Prerequisites

You need to have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) (which comes with Node.js) installed on your machine.

### Installation

1. Clone the repository to your local machine.
2. Navigate into the project directory:
   ```sh
   cd /path/to/project
   ```
3. Install the required npm packages:
   ```sh
   npm install
   ```

### Running the Development Server

To run the app in development mode with hot-reloading, use the following command:

```sh
npm run dev
```

This will start the Vite development server, and you can view the application by navigating to `http://localhost:5173` (the port may vary; check the terminal output).

### Building for Production

To create a production-ready build of the application, run:

```sh
npm run build
```

This command will create a `dist` folder in the project root containing the optimized, static files for the application. You can serve this `dist` folder with any static file server to self-host the application.

To preview the production build locally, you can run:
```sh
npm run preview
```
