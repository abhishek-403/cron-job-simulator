import cors from "cors";
import express from "express";
import { v4 as uuidv4 } from "uuid";
import { JobScheduler } from "./job-scheduler";
import { JobDefinition, JobPriority } from "./types";
// Initialize scheduler
const scheduler = new JobScheduler();

// Express app setup
const app = express();
app.use(cors());
app.use(express.json());

// API Routes

// Get all jobs
app.get("/api/jobs", (req, res) => {
  res.json(scheduler.getJobs());
});

// Get job by ID
app.get("/api/jobs/:id", (req, res) => {
  const job = scheduler.getJob(req.params.id);
  if (!job) {
    return res.status(404).json({ error: "Job not found" });
  }
  res.json(job);
});

// Create new job
app.post("/api/jobs", (req, res) => {
  const jobDefinition: JobDefinition = {
    id: uuidv4(),
    name: req.body.name,
    cronSchedule: req.body.cronSchedule,
    command: req.body.command,
    priority: req.body.priority || JobPriority.MEDIUM,
    dependencies: req.body.dependencies || [],
    retryPolicy: req.body.retryPolicy || {
      maxRetries: 3,
      retryDelay: 1000,
      backoffMultiplier: 2,
    },
    enabled: req.body.enabled !== false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  scheduler.scheduleJob(jobDefinition);
  res.status(201).json(jobDefinition);
});

// Update job
app.put("/api/jobs/:id", (req, res) => {
  const success = scheduler.updateJob(req.params.id, req.body);
  if (!success) {
    return res.status(404).json({ error: "Job not found" });
  }
  res.json({ message: "Job updated successfully" });
});

// Delete job
app.delete("/api/jobs/:id", (req, res) => {
  const success = scheduler.deleteJob(req.params.id);
  if (!success) {
    return res.status(404).json({ error: "Job not found" });
  }
  res.json({ message: "Job deleted successfully" });
});

// Get job executions
app.get("/api/executions", (req, res) => {
  const jobId = req.query.jobId as string;
  res.json(scheduler.getJobExecutions(jobId));
});

// Get workers
app.get("/api/workers", (req, res) => {
  res.json(scheduler.getWorkers());
});

// Manually trigger job execution
app.post("/api/jobs/:id/execute", (req, res) => {
  const job = scheduler.getJob(req.params.id);
  if (!job) {
    return res.status(404).json({ error: "Job not found" });
  }

  // Execute job manually (bypassing schedule)
  scheduler.executeJob(req.params.id);
  res.json({ message: "Job execution triggered" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Job Scheduler API running on port ${PORT}`);

  // Add some sample jobs for demonstration
  const sampleJobs: JobDefinition[] = [
    {
      id: uuidv4(),
      name: "Log todos",
      cronSchedule: { mode: "minutes", value: 20 },
      command: "https://jsonplaceholder.typicode.com/todos/1",
      priority: JobPriority.HIGH,
      dependencies: [],
      retryPolicy: {
        maxRetries: 3,
        retryDelay: 5000,
        backoffMultiplier: 2,
      },
      enabled: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: uuidv4(),
      name: "Get Posts",
      cronSchedule: { mode: "daily", value: "12:02" },
      command: "https://jsonplaceholder.typicode.com/posts/1",
      priority: JobPriority.LOW,
      dependencies: [],
      retryPolicy: {
        maxRetries: 2,
        retryDelay: 1000,
        backoffMultiplier: 1.5,
      },
      enabled: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  sampleJobs.forEach((job) => scheduler.scheduleJob(job));
});
