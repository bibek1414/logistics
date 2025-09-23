"use client";

import StatementView from "@/components/statement/statement-view";
import { useStatements } from "@/hooks/use-statements";
import { useParams } from "next/navigation";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";

export default function StatementPage() {
  const { id } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(30);

  const { data, isLoading, error } = useStatements(
    id as string,
    currentPage,
    pageSize
  );

  const totalCount = data?.count ?? 0;
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalCount / pageSize)),
    [totalCount, pageSize]
  );

  if (isLoading && !data) return <div>Loading statements...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;
  if (!data) return <div>No data</div>;

  return (
    <div className="space-y-4 mx-auto max-w-7xl">
      <StatementView data={data.results} />

      {totalPages > 1 && !isLoading && (
        <div className="flex items-center justify-between py-3 border-t">
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages} ({totalCount} total days)
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
