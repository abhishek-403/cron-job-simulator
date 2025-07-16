export enum JobStatus {
  PENDING = "pending",
  RUNNING = "running",
  COMPLETED = "completed",
  FAILED = "failed",
  CANCELLED = "cancelled",
  WAITING_DEPENDENCIES = "waiting_dependencies",
}

export enum JobPriority {
  HIGH = "high",
  MEDIUM = "medium",
  LOW = "low",
}

export interface RetryPolicy {
  maxRetries: number;
  retryDelay: number; // in milliseconds
  backoffMultiplier: number;
}

export interface JobDefinition {
  id: string;
  name: string;
  cronSchedule: { mode: string; value: string | number };
  command: string;
  priority: JobPriority;
  dependencies: string[]; // Job IDs that must complete before this job
  retryPolicy: RetryPolicy;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface JobExecution {
  id: string;
  jobId: string;
  status: JobStatus;
  startTime?: Date;
  endTime?: Date;
  workerId?: string;
  retryCount: number;
  error?: string;
  output?: string;
}

export interface WorkerMachine {
  id: string;
  name: string;
  isActive: boolean;
  lastHeartbeat: Date;
  currentJobs: string[];
  maxConcurrentJobs: number;
}

export interface JobSchedulerState {
  jobs: Map<string, JobDefinition>;
  executions: Map<string, JobExecution>;
  workers: Map<string, WorkerMachine>;
  scheduledJobs: Map<string, NodeJS.Timeout>;
}
