import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useTable } from "@refinedev/react-table";

import { Input } from "@/components/ui/input";
import { ListView } from "@/components/refine-ui/views/list-view";
import { CreateButton } from "@/components/refine-ui/buttons/create";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { ShowButton } from "@/components/refine-ui/buttons/show";
import { EditButton } from "@/components/refine-ui/buttons/edit";
import { DeleteButton } from "@/components/refine-ui/buttons/delete";
import { Department } from "@/types";

const DepartmentsList = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const columns = useMemo<ColumnDef<Department>[]>(
    () => [
      {
        id: "name",
        accessorKey: "name",
        size: 220,
        header: () => <p className="column-title ml-2">Name</p>,
        cell: ({ getValue }) => (
          <span className="font-medium ml-2">{getValue<string>()}</span>
        ),
      },
      {
        id: "description",
        accessorKey: "description",
        size: 400,
        header: () => <p className="column-title">Description</p>,
        cell: ({ getValue }) => (
          <span className="text-muted-foreground line-clamp-2">
            {getValue<string>()}
          </span>
        ),
      },
      {
        id: "actions",
        size: 200,
        header: () => <p className="column-title">Actions</p>,
        cell: ({ row }) => (
          <div className="flex gap-1">
            <ShowButton
              resource="departments"
              recordItemId={row.original.id}
              variant="outline"
              size="sm"
            >
              View
            </ShowButton>
            <EditButton
              resource="departments"
              recordItemId={row.original.id}
              variant="outline"
              size="sm"
            />
            <DeleteButton
              resource="departments"
              recordItemId={row.original.id}
              size="sm"
            />
          </div>
        ),
      },
    ],
    []
  );

  const searchFilters = searchQuery
    ? [{ field: "name", operator: "contains" as const, value: searchQuery }]
    : [];

  const table = useTable<Department>({
    columns,
    refineCoreProps: {
      resource: "departments",
      pagination: { pageSize: 10, mode: "server" },
      filters: { permanent: searchFilters },
      sorters: { initial: [{ field: "id", order: "desc" }] },
    },
  });

  return (
    <ListView>
      <Breadcrumb />
      <h1 className="page-title">Departments</h1>

      <div className="intro-row">
        <p>Manage academic departments in your institution.</p>

        <div className="actions-row">
          <div className="search-field">
            <Search className="search-icon" />
            <Input
              type="text"
              placeholder="Search by name..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <CreateButton resource="departments" />
        </div>
      </div>

      <DataTable table={table} />
    </ListView>
  );
};

export default DepartmentsList;
