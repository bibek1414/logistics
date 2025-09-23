import { getStatements } from "@/services/statements";
import { PaginatedStatementResponse } from "@/types/statements";
import { useQuery } from "@tanstack/react-query";

export const useStatements = (id: string, page: number, pageSize: number) => {
  return useQuery<PaginatedStatementResponse, Error>({
    queryKey: ["statements", id, page, pageSize],
    queryFn: () => getStatements(id, page, pageSize),
    placeholderData: (prev) => prev,
  });
};
