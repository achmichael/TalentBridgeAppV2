const fetcher = async (url: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(url, options);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || result.error || "An error occurred");
    }

    return { data: result.data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message || "Fetch failed" };
  }
};

const poster = async (url: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      body: JSON.stringify(options.body || {}),
      ...options
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || result.error || "An error occurred");
    }

    return { data: result.data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message || "Post failed" };
  }
}
export { fetcher, poster };
