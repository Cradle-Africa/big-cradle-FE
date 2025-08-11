import { Spinner, Table } from "@radix-ui/themes";
import { useFetchTopLocations } from "../dashboard/_features/hook";

const TopLocations = () => {

  const {
    data: locationsData,
    isLoading,
    error,
  } = useFetchTopLocations();

  console.log(locationsData);
  if (isLoading) return <Spinner />;

  if (error) return <p>Error fetching data</p>;
  if ((locationsData ?? []).length < 1) {
    return (
      ''
    )
  }
  return (
    <div className="bg-white p-4 border border-gray-100 rounded-md h-full">
      <>
        {(locationsData ?? []).length < 1 ? (
          ''
        ) : (
          <div className="">
            <p className="font-bold mb-4">Top Locations</p>
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  {topLocationsColumns.map((column) => (
                    <Table.ColumnHeaderCell key={column.label}>
                      {column.label}
                    </Table.ColumnHeaderCell>
                  ))}
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {locationsData?.map((location, index) => (
                  <Table.Row key={index}>
                    <Table.Cell>{location?.city}</Table.Cell>
                    <Table.Cell>{location?.state}</Table.Cell>
                    <Table.Cell>{location?.country}</Table.Cell>
                    <Table.Cell>{location?.entryCount}</Table.Cell>
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

export const topLocationsColumns: {
  label: string;
}[] = [{ label: "Country" }, { label: "State" }, { label: "City" }, { label: "Entries" }];

export default TopLocations;
