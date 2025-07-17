"use client";

import { CountryAndCity } from "@/app/lib/type";
import { IconButton, Table } from "@radix-ui/themes";
import { Trash } from "lucide-react";

type DemographicSelection = {
  age: string[];
  gender: string[];
  country: string;
  state: string;
  city: string;
};

type Props = {
  locationData: CountryAndCity[];
  demographicData: DemographicSelection[];
  onDeleteLocation: (val: CountryAndCity) => void;
  onDeleteDemographic: (index: number) => void;
};

const LocationAndDemographicTable = ({
  // locationData,
  demographicData,
  // onDeleteLocation,
  onDeleteDemographic,
}: Props) => {
  return (
    <>
      {/* Locations Table */}
      {/* <Table.Root className="mb-8">
        <Table.Header>
          <Table.Row>
            {locationColumns.map((column) => (
              <Table.ColumnHeaderCell key={column.label}>
                {column.label}
              </Table.ColumnHeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {locationData?.map((data, index) => (
            <Table.Row key={`loc-${data.country}-${index}`} align="center">
              <Table.Cell>{index + 1}</Table.Cell>
              <Table.Cell>{data.country}</Table.Cell>
              <Table.Cell>{data.state}</Table.Cell>
              <Table.Cell>{data.city}</Table.Cell>
              <Table.Cell>
                <IconButton
                  type="button"
                  onClick={() => onDeleteLocation(data)}
                >
                  <Trash size={16} />
                </IconButton>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root> */}

      {/* Demographics Table */}
      {demographicData.length > 0 && (
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
            {demographicData.map((data, index) => (
              <Table.Row key={`demo-${index}`} align="center">
                <Table.Cell>{index + 1}</Table.Cell>
                <Table.Cell>{data.country}</Table.Cell>
                <Table.Cell>{data.state}</Table.Cell>
                <Table.Cell>{data.city}</Table.Cell>
                <Table.Cell>{data.age}</Table.Cell>
                <Table.Cell>{data.gender}</Table.Cell>
                <Table.Cell>
                  <IconButton
                    type="button"
                    onClick={() => onDeleteDemographic(index)}
                  >
                    <Trash size={16} />
                  </IconButton>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      )}
    </>
  );
};

// const locationColumns = [
//   { label: "N" },
//   { label: "Country" },
//   { label: "State" },
//   { label: "City" },
//   { label: "Action" },
// ];

const demographicColumns = [
  { label: "N" },
  { label: "Country" },
  { label: "State" },
  { label: "City" },
  { label: "Age Group" },
  { label: "Gender" },
  { label: "Action" },
];

export default LocationAndDemographicTable;