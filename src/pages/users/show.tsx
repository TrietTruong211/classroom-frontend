import { useShow } from "@refinedev/core";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { EditButton } from "@/components/refine-ui/buttons/edit";
import { DeleteButton } from "@/components/refine-ui/buttons/delete";
import {
  ShowView,
  ShowViewHeader,
} from "@/components/refine-ui/views/show-view";
import { User } from "@/types";

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

const UsersShow = () => {
  const { query } = useShow<User>({ resource: "users" });
  const user = query.data?.data;

  if (query.isLoading || !user) {
    return (
      <ShowView>
        <ShowViewHeader resource="users" title="User Details" />
        <p className="text-muted-foreground">
          {query.isLoading ? "Loading..." : "User not found."}
        </p>
      </ShowView>
    );
  }

  return (
    <ShowView className="space-y-6">
      <ShowViewHeader resource="users" title="User Details" />

      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="size-16">
              {user.image && (
                <AvatarImage src={user.image} alt={user.name} />
              )}
              <AvatarFallback className="text-lg">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              <p className="text-muted-foreground">{user.email}</p>
              <div className="mt-2">
                <Badge variant={ROLE_BADGE_VARIANT[user.role] ?? "outline"}>
                  {user.role}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <EditButton
              resource="users"
              recordItemId={user.id}
              variant="outline"
              size="sm"
            />
            <DeleteButton
              resource="users"
              recordItemId={user.id}
              size="sm"
            />
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="pt-4 space-y-3">
          {/* {user.department && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground w-32">
                Department
              </span>
              <Badge variant="outline">
                {typeof user.department === "object"
                  ? user.department.name
                  : user.department}
              </Badge>
            </div>
          )} */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground w-32">
              Member since
            </span>
            <span className="text-sm">
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "—"}
            </span>
          </div>
        </CardContent>
      </Card>
    </ShowView>
  );
};

export default UsersShow;
