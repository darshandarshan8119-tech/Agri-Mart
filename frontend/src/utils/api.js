const API_BASE = 'http://127.0.0.1:8000/api';

/**
 * Generic fetch wrapper for Django REST Framework API
 */
export async function apiRequest(endpoint, method = 'GET', data = null, isFormData = false) {
  const url = `${API_BASE}${endpoint}`;
  const options = { method };

  if (data) {
    if (isFormData) {
      options.body = data;
    } else {
      options.headers = { 'Content-Type': 'application/json' };
      options.body = JSON.stringify(data);
    }
  }

  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Server error (${res.status})`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`[API] Could not connect to Django backend at ${url}:`, err.message);
    throw err;
  }
}
