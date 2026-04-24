const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

export const env = {
  apiBaseUrl: baseUrl?.replace(/\/+$/, "") ?? "",
};
