import { useForm } from "@refinedev/react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBack, useList } from "@refinedev/core";
import { Loader2 } from "lucide-react";
import z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EditView } from "@/components/refine-ui/views/edit-view";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { Department, UserRole } from "@/types";
import UploadWidget from "@/components/upload-widget";

const userEditSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["admin", "teacher", "student"], {
    required_error: "Please select a role",
  }),
  departmentId: z.coerce.number().optional(),
  image: z.string().optional(),
  imageCldPubId: z.string().optional(),
});

const UsersEdit = () => {
  const back = useBack();

  const form = useForm({
    resolver: zodResolver(userEditSchema),
    refineCoreProps: {
      resource: "users",
      action: "edit",
    },
  });

  const {
    refineCore: { onFinish },
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { isSubmitting },
  } = form;

  const imagePublicId = watch("imageCldPubId");

  const { result: deptsResult } = useList<Department>({
    resource: "departments",
    pagination: { pageSize: 100 },
  });
  const departments = deptsResult.data ?? [];

  return (
    <EditView>
      <Breadcrumb />
      <h1 className="page-title">Edit User</h1>

      <div className="intro-row">
        <p>Update user information.</p>
        <Button variant="outline" onClick={() => back()}>
          Go Back
        </Button>
      </div>

      <Separator />

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>User Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={handleSubmit(async (values: z.infer<typeof userEditSchema>) => {
                await onFinish(values);
              })}
              className="space-y-5"
            >
              <FormField
                control={control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Photo</FormLabel>
                    <FormControl>
                      <UploadWidget
                        value={
                          field.value
                            ? { url: field.value, publicId: imagePublicId ?? "" }
                            : null
                        }
                        onChange={(file) => {
                          if (file) {
                            field.onChange(file.url);
                            setValue("imageCldPubId", file.publicId);
                          } else {
                            field.onChange("");
                            setValue("imageCldPubId", "");
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Full Name <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Jane Smith" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Email <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="jane@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Role <span className="text-destructive">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                          <SelectItem value={UserRole.TEACHER}>
                            Teacher
                          </SelectItem>
                          <SelectItem value={UserRole.STUDENT}>
                            Student
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="departmentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <Select
                        onValueChange={(v) => field.onChange(Number(v))}
                        value={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {departments.map((dept: Department) => (
                            <SelectItem key={dept.id} value={String(dept.id)}>
                              {dept.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Changes
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => back()}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </EditView>
  );
};

export default UsersEdit;
