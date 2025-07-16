// Types
enum JobStatus {
  PENDING = "pending",
  RUNNING = "running",
  COMPLETED = "completed",
  FAILED = "failed",
  CANCELLED = "cancelled",
  WAITING_DEPENDENCIES = "waiting_dependencies",
}

enum JobPriority {
  HIGH = "high",
  MEDIUM = "medium",
  LOW = "low",
}

interface RetryPolicy {
  maxRetries: number;
  retryDelay: number;
  backoffMultiplier: number;
}

interface JobDefinition {
  id: string;
  name: string;
  cronSchedule: { mode: string; value: string | number };
  command: string;
  priority: JobPriority;
  dependencies: string[];
  retryPolicy: RetryPolicy;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface JobExecution {
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

interface WorkerMachine {
  id: string;
  name: string;
  isActive: boolean;
  lastHeartbeat: Date;
  currentJobs: string[];
  maxConcurrentJobs: number;
}

export {
  JobPriority,
  JobStatus,
  type JobDefinition,
  type JobExecution,
  type WorkerMachine,
};
