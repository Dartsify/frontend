export const toFormUrlEncoded = (
  data: Record<string, string | number | boolean>,
) => {
  const params = new URLSearchParams();

  Object.entries(data).forEach(([key, value]) => {
    params.append(key, String(value));
  });

  return params.toString();
};

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
