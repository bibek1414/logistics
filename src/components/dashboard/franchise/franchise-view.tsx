"use client";

import { useFranchise } from "@/hooks/use-franchises";
import { useMemo, useRef, useState, useCallback, useEffect } from "react";
import { useTableColumns } from "@/components/dashboard/franchise/hooks/use-table-columns";
import { useTableData } from "@/components/dashboard/franchise/hooks/use-table-data";
import { useTableFilters } from "@/components/dashboard/franchise/hooks/use-table-filters";
import { TableHeader } from "@/components/dashboard/franchise/components/table-header";
import { TableBody } from "@/components/dashboard/franchise/components/table-body";
import { TablePagination } from "@/components/dashboard/franchise/components/table-pagination";
import type { SaleItem } from "@/types/sales";
import type { FranchiseFilters } from "@/services/franchise";

export default function FranchiseView({ id }: { id: number }) {
  const tableRef = useRef<HTMLTableElement>(null);
  const searchTimeout = useRef<NodeJS.Timeout | undefined>(undefined);

  // Local UI states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [filterTerm, setFilterTerm] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("all");
  const [orderStatus, setOrderStatus] = useState("all");
  const [deliveryType, setDeliveryType] = useState("all");
  const [logistic, setLogistic] = useState("all");
  const [salesperson, setSalesperson] = useState("all");
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedPaymentImage, setSelectedPaymentImage] = useState("");
  const [showPaymentImageModal, setShowPaymentImageModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const { columns, toggleColumnVisibility, showAllColumns, hideAllColumns } =
    useTableColumns();
  const { sortField, sortDirection, handleSort, sortData, getValueByColumnId } =
    useTableData();
  const { applyFilters, dateRange, setDateRange } = useTableFilters();

  // Build filters object for API call
  const filters: FranchiseFilters = useMemo(() => {
    const filterObj: FranchiseFilters = {
      page: currentPage,
      pageSize,
    };

    // Add search parameter if present
    if (filterTerm) {
      filterObj.search = filterTerm;
    }

    // Add filter parameters if not "all"
    if (paymentMethod !== "all") {
      filterObj.paymentMethod = paymentMethod;
    }

    if (orderStatus !== "all") {
      filterObj.orderStatus = orderStatus;
    }

    if (deliveryType !== "all") {
      filterObj.deliveryType = deliveryType;
    }

    if (logistic !== "all") {
      filterObj.logistic = logistic;
    }

    if (salesperson !== "all") {
      filterObj.salesperson = salesperson;
    }

    // Add date range parameters
    if (dateRange?.[0]) {
      const year = dateRange[0].getFullYear();
      const month = String(dateRange[0].getMonth() + 1).padStart(2, "0");
      const day = String(dateRange[0].getDate()).padStart(2, "0");
      filterObj.startDate = `${year}-${month}-${day}`;
    }

    if (dateRange?.[1]) {
      const year = dateRange[1].getFullYear();
      const month = String(dateRange[1].getMonth() + 1).padStart(2, "0");
      const day = String(dateRange[1].getDate()).padStart(2, "0");
      filterObj.endDate = `${year}-${month}-${day}`;
    }

    return filterObj;
  }, [
    currentPage,
    pageSize,
    filterTerm,
    paymentMethod,
    orderStatus,
    deliveryType,
    logistic,
    salesperson,
    dateRange,
  ]);

  const { franchise, isLoading, isError, error } = useFranchise(id, filters);

  const statusView = isLoading ? (
    <div>Loading franchise...</div>
  ) : isError ? (
    <div>Failed to load franchise: {error?.message}</div>
  ) : !franchise ? (
    <div>No franchise found.</div>
  ) : null;

  const sales: SaleItem[] = useMemo(
    () => franchise?.results ?? [],
    [franchise]
  );

  // Handle search input change with debouncing
  const handleSearchInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchInput(value);
      clearTimeout(searchTimeout.current);
      searchTimeout.current = setTimeout(() => {
        if (value.length >= 3) {
          // If search term is 3 or more characters, fetch from API
          setFilterTerm(value);
          setCurrentPage(1);
        } else if (value.length === 0) {
          // If search is cleared, reset to original data
          setFilterTerm("");
          setCurrentPage(1);
        }
      }, 300);
    },
    []
  );

  // Handle filter changes
  const handleFilterChange = useCallback(
    (filterType: string, value: string) => {
      setCurrentPage(1); // Reset to first page when filters change

      switch (filterType) {
        case "paymentMethod":
          setPaymentMethod(value);
          break;
        case "orderStatus":
          setOrderStatus(value);
          break;
        case "deliveryType":
          setDeliveryType(value);
          break;
        case "logistic":
          setLogistic(value);
          break;
        case "salesperson":
          setSalesperson(value);
          break;
      }
    },
    []
  );

  // Handle date range changes
  const handleDateRangeChange = useCallback(
    (dr: { from?: Date | undefined; to?: Date | undefined } | undefined) => {
      setCurrentPage(1); // Reset to first page when date range changes
      setDateRange(dr ? [dr.from, dr.to] : [undefined, undefined]);
    },
    [setDateRange]
  );

  const fetchSales = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleStatusChange = (_saleId: string, _newStatus: string) => {
    // no-op for now; API wiring can be added later
  };

  const handleEdit = (_sale: SaleItem) => {
    // no-op for now; open side panel etc.
  };

  return (
    <div className="container mx-auto p-4 space-y-3">
      {statusView ?? (
        <>
          <TableHeader
            columns={columns}
            toggleColumnVisibility={toggleColumnVisibility}
            showAllColumns={showAllColumns}
            hideAllColumns={hideAllColumns}
            salesCount={franchise?.count || 0}
            resultsCount={sales.length}
            searchInput={searchInput}
            handleSearchInputChange={handleSearchInputChange}
            setSearchInput={setSearchInput}
            setFilterTerm={setFilterTerm}
            fetchSales={fetchSales}
            showFilterForm={false}
            setShowFilterForm={() => {}}
            setShowExportModal={() => setShowExportModal(true)}
            paymentMethod={paymentMethod}
            setPaymentMethod={(value) =>
              handleFilterChange("paymentMethod", value)
            }
            orderStatus={orderStatus}
            setOrderStatus={(value) => handleFilterChange("orderStatus", value)}
            deliveryType={deliveryType}
            setDeliveryType={(value) =>
              handleFilterChange("deliveryType", value)
            }
            logistic={logistic}
            setLogistic={(value) => handleFilterChange("logistic", value)}
            dateRange={
              dateRange ? { from: dateRange[0], to: dateRange[1] } : undefined
            }
            setDateRange={handleDateRangeChange}
            sales={sales}
            salesperson={salesperson}
            setSalesperson={(value) => handleFilterChange("salesperson", value)}
            selectedCount={selectedIds.size}
          />

          <div className="overflow-auto border rounded-md">
            <TableBody
              tableRef={tableRef}
              columns={columns.map((c) => ({ ...c, visible: c.visible }))}
              isLoading={isLoading}
              displayData={sales}
              currentPage={currentPage}
              pageSize={pageSize}
              getValueByColumnId={getValueByColumnId}
              handleStatusChange={handleStatusChange}
              handleEdit={handleEdit}
              setSelectedPaymentImage={setSelectedPaymentImage}
              setShowPaymentImageModal={setShowPaymentImageModal}
              selectedIds={selectedIds}
              onSelectionChange={setSelectedIds}
            />
          </div>

          <TablePagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalCount={franchise?.count || 0}
            hasNext={!!franchise?.next}
            fetchSales={fetchSales}
          />
        </>
      )}
    </div>
  );
}
