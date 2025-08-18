import { Spinner, Table } from "@radix-ui/themes";
import { useFetchTopBusinesses } from "../dashboard/_features/hook";

const TopBusinesses = () => {

  const {
    data: businessData,
    isLoading,
    error,
  } = useFetchTopBusinesses();

  if (isLoading) return <Spinner />;

  if (error) return <p>Error fetching data</p>;
  if ((businessData ?? []).length < 1) {
    return (
      ''
    )
  }
  return (
    <div className="bg-white p-4 border border-gray-100 rounded-md h-full">
      <>
        {(businessData ?? []).length < 1 ? (
          ''
        ) : (
          <div className="">
            <p className="font-bold mb-4">Top  organizations</p>
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
                {businessData?.map((business, index) => (
                  <Table.Row key={index}>
                    <Table.Cell>{business?.businessFirstName}</Table.Cell>
                    <Table.Cell>{business?.businessLastName}</Table.Cell>
                    <Table.Cell>{business?.entryCount}</Table.Cell>
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

export default TopBusinesses;
