import { act } from "react";
import { getCookie } from './utils';

const BASE_URL = process.env.REACT_APP_API_URL || "";

export async function getChromaResponse(text, id) {
  const res = await fetch(`${BASE_URL}/db/chroma/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code: text, user_id: id, action: 'execute' }),
  });
  if (!res.ok) {
    return "Error";
  };
  return res.json();
}

export async function getChromaInitialState(id) {
  const res = await fetch(`${BASE_URL}/db/chroma/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_id: id, action: 'state' }),
  });
  if (!res.ok) throw new Error("API call failed");
  return res.json();
}

export async function getPostgresTable(id) {
  const res = await fetch(`${BASE_URL}/db/schema/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_id: id }),
  });
  if (!res.ok) throw new Error("API call failed");
  return res.json();
}

export async function createPostgresTable(id) {
  const res = await fetch(`${BASE_URL}/db/put/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_id: id }),
  });
  if (!res.ok) throw new Error("API call failed");
  return res.json();

}

export async function queryPostgres(text, id) {
  try {
    const res = await fetch(`${BASE_URL}/db/query/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: id, code: text }),
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(`API call failed (${res.status}): ${errorData.detail || errorData.error || 'Unknown error'}`);
    }
    
    return res.json();
  } catch (error) {
    console.error('PostgreSQL API Error:', error);
    throw error;
  }
}

export async function registerUser(name=null, email=null, password, role = "student") {
  const res = await fetch(`${BASE_URL}/app/users/login_or_register/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password, role }),
  });
  if (!res.ok) throw new Error("API call failed");
  return res.json();
}

export async function getMyClassroms() {
  //const token = getCookie("access");
  const res = await tokenUpdate(`${BASE_URL}/app/classrooms/my/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      //'Authorization': token ? `JWT ${token}` : undefined,
    },
  });
  if (!res.ok) throw new Error("API call failed");
  return res.json();
}

async function tokenUpdate(url, options = {}) {
  let token = getCookie("access");
  options.headers = {
    ...options.headers,
    'Authorization': token ? `JWT ${token}` : undefined,
    'Content-Type': 'application/json',
  };
  let res = await fetch(url, options);

  if (res.status === 401 || res.status === 403) {
    const refresh = getCookie("refresh");
    if (refresh) {
      const refreshRes = await fetch(`${BASE_URL}/api/token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh }),
      });
      if (refreshRes.ok) {
        const data = await refreshRes.json();
        document.cookie = `access=${data.access}; path=/;`;
        options.headers['Authorization'] = `JWT ${data.access}`;
        res = await fetch(url, options);
      } else {
        document.cookie = "access=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        document.cookie = "refresh=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        window.location.href = "/";
        return;
      }
    }
  }
  return res;
}