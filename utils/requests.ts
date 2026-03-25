// Utility function to convert a data object into a URL-encoded string for form submissions
export const toFormUrlEncoded = (
  data: Record<string, string | number | boolean>,
) => {
  const params = new URLSearchParams();

  Object.entries(data).forEach(([key, value]) => {
    params.append(key, String(value));
  });

  return params.toString();
};

// Utility function to build the full API URL based on the provided path and the base URL from environment variables
export const buildApiUrl = (path: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.trim();

  if (!baseUrl) {
    throw new Error("BASE_URL is not defined");
  }

  const normalizedBaseUrl = /^https?:\/\//i.test(baseUrl)
    ? baseUrl
    : `http://${baseUrl}`;

  return new URL(path, normalizedBaseUrl).toString();
};

// Utility function to check if an error matches the FieldError type
//  -> important for preventing runtime errors when trying to access properties of an error that doesn't match the expected structure
export const testIfErrorMatchesFieldErrorType = (error: any) => {
  return (
    error[0] &&
    typeof error[0] === "object" &&
    error[0].message &&
    error[0].field &&
    error[0].value
  );
};
