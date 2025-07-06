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
      throw new Error(`${errorData.detail || errorData.error || 'Unknown error'}`);
    }
    
    return res.json();
  } catch (error) {
    console.error('PostgreSQL API Error:', error);
    throw error;
  }
}

export async function registerUser(name=null, email=null, password, role = "student") {
  const res = await fetch(`${BASE_URL}/app/users/register/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password, role }),
  });
  return res.json();
}

export async function loginUser(name=null, password, role = "student") {
  const res = await fetch(`${BASE_URL}/app/users/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, password, role }),
  });
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

export async function getMyClassroomClassmates(id) {
  //const token = getCookie("access");
  const res = await tokenUpdate(`${BASE_URL}/app/classrooms/students/?classroom_id=${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      //'Authorization': token ? `JWT ${token}` : undefined,
    },
  });
  if (!res.ok) throw new Error("API call failed");
  return res.json();
}

export async function getMyAssignments() {
  const res = await tokenUpdate(`${BASE_URL}/app/assignments/my/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw new Error("API call failed");
  return res.json();
}

export async function getCourseAssignments(id) {
  const res = await tokenUpdate(`${BASE_URL}/app/assignments/by_course/?course_id=${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getMySubmissions() {
  const res = await tokenUpdate(`${BASE_URL}/app/assignments/submitted/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw new Error("API call failed");
  return res.json();
}

async function tokenUpdate(url, options = {}) {
  console.log("tokenUpdate called, url:", url);
  let token = getCookie("access");
  options.headers = {
    ...options.headers,
    'Authorization': token ? `JWT ${token}` : undefined,
    'Content-Type': 'application/json',
  };
  let res = await fetch(url, options);

  if (res.status === 401 || res.status === 403) {
    const refresh = getCookie("refresh");
    console.log("401/403 detected. Refresh token:", refresh);
    if (refresh) {
      const refreshRes = await fetch(`${BASE_URL}/api/token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh }),
      });
      console.log("Refresh response status:", refreshRes.status);
      if (refreshRes.ok) {
        const data = await refreshRes.json();
        document.cookie = `access=${data.access}; path=/;`;
        options.headers['Authorization'] = `JWT ${data.access}`;
        res = await fetch(url, options);
        console.log("Retried request with new access token, status:", res.status);
        console.log("New access token:", data.access);
        console.log("Access token before:", token);
        console.log("Refresh token:", refresh);
        console.log("Refresh response:", refreshRes);
        console.log("New access token:", data.access);
      } else {
        document.cookie = "access=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        document.cookie = "refresh=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        //window.location.href = "/";
        console.log("Refresh failed, redirecting to /");
        return;
      }
    } else {
      console.log("No refresh token found, cannot refresh.");
      return res;
    } 
  } else {
    console.log("Access token before:", token);
  }

  return res;
}