// import { createSimpleRestDataProvider } from "@refinedev/rest/simple-rest";
// import { API_URL } from "./constants";
// export const { dataProvider, kyInstance } = createSimpleRestDataProvider({
//   apiURL: API_URL,
// });

import { BaseRecord, DataProvider, GetListParams, GetListResponse } from "@refinedev/core";

import type { Subject } from "@/types";

const mockSubjects: Subject[] = [
  {
    id: 1,
    code: "CS101",
    name: "Introduction to Programming",
    description: "Core programming concepts using structured problem-solving and TypeScript fundamentals.",
    department: "Computer Science",
    createdAt: "2026-01-08T08:30:00.000Z",
  },
  {
    id: 2,
    code: "CS205",
    name: "Data Structures",
    description: "Study of arrays, linked lists, trees, graphs, and practical algorithm design.",
    department: "Computer Science",
    createdAt: "2026-01-12T10:15:00.000Z",
  },
  {
    id: 3,
    code: "MTH110",
    name: "Calculus I",
    description: "Limits, derivatives, and introductory integral calculus for science majors.",
    department: "Mathematics",
    createdAt: "2026-01-15T09:00:00.000Z",
  },
  {
    id: 4,
    code: "PHY120",
    name: "General Physics",
    description: "Mechanics, motion, forces, and laboratory-based physical measurements.",
    department: "Physics",
    createdAt: "2026-01-18T13:20:00.000Z",
  },
  {
    id: 5,
    code: "CHM101",
    name: "Introductory Chemistry",
    description: "Atomic structure, bonding, reactions, and quantitative chemical analysis.",
    department: "Chemistry",
    createdAt: "2026-01-20T11:45:00.000Z",
  },
  {
    id: 6,
    code: "BIO130",
    name: "Cell Biology",
    description: "Cell structure, metabolism, genetics, and biological systems at the molecular level.",
    department: "Biology",
    createdAt: "2026-01-23T14:10:00.000Z",
  },
  {
    id: 7,
    code: "ENG201",
    name: "Academic Writing",
    description: "Research-based writing, citation standards, argument structure, and revision practice.",
    department: "English",
    createdAt: "2026-01-25T16:05:00.000Z",
  },
  {
    id: 8,
    code: "ECO220",
    name: "Microeconomics",
    description: "Consumer behavior, market structures, pricing models, and economic decision-making.",
    department: "Economics",
    createdAt: "2026-01-28T08:55:00.000Z",
  },
  {
    id: 9,
    code: "BUS210",
    name: "Principles of Management",
    description: "Organizational leadership, operations, communication, and managerial planning.",
    department: "Business Administration",
    createdAt: "2026-02-01T12:40:00.000Z",
  },
  {
    id: 10,
    code: "LAW150",
    name: "Introduction to Legal Systems",
    description: "Foundations of civil law, legal reasoning, institutions, and public policy.",
    department: "Law",
    createdAt: "2026-02-03T15:00:00.000Z",
  },
  {
    id: 11,
    code: "EDU115",
    name: "Learning Theories",
    description: "Survey of major educational theories and their application in classroom practice.",
    department: "Education",
    createdAt: "2026-02-06T09:35:00.000Z",
  },
  {
    id: 12,
    code: "PSY140",
    name: "Introduction to Psychology",
    description: "Behavior, cognition, memory, development, and evidence-based psychological models.",
    department: "Psychology",
    createdAt: "2026-02-08T10:50:00.000Z",
  },
];

const applySubjectFilters = (subjects: Subject[], filters: GetListParams["filters"]) => {
  if (!filters || !Array.isArray(filters)) {
    return subjects;
  }

  return subjects.filter((subject) => {
    return filters.every((filter) => {
      if (!("field" in filter) || !("operator" in filter)) {
        return true;
      }

      if (filter.field === "department" && filter.operator === "eq") {
        return subject.department === filter.value;
      }

      if (filter.field === "name" && filter.operator === "contains") {
        return subject.name.toLowerCase().includes(String(filter.value ?? "").toLowerCase());
      }

      return true;
    });
  });
};

export const dataProvider: DataProvider = {
  getList: async <TData extends BaseRecord = BaseRecord>({ resource, filters, pagination }: GetListParams): Promise<GetListResponse<TData>> => {
    if (resource !== "subjects") {
      return { data: [] as TData[], total: 0 };
    }

    const filteredSubjects = applySubjectFilters(mockSubjects, filters);
    const currentPage = pagination?.currentPage ?? 1;
    const pageSize = pagination?.pageSize ?? filteredSubjects.length;
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedSubjects = filteredSubjects.slice(startIndex, startIndex + pageSize);

    return {
      data: paginatedSubjects as unknown as TData[],
      total: filteredSubjects.length,
    };
  },

  getOne: async () => { throw new Error("Method not implemented."); },
  create: async () => { throw new Error("Method not implemented."); },
  update: async () => { throw new Error("Method not implemented."); },
  deleteOne: async () => { throw new Error("Method not implemented."); },

  getApiUrl: () => "http://localhost:3000",
};