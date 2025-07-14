"use client";

import { CountryAndCity } from "@/app/lib/type";
import { IconButton, Table } from "@radix-ui/themes";
import { Trash } from "lucide-react";

type Props = {
  demographicData: CountryAndCity[];
  onDeleteClick: (val: CountryAndCity) => void;
};

const LocationAndDemographicTable = ({
  demographicData,
  onDeleteClick,
}: Props) => {
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
          <Table.Row key={data.country + index} align="center">
            <Table.Cell>{index + 1}</Table.Cell>
            <Table.Cell>{data.country}</Table.Cell>
            <Table.Cell>{data.state}</Table.Cell>
            <Table.Cell>{data.city}</Table.Cell>
            <Table.Cell>
              {
                <IconButton
                  type="button"
                  onClick={() => {
                    onDeleteClick(data);
                  }}
                >
                  <Trash size={16} />
                </IconButton>
              }
            </Table.Cell>
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
  { label: "State"},
  { label: "City" },
  { label: "Action" },
];

export default LocationAndDemographicTable;
