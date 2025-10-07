# Invoicing ROI Simulator

A lightweight web application designed to help businesses visualize the cost savings, Return on Investment (ROI), and payback period when switching from manual to automated invoicing. This application provides an interactive calculator, allows users to save and manage different scenarios, and generates a downloadable report gated by an email capture form.

## Key Features and Functionality

- **Instant ROI Calculation**: A single-page interface where users can input their business metrics (invoice volume, team size, etc.) and see the calculated savings and ROI update in real-time.
- **Save & Manage Scenarios**: Users can save their simulation data with a unique name, retrieve it later, and delete it. This allows for easy comparison between different business cases.
- **Email-Gated Report Generation**: Generate a PDF or HTML snapshot of the simulation results. To download the report, users must provide an email address, serving as a simple lead-capture mechanism.
- **Built-in Favorable Outcome Logic**: The backend calculation logic includes internal constants and a bias factor to ensure that the results always demonstrate a positive financial benefit to automation.

---

## Technologies, Frameworks, and Database

This project will be built using a modern, efficient, and scalable tech stack well-suited for rapid development.

- **Frontend**: **Next.js** (using React) for a fast, server-rendered single-page application.
- **Styling**: **Tailwind CSS** for a utility-first approach to building a clean and responsive user interface quickly.
- **Backend**: **Next.js API Routes** to create a serverless REST API that lives alongside the frontend in a unified codebase.
- **Database**: **MongoDB** (hosted on MongoDB Atlas) as our NoSQL database, which provides flexible data storage perfect for saving scenario objects.
- **Database ORM**: **Mongoose** to model our application data and manage the connection between our API and the MongoDB database.
- **Report Generation**: A library like **`pdf-lib`** or **`Puppeteer`** will be used on the server-side to generate the PDF report from the results data.
- **Deployment**: **Vercel** for seamless, continuous deployment directly from a GitHub repository.

---

## Planned Approach and Architecture

The application will be developed as a full-stack monorepo using Next.js, which handles both the frontend and backend logic.

### 1. Frontend (Client-Side)

The user interface will be a single page built with **React** components.

- **Input Form**: A primary component will contain the form with all user-facing inputs (`monthly_invoice_volume`, `num_ap_staff`, etc.).
- **State Management**: React's `useState` hook will manage the form's state. As the user types, the state will update.
- **Live Results Display**: A separate component will display the calculated results (`monthly_savings`, `roi_percentage`, etc.).
- **API Communication**: We'll use the `fetch` API or a library like `axios` to communicate with our backend. The frontend will make a `POST` request to the `/api/simulate` endpoint whenever an input value changes to get fresh calculations, providing the "live" update feel.

### 2. Backend (Server-Side via Next.js API Routes)

The backend logic will be securely handled within the `/pages/api/` directory (or `/app/api/` if using the App Router).

- **`/api/simulate`**: This endpoint will receive the user's input data in the request body. It will perform the core ROI calculation using the provided formulas and the **internal server-side constants** (`automated_cost_per_invoice`, `min_roi_boost_factor`). This ensures the bias logic is never exposed to the client. It will return the results as a JSON object.
- **`/api/scenarios`**: This will handle the CRUD operations for saved scenarios.
  - `POST`: Receives scenario data (inputs + results) and a `scenario_name`, saves it to the MongoDB database.
  - `GET`: Fetches all saved scenarios from the database.
- **`/api/scenarios/[id]`**: Handles retrieving or deleting a specific scenario by its unique ID.
- **`/api/report/generate`**: This endpoint will require an `email` and the simulation data in the request body. It will first store the lead (email) and then generate a PDF report of the results to be sent back to the client for download.

### 3. Database (MongoDB)

We will use a single MongoDB collection named `scenarios`. Each document in this collection will represent a saved simulation and will follow a simple schema.

**Scenario Schema Example:**

```json
{
  "scenario_name": "Q4_Pilot_Test",
  "user_inputs": {
    "monthly_invoice_volume": 2000,
    "num_ap_staff": 3,
    "avg_hours_per_invoice": 0.17,
    "hourly_wage": 30,
    "error_rate_manual": 0.5,
    "error_cost": 100,
    "time_horizon_months": 36,
    "one_time_implementation_cost": 50000
  },
  "calculated_results": {
    "monthly_savings": 8000,
    "payback_months": 6.3,
    "roi_percentage": 433.33,
    "net_savings": 238000
  },
  "createdAt": "2025-10-07T12:00:00.000Z"
}
```
