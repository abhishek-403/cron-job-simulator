import { useEffect, useState } from "react";
import type { JobDefinition, JobExecution, WorkerMachine } from "./types";

import { Clock, Edit, Play, Plus, Server, Trash2 } from "lucide-react";
import { PriorityBadge, StatusBadge } from "./components/badges";
import JobForm from "./components/job-form";
import {
  addToLocalStore,
  fetchFromLocalStore,
} from "./components/local-store-manager";

class ApiClient {
  private baseUrl = "http://localhost:3001/api";

  async get(endpoint: string) {
    const response = await fetch(`${this.baseUrl}${endpoint}`);
    return response.json();
  }

  async post(endpoint: string, data: any) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async put(endpoint: string, data: any) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async delete(endpoint: string) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "DELETE",
    });
    return response.json();
  }
}

const api = new ApiClient();
export const NAVIGATION_TAB = "nav-tab";
export default function App() {
  const [jobs, setJobs] = useState<JobDefinition[]>([]);
  const [executions, setExecutions] = useState<JobExecution[]>([]);
  const [workers, setWorkers] = useState<WorkerMachine[]>([]);
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState<JobDefinition | undefined>(
    undefined
  );
  const [activeTab, setActiveTab] = useState<"jobs" | "executions" | "workers">(
    "jobs"
  );
  useEffect(() => {
    setActiveTab(fetchFromLocalStore(NAVIGATION_TAB) ?? ("jobs" as any));
  }, []);
  // Fetch data from API
  const fetchJobs = async () => {
    try {
      const data = await api.get("/jobs");
      setJobs(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const fetchExecutions = async () => {
    try {
      const data = await api.get("/executions");
      setExecutions(data);
    } catch (error) {
      console.error("Error fetching executions:", error);
    }
  };

  const fetchWorkers = async () => {
    try {
      const data = await api.get("/workers");
      setWorkers(data);
    } catch (error) {
      console.error("Error fetching workers:", error);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchExecutions();
    fetchWorkers();

    // Refresh data every 5 seconds
    const interval = setInterval(() => {
      fetchJobs();
      fetchExecutions();
      fetchWorkers();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleCreateJob = async (jobData: Partial<JobDefinition>) => {
    try {
      await api.post("/jobs", jobData);
      setShowJobForm(false);
      fetchJobs();
    } catch (error) {
      console.error("Error creating job:", error);
    }
  };

  const handleUpdateJob = async (jobData: Partial<JobDefinition>) => {
    if (!editingJob) return;
    try {
      await api.put(`/jobs/${editingJob.id}`, jobData);
      setEditingJob(undefined);
      setShowJobForm(false);
      fetchJobs();
    } catch (error) {
      console.error("Error updating job:", error);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await api.delete(`/jobs/${jobId}`);
        fetchJobs();
      } catch (error) {
        console.error("Error deleting job:", error);
      }
    }
  };

  const handleExecuteJob = async (jobId: string) => {
    try {
      setActiveTab("executions");
      await api.post(`/jobs/${jobId}/execute`, {});
      fetchExecutions();
    } catch (error) {
      console.error("Error executing job:", error);
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleString();
  };

  const formatDuration = (start: Date | string, end: Date | string) => {
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    const duration = endTime - startTime;
    return `${Math.round(duration / 1000)}s`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Job Scheduler</h1>
          <p className="text-gray-600 mt-2">
            Manage and monitor your scheduled jobs
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: "jobs", label: "Jobs", icon: Clock },
              { id: "executions", label: "Executions", icon: Play },
              { id: "workers", label: "Workers", icon: Server },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => {
                  addToLocalStore(NAVIGATION_TAB, id);
                  setActiveTab(id as any);
                }}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm cursor-pointer ${
                  activeTab === id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Jobs Tab */}
        {activeTab === "jobs" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Jobs</h2>
              <button
                onClick={() => setShowJobForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Job
              </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Schedule
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {jobs.map((job) => (
                    <tr key={job.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {job.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {job.command}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {job.cronSchedule.value} {job.cronSchedule.mode}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <PriorityBadge priority={job.priority} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            job.enabled
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {job.enabled ? "Enabled" : "Disabled"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleExecuteJob(job.id)}
                            className="cursor-pointer text-blue-600 hover:text-blue-900"
                            title="Execute now"
                          >
                            <Play className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingJob(job);
                              setShowJobForm(true);
                            }}
                            className="cursor-pointer text-gray-600 hover:text-gray-900"
                            title="Edit"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteJob(job.id)}
                            className="text-red-600 cursor-pointer hover:text-red-900"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Executions Tab */}
        {activeTab === "executions" && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Job Executions</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Job
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Response
                    </th>
                    {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Worker
                    </th> */}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Start Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Retries
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[...executions].reverse().map((execution) => {
                    const job = jobs.find((j) => j.id === execution.jobId);

                    return (
                      <tr key={execution.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {job?.name || "Unknown Job"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={execution.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {execution?.output && execution.output.length > 90
                              ? execution?.output!.slice(0,90)+"..."
                              : execution.output}
                          </div>
                        </td>
                        {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {execution.workerId || "-"}
                        </td> */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {execution.startTime
                            ? formatDate(execution.startTime)
                            : "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {execution.startTime && execution.endTime
                            ? formatDuration(
                                execution.startTime,
                                execution.endTime
                              )
                            : "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {execution.retryCount}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Workers Tab */}
        {activeTab === "workers" && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Worker Machines</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workers.map((worker) => (
                <div key={worker.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {worker.name}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        worker.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {worker.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Current Jobs:</span>
                      <span>{worker.currentJobs.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Max Concurrent:</span>
                      <span>{worker.maxConcurrentJobs}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Heartbeat:</span>
                      <span>{formatDate(worker.lastHeartbeat)}</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${
                            (worker.currentJobs.length /
                              worker.maxConcurrentJobs) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {Math.round(
                        (worker.currentJobs.length / worker.maxConcurrentJobs) *
                          100
                      )}
                      % utilized
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Job Form Modal */}
        {showJobForm && (
          <JobForm
            job={editingJob}
            jobs={jobs}
            onSubmit={editingJob ? handleUpdateJob : handleCreateJob}
            onCancel={() => {
              setShowJobForm(false);
              setEditingJob(undefined);
            }}
          />
        )}
      </div>
    </div>
  );
}
