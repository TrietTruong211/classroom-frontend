import { AdvancedImage } from "@cloudinary/react";
import { useCreate, useDelete, useList, useShow } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";
import { UserPlus, UserX } from "lucide-react";
import { useMemo, useState } from "react";
import { useParams } from "react-router";

import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { ShowButton } from "@/components/refine-ui/buttons/show";
import {
  ShowView,
  ShowViewHeader,
} from "@/components/refine-ui/views/show-view";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { bannerPhoto } from "@/lib/cloudinary";
import { ClassDetails, User, UserRole } from "@/types";

type ClassUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string | null;
};

const getInitials = (name = "") => {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "";
  return `${parts[0][0] ?? ""}${
    parts[parts.length - 1][0] ?? ""
  }`.toUpperCase();
};

const ClassesShow = () => {
  const { id } = useParams();
  const classId = id ?? "";

  const [enrollDialogOpen, setEnrollDialogOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");

  const { query } = useShow<ClassDetails>({ resource: "classes" });
  const classDetails = query.data?.data;

  // Fetch all students available to enroll
  const { result: studentsResult } = useList<User>({
    resource: "users",
    filters: [{ field: "role", operator: "eq", value: UserRole.STUDENT }],
    pagination: { pageSize: 100 },
  });
  const allStudents = studentsResult.data ?? [];

  const { mutate: enroll } = useCreate();
  const { mutate: unenroll } = useDelete();

  const handleEnroll = () => {
    if (!selectedStudentId) return;
    enroll(
      {
        resource: "enrollments",
        values: { classId: Number(classId), studentId: selectedStudentId },
      },
      {
        onSuccess: () => {
          setEnrollDialogOpen(false);
          setSelectedStudentId("");
        },
      }
    );
  };

  const handleUnenroll = (enrollmentId: string) => {
    unenroll({ resource: "enrollments", id: enrollmentId });
  };

  const studentColumns = useMemo<ColumnDef<ClassUser>[]>(
    () => [
      {
        id: "name",
        accessorKey: "name",
        size: 240,
        header: () => <p className="column-title">Student</p>,
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Avatar className="size-7">
              {row.original.image && (
                <AvatarImage src={row.original.image} alt={row.original.name} />
              )}
              <AvatarFallback>{getInitials(row.original.name)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col truncate">
              <span className="truncate">{row.original.name}</span>
              <span className="text-xs text-muted-foreground truncate">
                {row.original.email}
              </span>
            </div>
          </div>
        ),
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
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => handleUnenroll(row.original.id)}
            >
              <UserX className="h-4 w-4 mr-1" />
              Unenroll
            </Button>
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [classId]
  );

  const studentsTable = useTable<ClassUser>({
    columns: studentColumns,
    refineCoreProps: {
      resource: `classes/${classId}/users`,
      pagination: { pageSize: 5, mode: "server" },
      filters: {
        permanent: [{ field: "role", operator: "eq", value: "student" }],
      },
    },
  });

  if (query.isLoading || query.isError || !classDetails) {
    return (
      <ShowView className="class-view class-show">
        <ShowViewHeader resource="classes" title="Class Details" />
        <p className="state-message">
          {query.isLoading
            ? "Loading class details..."
            : query.isError
            ? "Failed to load class details."
            : "Class details not found."}
        </p>
      </ShowView>
    );
  }

  const teacherName = classDetails.teacher?.name ?? "Unknown";

  const placeholderUrl = `https://placehold.co/600x400?text=${encodeURIComponent(
    teacherName.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("") || "NA"
  )}`;

  return (
    <ShowView className="class-view class-show space-y-6">
      <ShowViewHeader resource="classes" title="Class Details" />

      <div className="banner">
        {classDetails.bannerUrl ? (
          classDetails.bannerUrl.includes("res.cloudinary.com") &&
          classDetails.bannerCldPubId ? (
            <AdvancedImage
              cldImg={bannerPhoto(
                classDetails.bannerCldPubId ?? "",
                classDetails.name
              )}
              alt="Class Banner"
            />
          ) : (
            <img
              src={classDetails.bannerUrl}
              alt={classDetails.name}
              loading="lazy"
            />
          )
        ) : (
          <div className="placeholder" />
        )}
      </div>

      <Card className="details-card">
        {/* Class Details */}
        <div>
          <div className="details-header">
            <div>
              <h1>{classDetails.name}</h1>
              <p>{classDetails.description}</p>
            </div>

            <div>
              <Badge variant="outline">{classDetails.capacity} spots</Badge>
              <Badge
                variant={
                  classDetails.status === "active" ? "default" : "secondary"
                }
                data-status={classDetails.status}
              >
                {classDetails.status.toUpperCase()}
              </Badge>
            </div>
          </div>

          <div className="details-grid">
            <div className="instructor">
              <p>👨‍🏫 Instructor</p>
              <div>
                <img
                  src={classDetails.teacher?.image ?? placeholderUrl}
                  alt={teacherName}
                />
                <div>
                  <p>{teacherName}</p>
                  <p>{classDetails?.teacher?.email}</p>
                </div>
              </div>
            </div>

            {classDetails?.subject?.department && (
              <div className="department">
                <p>🏛️ Department</p>
                <div>
                  <p>{classDetails.subject.department.name}</p>
                  <p>{classDetails.subject.department.description}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Subject Card */}
        <div className="subject">
          <p>📚 Subject</p>
          <div>
            <Badge variant="outline">
              Code: <span>{classDetails?.subject?.code}</span>
            </Badge>
            <p>{classDetails?.subject?.name}</p>
            <p>{classDetails?.subject?.description}</p>
          </div>
        </div>

        <Separator />

        {/* Invite code */}
        {classDetails.inviteCode && (
          <>
            <div className="join">
              <h2>🔑 Invite Code</h2>
              <div className="flex items-center gap-3">
                <code className="bg-muted px-4 py-2 rounded-md text-lg font-mono tracking-widest">
                  {classDetails.inviteCode}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      classDetails.inviteCode ?? ""
                    );
                  }}
                >
                  Copy
                </Button>
              </div>
            </div>
            <Separator />
          </>
        )}

        {/* Join Class Section */}
        <div className="join">
          <h2>🎓 Join Class</h2>
          <ol>
            <li>Ask your teacher for the invite code.</li>
            <li>Click on &quot;Join Class&quot; button.</li>
            <li>Paste the code and click &quot;Join&quot;</li>
          </ol>
        </div>

        <Button size="lg" className="w-full">
          Join Class
        </Button>
      </Card>

      {/* Enrolled Students */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Enrolled Students</CardTitle>

          {/* Enroll dialog */}
          <Dialog open={enrollDialogOpen} onOpenChange={setEnrollDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <UserPlus className="h-4 w-4 mr-2" />
                Enroll Student
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Enroll a Student</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <Select
                  value={selectedStudentId}
                  onValueChange={setSelectedStudentId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a student" />
                  </SelectTrigger>
                  <SelectContent>
                    {allStudents.map((s: User) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name} — {s.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setEnrollDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleEnroll}
                    disabled={!selectedStudentId}
                  >
                    Enroll
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <DataTable table={studentsTable} />
        </CardContent>
      </Card>
    </ShowView>
  );
};

export default ClassesShow;
