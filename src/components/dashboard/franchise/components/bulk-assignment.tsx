"use client";

import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { SearchableAgentSelect } from "./searchable-agent-select";

interface BulkAssignmentProps {
  selectedOrders: Set<string>;
  bulkAssignAgent: string;
  setBulkAssignAgent: (value: string) => void;
  isBulkAssigning: boolean;
  handleBulkAssignment: () => void;
  bulkAgentSearch: string;
  setBulkAgentSearch: (value: string) => void;
}

export function BulkAssignment({
  selectedOrders,
  bulkAssignAgent,
  setBulkAssignAgent,
  isBulkAssigning,
  handleBulkAssignment,
  bulkAgentSearch,
  setBulkAgentSearch,
}: BulkAssignmentProps) {
  if (selectedOrders.size === 0) return null;

  return (
    <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-lg border border-blue-200">
      <span className="text-sm font-medium text-blue-800">
        {selectedOrders.size} orders selected
      </span>
      <SearchableAgentSelect
        value={bulkAssignAgent}
        onValueChange={setBulkAssignAgent}
        placeholder="Select rider for bulk assignment"
        searchTerm={bulkAgentSearch}
        setSearchTerm={setBulkAgentSearch}
      />
      <Button
        onClick={handleBulkAssignment}
        disabled={!bulkAssignAgent || isBulkAssigning}
        size="sm"
        className="bg-primary hover:bg-primary/90"
      >
        {isBulkAssigning ? (
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 animate-spin" />
            <span>Assigning...</span>
          </div>
        ) : (
          `Assign ${selectedOrders.size} Orders`
        )}
      </Button>
    </div>
  );
}
