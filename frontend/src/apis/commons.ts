/**
 * @typedef {object} Pagination
 * @property {number} page
 * @property {number} perPage
 */

import axios from "axios";
import type { AxiosResponse } from "axios";

// Types
interface Pagination {
  page: number;
  perPage: number;
}

interface UploadImageResponse {
  url: string;
  filename: string;
  [key: string]: any;
}

interface UploadDocumentsResponse {
  files: string[];
  [key: string]: any;
}

// TODO put into env
const API_URL: string = "http://localhost:5000";

const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: API_URL + "/api",
});

function uploadImage(image: File): Promise<AxiosResponse<UploadImageResponse>> {
  const formData = new FormData();
  formData.append("file", image);
  return axiosInstance.post("/image", formData);
}

function uploadDocuments(data: FormData): Promise<AxiosResponse<UploadDocumentsResponse>> {
  return axiosInstance.post("/auth/file", data);
}

export { 
  API_URL, 
  axiosInstance, 
  uploadImage, 
  uploadDocuments 
};

// Export types for use in other files
export type {
  Pagination,
  UploadImageResponse,
  UploadDocumentsResponse,
};
