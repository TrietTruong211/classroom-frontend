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
import { Subject } from "@/types";

type ClassListItem = {
  id: number;
  name: string;
  status: "active" | "inactive";
  capacity: number;
  teacher?: { name: string };
};

const SubjectsShow = () => {
  const { query } = useShow<Subject>({ resource: "subjects" });
  const subject = query.data?.data;

  const classColumns = useMemo<ColumnDef<ClassListItem>[]>(
    () => [
      {
        id: "name",
        accessorKey: "name",
        size: 240,
        header: () => <p className="column-title ml-2">Class Name</p>,
        cell: ({ getValue }) => (
          <span className="font-medium ml-2">{getValue<string>()}</span>
        ),
      },
      {
        id: "teacher",
        accessorKey: "teacher.name",
        size: 180,
        header: () => <p className="column-title">Teacher</p>,
        cell: ({ getValue }) => {
          const name = getValue<string | undefined>();
          return name ? (
            <span className="text-foreground">{name}</span>
          ) : (
            <span className="text-muted-foreground">Not assigned</span>
          );
        },
      },
      {
        id: "status",
        accessorKey: "status",
        size: 120,
        header: () => <p className="column-title">Status</p>,
        cell: ({ getValue }) => {
          const status = getValue<"active" | "inactive">();
          return (
            <Badge variant={status === "active" ? "default" : "secondary"}>
              {status}
            </Badge>
          );
        },
      },
      {
        id: "capacity",
        accessorKey: "capacity",
        size: 100,
        header: () => <p className="column-title">Capacity</p>,
        cell: ({ getValue }) => (
          <span>{getValue<number>()}</span>
        ),
      },
      {
        id: "actions",
        size: 120,
        header: () => <p className="column-title">Actions</p>,
        cell: ({ row }) => (
          <ShowButton
            resource="classes"
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

  const classesTable = useTable<ClassListItem>({
    columns: classColumns,
    refineCoreProps: {
      resource: "classes",
      pagination: { pageSize: 10, mode: "server" },
      filters: {
        permanent: subject
          ? [
              {
                field: "subject",
                operator: "eq" as const,
                value: String(subject.id),
              },
            ]
          : [],
      },
    },
  });

  if (query.isLoading || !subject) {
    return (
      <ShowView>
        <ShowViewHeader resource="subjects" title="Subject Details" />
        <p className="text-muted-foreground">
          {query.isLoading ? "Loading..." : "Subject not found."}
        </p>
      </ShowView>
    );
  }

  return (
    <ShowView className="space-y-6">
      <ShowViewHeader resource="subjects" title="Subject Details" />

      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Badge className="text-base px-3 py-1">{subject.code}</Badge>
              <CardTitle className="text-2xl">{subject.name}</CardTitle>
            </div>
            <p className="text-muted-foreground">{subject.description}</p>
            {subject.department && (
              <Badge variant="secondary">
                {typeof subject.department === "object"
                  ? subject.department.name
                  : subject.department}
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            <EditButton
              resource="subjects"
              recordItemId={subject.id}
              variant="outline"
              size="sm"
            />
            <DeleteButton
              resource="subjects"
              recordItemId={subject.id}
              size="sm"
            />
          </div>
        </CardHeader>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Classes using this Subject</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable table={classesTable} />
        </CardContent>
      </Card>
    </ShowView>
  );
};

export default SubjectsShow;
