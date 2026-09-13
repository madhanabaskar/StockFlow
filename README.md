# StockFlow — Inventory Management Dashboard

A modern frontend inventory management application for tracking products, stock levels, suppliers, categories and inventory activity.

**Important Note: StockFlow is a self-initiated portfolio concept project. It currently uses `localStorage` for data persistence and does not have a production backend or authentication system.**

## Features

* **Dashboard Analytics:** High-level key performance indicators and a real-time activity feed.
* **Product CRUD:** Complete interface for creating, reading, updating, and deleting product records.
* **Search & Filters:** Real-time client-side sorting, filtering, and searching capabilities.
* **Stock Management:** Seamlessly process "Stock In", "Stock Out", and manual adjustments.
* **Inventory History:** A comprehensive ledger tracking all stock movements securely.
* **Reports & Analytics:** Dynamic Recharts visualizations based on current and historical data.
* **CSV Exports:** Client-side generation of spreadsheet reports.
* **Theming:** A meticulous Light, Dark, and System theme engine built on semantic CSS variables.
* **Responsive Design:** A fully fluid layout that adapts cleanly to mobile, tablet, and desktop viewports.
* **LocalStorage Persistence:** State hydration and safe parsing so your demo data survives browser reloads.
* **Error Handling:** Global Error Boundaries and 404 routing to ensure the application never crashes to a blank screen.

## Tech Stack

* **React.js** 
* **Vite** 
* **JavaScript** 
* **Tailwind CSS** (v4)
* **React Router** 
* **Recharts** 
* **Lucide React** 

## Architecture Overview

StockFlow uses a clean, context-driven component architecture.
`Pages -> Context -> Utilities -> LocalStorage`

1. **Contexts (`ProductContext`, `InventoryContext`)** act as the single source of truth and automatically sync to `localStorage`.
2. **Utilities (`reportUtils.js`)** handle complex aggregation to keep components clean.
3. **Components** consume the Contexts natively, ensuring any stock adjustment instantly triggers a re-render across the entire dashboard.

## Running Locally

1. Clone the repository
2. Run `npm install`
3. Run `npm run dev`
4. Open `http://localhost:5173`
