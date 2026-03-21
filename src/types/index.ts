export type Subject = {
  id: number;
  departmentId: number;
  name: string;
  code: string;
  description?: string;
  department?: Department;
  createdAt: string;
  updatedAt: string;
};

export type ListResponse<T = unknown> = {
  data?: T[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type CreateResponse<T = unknown> = {
  data?: T;
};

export type GetOneResponse<T = unknown> = {
  data?: T;
};

declare global {
  interface CloudinaryUploadWidgetResults {
    event: string;
    info: {
      secure_url: string;
      public_id: string;
      delete_token?: string;
      resource_type: string;
      original_filename: string;
    };
  }

  interface CloudinaryWidget {
    open: () => void;
  }

  interface Window {
    cloudinary?: {
      createUploadWidget: (
        options: Record<string, unknown>,
        callback: (
          error: unknown,
          result: CloudinaryUploadWidgetResults
        ) => void
      ) => CloudinaryWidget;
    };
  }
}

export interface UploadWidgetValue {
  url: string;
  publicId: string;
}

export interface UploadWidgetProps {
  value?: UploadWidgetValue | null;
  onChange?: (value: UploadWidgetValue | null) => void;
  disabled?: boolean;
}

export enum UserRole {
  STUDENT = "student",
  TEACHER = "teacher",
  ADMIN = "admin",
}

export type User = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  role: UserRole;
  image?: string;
  imageCldPubId?: string;
  createdAt: string;
  updatedAt: string;
};

export type Schedule = {
  day: string;
  startTime: string;
  endTime: string;
};

export type Department = {
  id: number;
  code: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
};

export type ClassDetails = {
  id: number;
  subjectId: number;
  teacherId: string;
  inviteCode: string;
  name: string;
  description?: string;
  status: "active" | "inactive" | "archived";
  capacity: number;
  bannerUrl?: string;
  bannerCldPubId?: string;
  schedules: Schedule[];
  subject?: Subject;
  teacher?: User;
  createdAt: string;
  updatedAt: string;
};

export type Enrollment = {
  id: number;
  studentId: string;
  classId: number;
  createdAt: string;
  updatedAt: string;
  student?: User;
  class?: ClassDetails;
};

export type SignUpPayload = {
  email: string;
  name: string;
  password: string;
  image?: string;
  imageCldPubId?: string;
  role: UserRole;
};