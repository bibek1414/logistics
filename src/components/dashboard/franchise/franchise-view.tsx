"use client";

import { useFranchise } from "@/hooks/use-franchises";
import { useMemo, useRef, useState } from "react";
import { useTableColumns } from "@/components/dashboard/franchise/hooks/use-table-columns";
import { useTableData } from "@/components/dashboard/franchise/hooks/use-table-data";
import { useTableFilters } from "@/components/dashboard/franchise/hooks/use-table-filters";
import { TableHeader } from "@/components/dashboard/franchise/components/table-header";
import { TableBody } from "@/components/dashboard/franchise/components/table-body";
import { TablePagination } from "@/components/dashboard/franchise/components/table-pagination";
import type { SaleItem } from "@/types/sales";

export default function FranchiseView({ id }: { id: number }) {
  const { franchise, isLoading, isError, error } = useFranchise(id);
  const tableRef = useRef<HTMLTableElement>(null);

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

  const { columns, toggleColumnVisibility, showAllColumns, hideAllColumns } =
    useTableColumns();
  const { sortField, sortDirection, handleSort, sortData, getValueByColumnId } =
    useTableData();
  const { applyFilters, dateRange, setDateRange } = useTableFilters();

  // Client-side search and filter
  const filtered = useMemo(() => {
    const term = (filterTerm || searchInput).toLowerCase();
    let data = sales;
    if (term) {
      data = data.filter((s) =>
        [
          s.full_name,
          s.city,
          s.delivery_address,
          s.phone_number,
          s.alternate_phone_number || "",
          s.order_status,
          s.payment_method,
          s.delivery_type,
          s.dash_location_name || "",
          s.dash_tracking_code || "",
          s.sales_person?.first_name + " " + s.sales_person?.last_name,
          s.order_products.map((op) => op.product.name).join(","),
        ]
          .join(" ")
          .toLowerCase()
          .includes(term)
      );
    }
    // simple dropdown filters
    if (paymentMethod !== "all") {
      data = data.filter((s) => s.payment_method === paymentMethod);
    }
    if (orderStatus !== "all") {
      data = data.filter((s) => s.order_status === orderStatus);
    }
    if (deliveryType !== "all") {
      data = data.filter((s) => s.delivery_type === deliveryType);
    }
    if (salesperson !== "all") {
      data = data.filter((s) => String(s.sales_person?.id) === salesperson);
    }
    // extra packaging logistic chip filter (best-effort)
    if (logistic !== "all") {
      data = data.filter(
        (s) => s.logistics === logistic || s.logistics_name === logistic
      );
    }
    // date range filter using shared hook
    data = applyFilters(data);
    return data;
  }, [
    sales,
    searchInput,
    filterTerm,
    paymentMethod,
    orderStatus,
    deliveryType,
    logistic,
    salesperson,
    applyFilters,
  ]);

  const sorted = useMemo(
    () => sortData(filtered, sortField, sortDirection),
    [filtered, sortField, sortDirection, sortData]
  );

  const totalCount = sorted.length;
  const hasNext = currentPage * pageSize < totalCount;
  const paged = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, currentPage, pageSize]);

  const fetchSales = (page: number) => setCurrentPage(page);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    setCurrentPage(1);
  };

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
            salesCount={sales.length}
            resultsCount={filtered.length}
            searchInput={searchInput}
            handleSearchInputChange={handleSearchInputChange}
            setSearchInput={setSearchInput}
            setFilterTerm={setFilterTerm}
            fetchSales={fetchSales}
            showFilterForm={false}
            setShowFilterForm={() => {}}
            setShowExportModal={() => setShowExportModal(true)}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            orderStatus={orderStatus}
            setOrderStatus={setOrderStatus}
            deliveryType={deliveryType}
            setDeliveryType={setDeliveryType}
            logistic={logistic}
            setLogistic={setLogistic}
            dateRange={
              dateRange ? { from: dateRange[0], to: dateRange[1] } : undefined
            }
            setDateRange={(dr) =>
              setDateRange(dr ? [dr.from, dr.to] : [undefined, undefined])
            }
            sales={sales}
            salesperson={salesperson}
            setSalesperson={setSalesperson}
          />

          <div className="overflow-auto border rounded-md">
            <TableBody
              tableRef={tableRef}
              columns={columns.map((c) => ({ ...c, visible: c.visible }))}
              isLoading={isLoading}
              displayData={paged}
              currentPage={currentPage}
              pageSize={pageSize}
              getValueByColumnId={getValueByColumnId}
              handleStatusChange={handleStatusChange}
              handleEdit={handleEdit}
              setSelectedPaymentImage={setSelectedPaymentImage}
              setShowPaymentImageModal={setShowPaymentImageModal}
            />
          </div>

          <TablePagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalCount={totalCount}
            hasNext={hasNext}
            fetchSales={fetchSales}
          />
        </>
      )}
    </div>
  );
}
