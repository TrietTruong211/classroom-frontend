import {createDataProvider, CreateDataProviderOptions} from "@refinedev/rest";
import { BACKEND_BASE_URL } from "@/constants";
import { ListResponse } from "@/types";
import { CreateResponse, HttpError, GetOneResponse } from "@refinedev/core";

if (!BACKEND_BASE_URL) {
  throw new Error("Missing required environment variable: VITE_BACKEND_BASE_URL");
}

const buildHttpError = async (response: Response): Promise<HttpError> => {
  let message = 'Request failed';

  try {
    const  payload = (await response.json()) as {message?: string};
    if (payload.message) {
      message = payload.message;
    }
  } catch {
    // Ignore error while parsing JSON, use default message
  }

  return {
    message,
    statusCode: response.status,
  };
}

const options: CreateDataProviderOptions = {
  getList: {
    getEndpoint: ({resource}) => resource,
    buildQueryParams: async ({ resource, pagination, filters}) => {
      const page = pagination?.currentPage ?? 1;
      const pageSize = pagination?.pageSize ?? 10;

      const params: Record<string, string|number> = {
        page,
        limit: pageSize,
      };

      filters?.forEach((filter) => {
        const field = 'field' in filter ? filter.field : '';
        const value = String(filter.value);

        if (resource === 'subjects') {
          if (field === 'department') params.department = value;
          if (field === 'name' || field === 'code') params.search = value;
        }

        if (resource === 'classes') {
          if (field === 'subject') params.subject = value;
          if (field === 'teacher') params.teacher = value;
          if (field === 'name') params.search = value;
        }

        if (resource === 'users' || resource.endsWith('/users')) {
          if (field === 'role') params.role = value;
          if (field === 'name' || field === 'email') params.search = value;
        }

        if (resource === 'departments') {
          if (field === 'name') params.search = value;
        }
      })
      return params;
    },
    mapResponse: async (response) => {
      if (!response.ok) throw await buildHttpError(response);
      const payload: ListResponse = await response.clone().json();
      return payload.data ?? []
    },
    getTotalCount: async (response) => {
      if (!response.ok) throw await buildHttpError(response);
      const payload: ListResponse = await response.clone().json();
      return payload.pagination?.total ?? 0;
    }
  },

  create: {
    getEndpoint: ({resource}) => resource,

    buildBodyParams: async ({ variables }) => variables,

    mapResponse: async (response) => {
      if (!response.ok) throw await buildHttpError(response);
      const json: CreateResponse = await response.json();
      return json.data ?? {};
    },
  },

  update: {
    getEndpoint: ({ resource, id }) => `${resource}/${id}`,

    buildBodyParams: async ({ variables }) => variables,

    mapResponse: async (response): Promise<Record<string, unknown>> => {
      if (!response.ok) throw await buildHttpError(response);
      const json = await response.json();
      if (json && typeof json === 'object' && 'data' in json) return json.data as Record<string, unknown>;
      return json as Record<string, unknown>;
    },
  },

  deleteOne: {
    getEndpoint: ({ resource, id }) => `${resource}/${id}`,

    mapResponse: async (response) => {
      if (!response.ok) throw await buildHttpError(response);
      return {};
    },
  },

  getOne: {
    getEndpoint: ({resource, id}) => `${resource}/${id}`,

    mapResponse: async (response) => {
      const json: GetOneResponse = await response.json()
      
      return json.data ?? []
    }
  }
}

export const { dataProvider, kyInstance } = createDataProvider(
  BACKEND_BASE_URL,
  options,
);