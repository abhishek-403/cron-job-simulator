import { useEffect, useState } from "react";
import { JobPriority, type JobDefinition } from "../types";
import SchedulePicker from "./schedule-picker";

export default function JobForm({
  job,
  jobs,
  onSubmit,
  onCancel,
}: {
  job?: JobDefinition;
  jobs: JobDefinition[];
  onSubmit: (job: Partial<JobDefinition>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: job?.name || "",
    cronSchedule: job?.cronSchedule,
    command: job?.command || "",
    priority: job?.priority || JobPriority.MEDIUM,
    dependencies: job?.dependencies || [],
    retryPolicy: job?.retryPolicy || {
      maxRetries: 3,
      retryDelay: 1000,
      backoffMultiplier: 2,
    },
    enabled: job?.enabled !== false,
  });

  const [mode, setMode] = useState("minutes");
  const [everyMinutes, setEveryMinutes] = useState(5);
  const [dailyTime, setDailyTime] = useState("09:00");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let data = formData;
    if (mode == "minutes") {
      data = { ...formData, cronSchedule: { mode, value: everyMinutes } };
    } else if (mode == "daily") {
      data = { ...formData, cronSchedule: { mode, value: dailyTime } };
    }
    onSubmit(data);
  };
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleDependencyChange = (jobId: string, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        dependencies: [...prev.dependencies, jobId],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        dependencies: prev.dependencies.filter((id) => id !== jobId),
      }));
    }
  };

  const availableDependencies = jobs.filter((j) => j.id !== job?.id);

  return (
    <div className="   fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">
            {job ? "Edit Job" : "Create New Job"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Job Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full border rounded-md px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Schedule</label>
              <SchedulePicker
                mode={mode}
                setMode={setMode}
                everyMinutes={everyMinutes}
                setEveryMinutes={setEveryMinutes}
                dailyTime={dailyTime}
                setDailyTime={setDailyTime}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">URL</label>
              <input
                type="text"
                value={formData.command}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, command: e.target.value }))
                }
                className="w-full border rounded-md px-3 py-2"
                placeholder="e.g., 'backup-database.sh'"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    priority: e.target.value as JobPriority,
                  }))
                }
                className="w-full border rounded-md px-3 py-2"
              >
                <option value={JobPriority.HIGH}>High</option>
                <option value={JobPriority.MEDIUM}>Medium</option>
                <option value={JobPriority.LOW}>Low</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Dependencies
              </label>
              <div className="max-h-32 overflow-y-auto border rounded-md p-2">
                {availableDependencies.length > 0 ? (
                  availableDependencies.map((depJob) => (
                    <label key={depJob.id} className="flex items-center py-1">
                      <input
                        type="checkbox"
                        checked={formData.dependencies.includes(depJob.id)}
                        onChange={(e) =>
                          handleDependencyChange(depJob.id, e.target.checked)
                        }
                        className="mr-2"
                      />
                      {depJob.name}
                    </label>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">
                    No other jobs available
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Retry Policy
              </label>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Max Retries
                  </label>
                  <input
                    type="number"
                    value={formData.retryPolicy.maxRetries}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        retryPolicy: {
                          ...prev.retryPolicy,
                          maxRetries: parseInt(e.target.value),
                        },
                      }))
                    }
                    className="w-full border rounded-md px-2 py-1 text-sm"
                    min="0"
                    max="10"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Retry Delay (ms)
                  </label>
                  <input
                    type="number"
                    value={formData.retryPolicy.retryDelay}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        retryPolicy: {
                          ...prev.retryPolicy,
                          retryDelay: parseInt(e.target.value),
                        },
                      }))
                    }
                    className="w-full border rounded-md px-2 py-1 text-sm"
                    min="100"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Backoff Multiplier
                  </label>
                  <input
                    type="number"
                    value={formData.retryPolicy.backoffMultiplier}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        retryPolicy: {
                          ...prev.retryPolicy,
                          backoffMultiplier: parseFloat(e.target.value),
                        },
                      }))
                    }
                    className="w-full border rounded-md px-2 py-1 text-sm"
                    min="1"
                    max="5"
                    step="0.1"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.enabled}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      enabled: e.target.checked,
                    }))
                  }
                  className="mr-2"
                />
                Enabled
              </label>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {job ? "Update" : "Create"} Job
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
