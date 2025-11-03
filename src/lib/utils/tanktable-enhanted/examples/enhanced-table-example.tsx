import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import TankTable from "../component/tank-table";
import type { BulkActions, ExportOptions, LoadingStates } from "../types/tank-table.types";

// Example data type
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
  description: string;
}

// Example data
const sampleData: Product[] = [
  {
    id: 1,
    name: "Laptop",
    price: 999.99,
    category: "Electronics",
    inStock: true,
    description: "High-performance laptop for professionals"
  },
  {
    id: 2,
    name: "Mouse",
    price: 29.99,
    category: "Electronics",
    inStock: true,
    description: "Wireless optical mouse"
  },
  {
    id: 3,
    name: "Keyboard",
    price: 79.99,
    category: "Electronics",
    inStock: false,
    description: "Mechanical gaming keyboard"
  }
];

// Example columns
const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Product Name",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ getValue }) => `$${getValue<number>()}`,
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "inStock",
    header: "In Stock",
    cell: ({ getValue }) => getValue<boolean>() ? "Yes" : "No",
  },
];

export function EnhancedTableExample() {
  // Bulk actions configuration
  const bulkActions: BulkActions<Product> = {
    onBulkDelete: async (selectedRows) => {
      console.log("Deleting products:", selectedRows);
      // Implement your delete logic here
    },
    onBulkExport: (selectedRows) => {
      console.log("Exporting products:", selectedRows);
      // Custom export logic
    },
    bulkDeleteLabel: "Delete Products",
    bulkExportLabel: "Export Products",
  };

  // Export options configuration
  const exportOptions: ExportOptions<Product> = {
    formats: ['csv', 'json'],
    filename: 'products',
    includeHeaders: true,
    onExport: (data, format) => {
      console.log(`Exporting ${data.length} products as ${format}`);
    },
  };

  // Loading states configuration
  const loadingStates: LoadingStates = {
    loading: false, // Set to true to show loading skeleton
    error: null, // Set to error message to show error state
    loadingRows: 5,
    emptyState: (
      <div className="text-center py-8">
        <p className="text-gray-500">No products found</p>
        <button className="mt-2 text-blue-600 hover:underline">
          Add your first product
        </button>
      </div>
    ),
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Enhanced TankTable Example</h1>
      
      <TankTable
        data={sampleData}
        columns={columns}
        showPagination={true}
        showAdd={true}
        addButtonLabel="Add Product"
        enableRowSelection={true}
        bulkActions={bulkActions}
        exportOptions={exportOptions}
        loadingStates={loadingStates}
        onRowSave={async (row) => {
          console.log("Saving product:", row);
        }}
        onRowDelete={async (row) => {
          console.log("Deleting product:", row);
        }}
        createForm={{
          title: "Add New Product",
          fields: [
            {
              name: "name",
              label: "Product Name",
              inputType: "text",
              required: true,
            },
            {
              name: "price",
              label: "Price",
              inputType: "number",
              required: true,
              step: "0.01",
            },
            {
              name: "category",
              label: "Category",
              inputType: "select",
              options: [
                { value: "Electronics", label: "Electronics" },
                { value: "Clothing", label: "Clothing" },
                { value: "Books", label: "Books" },
              ],
            },
            {
              name: "inStock",
              label: "In Stock",
              inputType: "checkbox",
            },
            {
              name: "description",
              label: "Description",
              inputType: "textarea",
            },
          ],
          onSubmit: async (data) => {
            console.log("Creating product:", data);
          },
        }}
        deleteConfirm={{
          title: "Delete Product",
          description: "Are you sure you want to delete this product? This action cannot be undone.",
          confirmLabel: "Delete",
          cancelLabel: "Cancel",
        }}
      />
    </div>
  );
}
