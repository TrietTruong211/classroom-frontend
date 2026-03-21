import { useForm } from "@refinedev/react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBack, useList } from "@refinedev/core";
import { Loader2 } from "lucide-react";
import z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Department } from "@/types";

const subjectEditSchema = z.object({
  name: z.string().min(3, "Subject name must be at least 3 characters"),
  code: z.string().min(2, "Subject code must be at least 2 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  departmentId: z.coerce
    .number({
      required_error: "Department is required",
      invalid_type_error: "Department is required",
    })
    .min(1, "Department is required"),
});

const SubjectsEdit = () => {
  const back = useBack();

  const form = useForm({
    resolver: zodResolver(subjectEditSchema),
    refineCoreProps: {
      resource: "subjects",
      action: "edit",
    },
  });

  const {
    refineCore: { onFinish },
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = form;

  const { query: deptsQuery, result: deptsResult } = useList<Department>({
    resource: "departments",
    pagination: { pageSize: 100 },
  });
  const departments = deptsResult.data ?? [];
  const deptsLoading = deptsQuery.isLoading;

  return (
    <EditView>
      <Breadcrumb />
      <h1 className="page-title">Edit Subject</h1>

      <div className="intro-row">
        <p>Update subject information.</p>
        <Button variant="outline" onClick={() => back()}>
          Go Back
        </Button>
      </div>

      <Separator />

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Subject Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={handleSubmit(async (values: z.infer<typeof subjectEditSchema>) => {
                await onFinish(values);
              })}
              className="space-y-5"
            >
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Subject Name <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Introduction to Programming"
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
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Subject Code <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="CS101" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="departmentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Department <span className="text-destructive">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={(v) => field.onChange(Number(v))}
                        value={field.value?.toString()}
                        disabled={deptsLoading}
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

              <FormField
                control={control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Description <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description of this subject..."
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2 pt-2">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Changes
                </Button>
                <Button type="button" variant="outline" onClick={() => back()}>
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

export default SubjectsEdit;
