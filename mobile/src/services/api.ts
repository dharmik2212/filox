import axios, { AxiosInstance } from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

class APIClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
    });

    // Add token to all requests if available
    this.client.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });
  }

  // Set token for authenticated requests
  setToken(token: string | null) {
    this.token = token;
  }

  // Auth endpoints
  async googleLogin(idToken: string) {
    const response = await this.client.post("/auth/google", {
      id_token: idToken,
    });
    return response.data;
  }

  async getCurrentUser() {
    const response = await this.client.get("/auth/me");
    return response.data;
  }

  async updateSemester(semester: string) {
    const response = await this.client.put("/auth/semester", { semester });
    return response.data;
  }

  // Files endpoints
  async uploadFile(
    filePath: string,
    fileName: string,
    semester: string,
    isCurrentSemester: boolean
  ) {
    const formData = new FormData();
    formData.append("file", {
      uri: filePath,
      type: "image/jpeg",
      name: fileName,
    });
    formData.append("semester_tag", semester);
    formData.append("is_current_semester", isCurrentSemester.toString());

    const response = await this.client.post("/files/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }

  async listFiles(semesterTag?: string) {
    const params = semesterTag ? { semester_tag: semesterTag } : {};
    const response = await this.client.get("/files/list", { params });
    return response.data;
  }

  // Classification endpoints
  async classifyFile(fileId: number) {
    const response = await this.client.post("/classify/single", {
      file_id: fileId,
    });
    return response.data;
  }

  async batchClassify(fileIds: number[]) {
    const response = await this.client.post("/classify/batch", {
      file_ids: fileIds,
    });
    return response.data;
  }

  // Duplicates endpoints
  async detectDuplicates(fileIds: number[], threshold: number = 0.85) {
    const response = await this.client.post("/duplicates/detect", {
      file_ids: fileIds,
      similarity_threshold: threshold,
    });
    return response.data;
  }
}

export const apiClient = new APIClient();
