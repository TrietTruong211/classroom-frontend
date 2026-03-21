import { useMemo } from "react";
import { useShow } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShowButton } from "@/components/refine-ui/buttons/show";
import { EditButton } from "@/components/refine-ui/buttons/edit";
import { DeleteButton } from "@/components/refine-ui/buttons/delete";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import {
  ShowView,
  ShowViewHeader,
} from "@/components/refine-ui/views/show-view";
import { Department, Subject } from "@/types";

const DepartmentsShow = () => {
  const { query } = useShow<Department>({ resource: "departments" });
  const department = query.data?.data;

  const subjectColumns = useMemo<ColumnDef<Subject>[]>(
    () => [
      {
        id: "code",
        accessorKey: "code",
        size: 100,
        header: () => <p className="column-title ml-2">Code</p>,
        cell: ({ getValue }) => (
          <Badge className="ml-2">{getValue<string>()}</Badge>
        ),
      },
      {
        id: "name",
        accessorKey: "name",
        size: 200,
        header: () => <p className="column-title">Name</p>,
        cell: ({ getValue }) => (
          <span className="text-foreground">{getValue<string>()}</span>
        ),
      },
      {
        id: "description",
        accessorKey: "description",
        size: 300,
        header: () => <p className="column-title">Description</p>,
        cell: ({ getValue }) => (
          <span className="text-muted-foreground line-clamp-2">
            {getValue<string>()}
          </span>
        ),
      },
      {
        id: "actions",
        size: 120,
        header: () => <p className="column-title">Actions</p>,
        cell: ({ row }) => (
          <ShowButton
            resource="subjects"
            recordItemId={row.original.id}
            variant="outline"
            size="sm"
          >
            View
          </ShowButton>
        ),
      },
    ],
    []
  );

  const subjectsTable = useTable<Subject>({
    columns: subjectColumns,
    refineCoreProps: {
      resource: "subjects",
      pagination: { pageSize: 10, mode: "server" },
      filters: {
        permanent: department
          ? [
              {
                field: "department",
                operator: "eq" as const,
                value: String(department.id),
              },
            ]
          : [],
      },
    },
  });

  if (query.isLoading || !department) {
    return (
      <ShowView>
        <ShowViewHeader resource="departments" title="Department Details" />
        <p className="text-muted-foreground">
          {query.isLoading ? "Loading..." : "Department not found."}
        </p>
      </ShowView>
    );
  }

  return (
    <ShowView className="space-y-6">
      <ShowViewHeader resource="departments" title="Department Details" />

      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle className="text-2xl">{department.name}</CardTitle>
            <p className="text-muted-foreground mt-1">{department.description}</p>
          </div>
          <div className="flex gap-2">
            <EditButton
              resource="departments"
              recordItemId={department.id}
              variant="outline"
              size="sm"
            />
            <DeleteButton
              resource="departments"
              recordItemId={department.id}
              size="sm"
            />
          </div>
        </CardHeader>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Subjects in this Department</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable table={subjectsTable} />
        </CardContent>
      </Card>
    </ShowView>
  );
};

export default DepartmentsShow;
