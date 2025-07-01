"use client";

import { Table } from "@radix-ui/themes";
import { Delete } from "lucide-react";

const LocationAndDemographicTable = ({
  demographicData,
}: {
  demographicData: { country: string; city: string }[];
}) => {
  return (
    <Table.Root>
      <Table.Header>
        <Table.Row>
          {demographicColumns.map((column) => (
            <Table.ColumnHeaderCell key={column.label}>
              {column.label}
            </Table.ColumnHeaderCell>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {demographicData?.map((data, index) => (
          <Table.Row key={data.country + index}>
            <Table.Cell>{index + 1}</Table.Cell>
            <Table.Cell>{data.country}</Table.Cell>
            <Table.Cell>{data.city}</Table.Cell>
            <Table.Cell>{<Delete />}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};

const demographicColumns: {
  label: string;
}[] = [
  { label: "N" },
  { label: "Country" },
  { label: "City" },
  { label: "Action" },
];

export default LocationAndDemographicTable;
