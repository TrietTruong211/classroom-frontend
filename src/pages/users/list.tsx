import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useTable } from "@refinedev/react-table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ListView } from "@/components/refine-ui/views/list-view";
import { CreateButton } from "@/components/refine-ui/buttons/create";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { ShowButton } from "@/components/refine-ui/buttons/show";
import { EditButton } from "@/components/refine-ui/buttons/edit";
import { DeleteButton } from "@/components/refine-ui/buttons/delete";
import { User, UserRole } from "@/types";

const ROLE_BADGE_VARIANT: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  admin: "destructive",
  teacher: "default",
  student: "secondary",
};

const getInitials = (name = "") =>
  name
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

const UsersList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        id: "user",
        accessorKey: "name",
        size: 260,
        header: () => <p className="column-title ml-2">User</p>,
        cell: ({ row }) => (
          <div className="flex items-center gap-3 ml-2">
            <Avatar className="size-8">
              {row.original.image && (
                <AvatarImage
                  src={row.original.image}
                  alt={row.original.name}
                />
              )}
              <AvatarFallback className="text-xs">
                {getInitials(row.original.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <span className="font-medium truncate">{row.original.name}</span>
              <span className="text-xs text-muted-foreground truncate">
                {row.original.email}
              </span>
            </div>
          </div>
        ),
      },
      {
        id: "role",
        accessorKey: "role",
        size: 120,
        header: () => <p className="column-title">Role</p>,
        cell: ({ getValue }) => {
          const role = getValue<string>();
          return (
            <Badge variant={ROLE_BADGE_VARIANT[role] ?? "outline"}>
              {role}
            </Badge>
          );
        },
      },
      {
        id: "department",
        accessorKey: "department.name",
        size: 180,
        header: () => <p className="column-title">Department</p>,
        cell: ({ getValue }) => {
          const dept = getValue<string | undefined>();
          return dept ? (
            <Badge variant="outline">{dept}</Badge>
          ) : (
            <span className="text-muted-foreground text-sm">—</span>
          );
        },
      },
      {
        id: "actions",
        size: 200,
        header: () => <p className="column-title">Actions</p>,
        cell: ({ row }) => (
          <div className="flex gap-1">
            <ShowButton
              resource="users"
              recordItemId={row.original.id}
              variant="outline"
              size="sm"
            >
              View
            </ShowButton>
            <EditButton
              resource="users"
              recordItemId={row.original.id}
              variant="outline"
              size="sm"
            />
            <DeleteButton
              resource="users"
              recordItemId={row.original.id}
              size="sm"
            />
          </div>
        ),
      },
    ],
    []
  );

  const roleFilters =
    selectedRole === "all"
      ? []
      : [{ field: "role", operator: "eq" as const, value: selectedRole }];

  const searchFilters = searchQuery
    ? [{ field: "name", operator: "contains" as const, value: searchQuery }]
    : [];

  const table = useTable<User>({
    columns,
    refineCoreProps: {
      resource: "users",
      pagination: { pageSize: 10, mode: "server" },
      filters: { permanent: [...roleFilters, ...searchFilters] },
      sorters: { initial: [{ field: "id", order: "desc" }] },
    },
  });

  return (
    <ListView>
      <Breadcrumb />
      <h1 className="page-title">Users</h1>

      <div className="intro-row">
        <p>Manage admins, teachers, and students in your institution.</p>

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

          <div className="flex gap-2 w-full sm:w-auto">
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                <SelectItem value={UserRole.TEACHER}>Teacher</SelectItem>
                <SelectItem value={UserRole.STUDENT}>Student</SelectItem>
              </SelectContent>
            </Select>
            <CreateButton resource="users" />
          </div>
        </div>
      </div>

      <DataTable table={table} />
    </ListView>
  );
};

export default UsersList;
