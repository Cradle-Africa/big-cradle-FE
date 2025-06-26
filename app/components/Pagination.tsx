"use client";

import { Flex, IconButton, Text } from "@radix-ui/themes";
import { useRouter, useSearchParams } from "next/navigation";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { RxDoubleArrowLeft, RxDoubleArrowRight } from "react-icons/rx";

type Props = {
  itemCount: number;
  pageSize: number;
  currentPage: number;
  className?: string;
};

const Pagination = ({ itemCount, pageSize, currentPage, className }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pageCount = Math.ceil(itemCount / pageSize);
  console.log("itemCount==> " + itemCount);
  console.log("pageCount==> " + pageCount);
  if (pageCount <= 1) return;

  const changePage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push("?" + params.toString());
  };

  return (
    <Flex className={className} align="center" gap="2">
      <Text>
        Page {currentPage} sur {pageCount}
      </Text>
      <IconButton
        color="gray"
        variant="soft"
        disabled={currentPage === 1}
        onClick={() => changePage(1)}
      >
        <RxDoubleArrowLeft />
      </IconButton>
      <IconButton
        color="gray"
        variant="soft"
        disabled={currentPage === 1}
        onClick={() => changePage(currentPage - 1)}
      >
        <GoChevronLeft />
      </IconButton>
      <IconButton
        color="gray"
        variant="soft"
        disabled={currentPage === pageCount}
        onClick={() => changePage(currentPage + 1)}
      >
        <GoChevronRight />
      </IconButton>
      <IconButton
        color="gray"
        variant="soft"
        disabled={currentPage === pageCount}
        onClick={() => changePage(pageCount)}
      >
        <RxDoubleArrowRight />
      </IconButton>
    </Flex>
  );
};

export default Pagination;
