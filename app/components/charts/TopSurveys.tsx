import { getBusinessId, getUser } from "@/app/utils/user/userData";
import { Spinner, Table } from "@radix-ui/themes";
import React from "react";
import { useFetchTopSurveys } from "../dashboard/_features/hook";

const TopSurveys = ({ module }: { module: string }) => {
  const user = getUser();
  let businessUserId = "";
  const role = user?.role ?? "";
  if (role === "business") {
    businessUserId = getBusinessId() ?? "";
  }
  if (role === "employee") {
    businessUserId = user?.businessUserId ?? "";
  }

  const { data, isLoading, error } = useFetchTopSurveys({
    businessUserId,
    role,
    startDate: "2025-01-01",
    endDate: "2025-12-01",
  });

  if (isLoading) return <Spinner />;

  if (error) return <p>Error fetching the survey summary</p>;

  return (
    <div className="bg-white p-4 border border-gray-100 rounded-md h-full">
      <p className="font-medium mb-4">Top surveys</p>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            {topSurveysColumns.map((column) => (
              <Table.ColumnHeaderCell key={column.label}>
                {column.label}
              </Table.ColumnHeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {/* {orders.map((order, index) => (
            <Table.Row key={order.id}>
              <Table.Cell>{index + 1}</Table.Cell>
              <Table.Cell>{order?.customer?.fullName}</Table.Cell>
              <Table.Cell>
                <Badge>
                  <Text
                    as="p"
                    size="2"
                    className="lowercase first-letter:uppercase"
                  >
                    {order.orderType?.name}
                  </Text>
                </Badge>
              </Table.Cell>
              <Table.Cell className="truncate max-w-[300px]">
                {order.status && <OrderStatusBadge status={order.status} />}
              </Table.Cell>
              <Table.Cell>
                <IconButton
                  variant="ghost"
                  ml="4"
                  onClick={() => router.push(`/market/orders/${order.id}`)}
                >
                  <GoEye size={18} color="black" />
                </IconButton>
              </Table.Cell>
            </Table.Row>
          ))} */}
        </Table.Body>
      </Table.Root>
    </div>
  );
};

export const topSurveysColumns: {
  label: string;
}[] = [{ label: "Date" }, { label: "Survey name" }];

export default TopSurveys;
