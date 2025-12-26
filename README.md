# Project Management Dashboard

This is a full-stack project management dashboard built with React (Vite) and Express. It uses Syncfusion React components for the Gantt chart, Kanban board, and Dashboard layout.

## Features

- **Dashboard**: Overview of project metrics and snippets of Gantt/Kanban views using `SplitterComponent`.
- **Gantt Chart**: Interactive Gantt chart for task scheduling using `GanttComponent`.
- **Kanban Board**: Kanban board for workflow management using `KanbanComponent`.
- **Mock Data**: The backend provides REST API endpoints serving mock data.

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Syncfusion EJ2 React Components.
- **Backend**: Express.js, TypeScript.
- **Database**: Mock in-memory storage (PostgreSQL is configured but used for connection boilerplate).

## Setup & Running

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Start the Application**:
    ```bash
    npm run dev
    ```
    This starts both the Express backend (port 5000) and the Vite frontend (port 5000 via proxy or separate dev server).

3.  **Access the App**:
    Open the Webview or navigate to the served URL.

## API Endpoints

- `GET /api/tasks`: Returns a list of tasks for Gantt and Kanban.
- `GET /api/metrics`: Returns dashboard metrics.

## Syncfusion Components

The following Syncfusion packages are used:
- `@syncfusion/ej2-react-gantt`
- `@syncfusion/ej2-react-kanban`
- `@syncfusion/ej2-react-layouts`

## License

This project uses Syncfusion components which may require a license for commercial use. Community license is sufficient for development.
