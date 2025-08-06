import { Spinner, Table } from "@radix-ui/themes";
import { useFetchTopResearchers } from "../dashboard/_features/hook";

const TopResearchers = () => {

  const {
    data: researchersData,
    isLoading,
    error,
  } = useFetchTopResearchers();

  console.log(researchersData);
  if (isLoading) return <Spinner />;

  if (error) return <p>Error fetching data</p>;
  if ((researchersData ?? []).length < 1) {
    return (
      ''
    )
  }
  return (
    <div className="bg-white p-4 border border-gray-100 rounded-md h-full">
      <>
        {(researchersData ?? []).length < 1 ? (
          ''
        ) : (
          <div className="">
            <p className="font-medium mb-4">Top researchers</p>
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  {topReasearchersColumns.map((column) => (
                    <Table.ColumnHeaderCell key={column.label}>
                      {column.label}
                    </Table.ColumnHeaderCell>
                  ))}
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {researchersData?.map((researcher, index) => (
                  <Table.Row key={index}>
                    <Table.Cell>{researcher?.researcherFirstName}</Table.Cell>
                    <Table.Cell>{researcher?.researcherLastName}</Table.Cell>
                    <Table.Cell>{researcher?.entryCount}</Table.Cell>
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

export const topReasearchersColumns: {
  label: string;
}[] = [{ label: "First name" }, { label: "Last name" }, { label: "Entries" }];

export default TopResearchers;
