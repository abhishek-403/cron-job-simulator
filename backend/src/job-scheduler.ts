import cron from "node-cron";
import { v4 as uuidv4 } from "uuid";
import {
  JobDefinition,
  JobExecution,
  JobSchedulerState,
  JobStatus,
  WorkerMachine,
} from "./types";
export class JobScheduler {
  private state: JobSchedulerState;

  constructor() {
    this.state = {
      jobs: new Map(),
      executions: new Map(),
      workers: new Map(),
      scheduledJobs: new Map(),
    };

    this.initializeWorkers();
  }

  private initializeWorkers() {
    const workers: WorkerMachine[] = [
      {
        id: "worker-1",
        name: "Worker Node 1",
        isActive: true,
        lastHeartbeat: new Date(),
        currentJobs: [],
        maxConcurrentJobs: 3,
      },
      {
        id: "worker-2",
        name: "Worker Node 2",
        isActive: true,
        lastHeartbeat: new Date(),
        currentJobs: [],
        maxConcurrentJobs: 2,
      },
      {
        id: "worker-3",
        name: "Worker Node 3",
        isActive: true,
        lastHeartbeat: new Date(),
        currentJobs: [],
        maxConcurrentJobs: 4,
      },
    ];

    workers.forEach((worker) => {
      this.state.workers.set(worker.id, worker);
    });
  }

  // Convert user-friendly cron expressions to standard cron format
  private parseCronExpression({
    mode,
    value,
  }: {
    mode: string;
    value: string | number;
  }): string {
    if (mode === "minutes") {
      const minutes = Number(value);
      if (isNaN(minutes) || minutes < 1 || minutes > 59) {
        throw new Error("Invalid minutes value");
      }
      return `*/${minutes} * * * *`;
    }

    if (mode === "daily") {
      const [hourStr, minuteStr] = String(value).split(":");
      const hour = parseInt(hourStr, 10);
      const minute = parseInt(minuteStr, 10);

      if (
        isNaN(hour) ||
        hour < 0 ||
        hour > 23 ||
        isNaN(minute) ||
        minute < 0 ||
        minute > 59
      ) {
        throw new Error("Invalid daily time");
      }

      return `${minute} ${hour} * * *`;
    }

    // Default to every 5 minutes if can't parse
    return "*/5 * * * *";
  }

  // Check if all dependencies are satisfied
  private checkDependencies(jobId: string): boolean {
    const job = this.state.jobs.get(jobId);
    if (!job || !job.dependencies.length) return true;

    return job.dependencies.every((depId) => {
      const depExecutions = Array.from(this.state.executions.values())
        .filter((exec) => exec.jobId === depId)
        .sort(
          (a, b) =>
            (b.startTime?.getTime() || 0) - (a.startTime?.getTime() || 0)
        );

      return (
        depExecutions.length > 0 &&
        depExecutions[0].status === JobStatus.COMPLETED
      );
    });
  }

  // Find available worker for job execution
  private findAvailableWorker(): WorkerMachine | null {
    const availableWorkers = Array.from(this.state.workers.values())
      .filter(
        (worker) =>
          worker.isActive &&
          worker.currentJobs.length < worker.maxConcurrentJobs
      )
      .sort((a, b) => a.currentJobs.length - b.currentJobs.length);

    return availableWorkers[0] || null;
  }

  // Execute a job
  async executeJob(jobId: string): Promise<void> {
    const job = this.state.jobs.get(jobId);
    if (!job || !job.enabled) return;

    // Check dependencies
    if (!this.checkDependencies(jobId)) {
      console.log(`Job ${jobId} waiting for dependencies`);
      return;
    }

    // Find available worker
    const worker = this.findAvailableWorker();
    if (!worker) {
      console.log(`No available workers for job ${jobId}`);
      return;
    }

    // Create execution record
    const executionId = uuidv4();
    const execution: JobExecution = {
      id: executionId,
      jobId,
      status: JobStatus.RUNNING,
      startTime: new Date(),
      workerId: worker.id,
      retryCount: 0,
    };

    this.state.executions.set(executionId, execution);
    worker.currentJobs.push(executionId);

    console.log(`Starting job ${job.name} on worker ${worker.name}`);

    try {
      const res = await this.commandExecution(job.command);

      // Job completed successfully
      execution.status = JobStatus.COMPLETED;
      execution.endTime = new Date();
      execution.output = res;
      console.log(`Job ${job.name} completed successfully`);
    } catch (error) {
      console.error(`Job ${job.name} failed:`, error);
      await this.handleJobFailure(execution, error as Error);
    } finally {
      // Remove job from worker's current jobs
      worker.currentJobs = worker.currentJobs.filter(
        (id) => id !== executionId
      );
      worker.lastHeartbeat = new Date();
    }
  }

  // Simulate job execution (replace with actual command execution)
  private async commandExecution(command: string): Promise<any> {
    const res = await fetch(command, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(
        `Command "${command}" failed: ${res.status} ${errorText}`
      );
    }
    return res.text();
  }

  // Handle job failure and retry logic
  private async handleJobFailure(
    execution: JobExecution,
    error: Error
  ): Promise<void> {
    const job = this.state.jobs.get(execution.jobId);
    if (!job) return;

    execution.error = error.message;
    execution.retryCount++;

    if (execution.retryCount < job.retryPolicy.maxRetries) {
      console.log(
        `Retrying job ${job.name} (attempt ${execution.retryCount + 1}/${
          job.retryPolicy.maxRetries
        })`
      );

      // Schedule retry with backoff
      const delay =
        job.retryPolicy.retryDelay *
        Math.pow(job.retryPolicy.backoffMultiplier, execution.retryCount - 1);

      setTimeout(() => {
        this.executeJob(execution.jobId);
      }, delay);
    } else {
      execution.status = JobStatus.FAILED;
      execution.endTime = new Date();
      console.log(
        `Job ${job.name} failed after ${job.retryPolicy.maxRetries} attempts`
      );
    }
  }

  // Schedule a job
  public scheduleJob(jobDefinition: JobDefinition): void {
    // Remove existing schedule if any
    this.unscheduleJob(jobDefinition.id);

    // Store job definition
    this.state.jobs.set(jobDefinition.id, jobDefinition);

    // Schedule the job
    const cronExpression = this.parseCronExpression(jobDefinition.cronSchedule);
    if (cron.validate(cronExpression)) {
      const task = cron.schedule(
        cronExpression,
        () => {
          this.executeJob(jobDefinition.id);
        },
        {
          scheduled: jobDefinition.enabled,
        } as any
      );

      this.state.scheduledJobs.set(jobDefinition.id, task as any);
      console.log(
        `Scheduled job ${jobDefinition.name} with cron: ${cronExpression}`
      );
    } else {
      console.error(
        `Invalid cron expression for job ${jobDefinition.name}: ${cronExpression}`
      );
    }
  }

  // Unschedule a job
  public unscheduleJob(jobId: string): void {
    const scheduledJob = this.state.scheduledJobs.get(jobId);
    if (scheduledJob) {
      (scheduledJob as any).stop();
      this.state.scheduledJobs.delete(jobId);
    }
  }

  // Get all jobs
  public getJobs(): JobDefinition[] {
    return Array.from(this.state.jobs.values());
  }

  // Get job by ID
  public getJob(jobId: string): JobDefinition | undefined {
    return this.state.jobs.get(jobId);
  }

  // Get job executions
  public getJobExecutions(jobId?: string): JobExecution[] {
    const executions = Array.from(this.state.executions.values());
    return jobId
      ? executions.filter((exec) => exec.jobId === jobId)
      : executions;
  }

  // Get workers
  public getWorkers(): WorkerMachine[] {
    return Array.from(this.state.workers.values());
  }

  // Delete job
  public deleteJob(jobId: string): boolean {
    this.unscheduleJob(jobId);
    return this.state.jobs.delete(jobId);
  }

  // Update job
  public updateJob(jobId: string, updates: Partial<JobDefinition>): boolean {
    const job = this.state.jobs.get(jobId);
    if (!job) return false;

    const updatedJob = { ...job, ...updates, updatedAt: new Date() };
    this.scheduleJob(updatedJob);
    return true;
  }
}
