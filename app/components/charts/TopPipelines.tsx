import { getBusinessId, getUser } from "@/app/utils/user/userData";
import { Spinner, Table, Text } from "@radix-ui/themes";
import {
  useFetchTopPipelines
} from "../dashboard/_features/hook";

const TopPipelines = () => {
  const user = getUser();
  let businessUserId = "";
  const role = user?.role ?? "";
  if (role === "business") {
    businessUserId = getBusinessId() ?? "";
  }
  if (role === "employee") {
    businessUserId = user?.businessUserId ?? "";
  }

  const {
    data: pipelines,
    isLoading,
    error,
  } = useFetchTopPipelines({
    businessUserId,
    role,
  });

  if (isLoading) return <Spinner />;

  if (error) return <p>Error fetching the survey summary</p>;

  return (
    <div className="bg-white p-4 border border-gray-100 rounded-md h-full">
      <>
        {(pipelines?.data ?? []).length < 1 ? (
          <Text>No data</Text>
        ) : (
          <div>
            <p className="font-medium mb-4">Top pipelines</p>
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  {topPipelinesColumns.map((column) => (
                    <Table.ColumnHeaderCell key={column.label}>
                      {column.label}
                    </Table.ColumnHeaderCell>
                  ))}
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {pipelines?.data?.map((pipeline) => (
                  <Table.Row key={pipeline.dataPointId}>
                    <Table.Cell>{pipeline?.dataPointName}</Table.Cell>
                    <Table.Cell>{pipeline?.count}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </div>
        )}
      </>
    </div>
  );
};

export const topPipelinesColumns: {
  label: string;
}[] = [{ label: "Survey name" }, { label: "Responses" }];

export default TopPipelines;
