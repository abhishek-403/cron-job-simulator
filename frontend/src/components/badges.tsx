import { AlertCircle, CheckCircle, Clock, Pause, Play } from "lucide-react";
import React from "react";
import { JobPriority, JobStatus } from "../types";

export const PriorityBadge: React.FC<{ priority: JobPriority }> = ({
  priority,
}) => {
  const colors = {
    [JobPriority.HIGH]: "bg-red-100 text-red-800",
    [JobPriority.MEDIUM]: "bg-yellow-100 text-yellow-800",
    [JobPriority.LOW]: "bg-green-100 text-green-800",
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${colors[priority]}`}
    >
      {priority.toUpperCase()}
    </span>
  );
};

// Status Badge Component
export const StatusBadge: React.FC<{ status: JobStatus }> = ({ status }) => {
  const colors = {
    [JobStatus.PENDING]: "bg-gray-100 text-gray-800",
    [JobStatus.RUNNING]: "bg-blue-100 text-blue-800",
    [JobStatus.COMPLETED]: "bg-green-100 text-green-800",
    [JobStatus.FAILED]: "bg-red-100 text-red-800",
    [JobStatus.CANCELLED]: "bg-gray-100 text-gray-800",
    [JobStatus.WAITING_DEPENDENCIES]: "bg-yellow-100 text-yellow-800",
  };

  const icons = {
    [JobStatus.PENDING]: Clock,
    [JobStatus.RUNNING]: Play,
    [JobStatus.COMPLETED]: CheckCircle,
    [JobStatus.FAILED]: AlertCircle,
    [JobStatus.CANCELLED]: Pause,
    [JobStatus.WAITING_DEPENDENCIES]: Clock,
  };

  const Icon = icons[status];

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}
    >
      <Icon className="w-3 h-3 mr-1" />
      {status.replace("_", " ").toUpperCase()}
    </span>
  );
};
