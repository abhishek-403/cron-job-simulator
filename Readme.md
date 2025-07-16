# Job Scheduler System

A comprehensive job scheduling system built with TypeScript, React, Express, and Tailwind CSS. This system allows you to schedule, manage, and monitor jobs across multiple worker machines with features like cron-like scheduling, job dependencies, retry policies, and real-time monitoring.

## Features

### Core Functionality
- **Cron-like Scheduling**: Support for like "every 5 minutes", "daily at 3 AM"
- **Job Dependencies**: Define jobs that must complete before others can run
- **Priority System**: High, Medium, Low priority job execution
- **Retry Policies**: Configurable retry attempts with exponential backoff
- **Worker Management**: Distribute jobs across multiple worker machines
- **Real-time Monitoring**: Live updates of job status and worker health

### User Interface
- **Job Management**: Create, edit, delete, and manually trigger jobs
- **Execution History**: View detailed execution logs with status, duration, and retry information
- **Worker Dashboard**: Monitor worker machine status and utilization
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS

## Architecture

```
┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
│                     │    │                     │    │                     │
│   React Frontend    │◄──►│   Express API       │◄──►│   Job Scheduler     │
│                     │    │                     │    │                     │
└─────────────────────┘    └─────────────────────┘    └─────────────────────┘
                                                       │
                                                       ▼
                                                ┌─────────────────────┐
                                                │                     │
                                                │   Worker Machines   │
                                                │                     │
                                                └─────────────────────┘
```


## API Endpoints

### Jobs
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get job by ID
- `POST /api/jobs` - Create new job
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job
- `POST /api/jobs/:id/execute` - Manually trigger job execution

### Executions
- `GET /api/executions` - Get all job executions
- `GET /api/executions?jobId=:id` - Get executions for specific job

### Workers
- `GET /api/workers` - Get all worker machines

## Installation and Setup

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```
2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The API server will run on `http://localhost:3001`

### Frontend Setup
1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`
