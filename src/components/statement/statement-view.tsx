import StatementTable from "./statement-table";
import { StatementApiResponse } from "@/types/statements";

type Props = {
  data: StatementApiResponse;
};

export default function StatementView({ data }: Props) {
  return <StatementTable data={data} />;
}
