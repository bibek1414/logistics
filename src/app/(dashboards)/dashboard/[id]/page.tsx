import FranchiseView from "@/components/dashboard/franchise/franchise-view";

export default function FranchiseDashboard({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  return <FranchiseView id={id} />;
}
