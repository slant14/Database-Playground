import { act } from "react";
import { getCookie, deleteCookie } from './utils';

const BASE_URL = process.env.REACT_APP_API_URL || "";

export async function getChromaResponse(text) {
  const res = await tokenUpdate(`${BASE_URL}/db/chroma/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code: text, action: 'execute' }),
  });
  if (!res.ok) {
    return "Error";
  };
  return res.json();
}

export async function getChromaInitialState() {
  const res = await tokenUpdate(`${BASE_URL}/db/chroma/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ action: 'state' }),
  });
  if (!res.ok) throw new Error("API call failed");
  return res.json();
}

export async function getPostgresTable() {
  const res = await tokenUpdate(`${BASE_URL}/db/schema/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({type: "PSQL"}),
  });
  if (!res.ok) throw new Error("API call failed");
  return res.json();
}

// "dump": ""
export async function createPostgresTable(payload = {}) {
  const res = await tokenUpdate(`${BASE_URL}/db/put/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({...payload, type: "PSQL"}),
  });
  if (!res.ok) throw new Error("API call failed");
  return res.json();
}

export async function queryPostgres(text) {
  try {
    const res = await tokenUpdate(`${BASE_URL}/db/query/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code: text, type: "PSQL" }),
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

export async function createMongoCollections() {
  const res = await tokenUpdate(`${BASE_URL}/db/put/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({type: "MGDB"}),
  });
  if (!res.ok) throw new Error("API call failed");
  return res.json();
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

export async function getMyProfile() {

  const res = await tokenUpdate(`${BASE_URL}/app/profile/me/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw new Error("API call failed");
  return res.json();
}

export async function editInfo(name, email, school=null) {
  const res = await tokenUpdate(`${BASE_URL}/app/profile/edit/info/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, school }),
  });
  return res.json();
}

export async function editAvatar(avatar) {
  const res = await tokenUpdate(`${BASE_URL}/app/profile/edit/avatar/`, {
    method: 'PUT',
    headers: {
    },
    body: (() => {
      const formData = new FormData();
      formData.append('avatar', avatar);
      return formData;
    })(),
  });
  return res.json();
}

export async function getMyClassrooms() {
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


export async function getMyClassroomArticles(id) {
  const res = await tokenUpdate(`${BASE_URL}/app/classrooms/articles/?classroom_id=${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw new Error("API call failed");
  return res.json();
}


export async function getClassroomMyAssignments(id) {
  const res = await tokenUpdate(`${BASE_URL}/app/assignments/my/classroom/?classroom_id=${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getArticlesNotInClass(id) {
  const res = await tokenUpdate(`${BASE_URL}/app/articles/all/?classroom_id=${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw new Error("API call failed");
  return res.json();
}


export async function createClassroom(title, description, TA, students, primary_instructor) {
  const res = await tokenUpdate(`${BASE_URL}/app/classrooms/create/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, description, TA, students, primary_instructor })  
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function createAssignment(title, description, open_at, close_at, classroom_id) {
  const localopen = new Date(open_at);
  const localclose = new Date(close_at);
  const utcopen = localopen.toISOString();
  const utcclose = localclose.toISOString();
  const res = await tokenUpdate(`${BASE_URL}/app/assignments/create/?classroom_id=${classroom_id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, description, open_at: utcopen, close_at: utcclose })  
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function createArticle(title, authors, description, classroom_id) {
  const res = await tokenUpdate(`${BASE_URL}/app/articles/create/?classroom_id=${classroom_id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, authors, description })  
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getProfiles() {
  const res = await tokenUpdate(`${BASE_URL}/app/profile/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw new Error("API call failed");
  return res.json();
}

export async function getTemplateList() {
  const res = await tokenUpdate(`${BASE_URL}/template/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw new Error("API call failed");
  return res.json();
}

export async function getMyRoleInClassroom(id) {
  const res = await tokenUpdate(`${BASE_URL}/app/classroom/my/role/?classroom_id=${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function setTemplate(name, author, type) {
  const res = await tokenUpdate(`${BASE_URL}/template/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({name: name, author: author, type: type, dump: "CREATE TABLE users ( id SERIAL PRIMARY KEY, name VARCHAR(100) NOT NULL, email VARCHAR(255) UNIQUE NOT NULL);" }),
  });
  if (!res.ok) throw new Error("API call failed");
  return res.json();
}

export async function deleteTemplate(id) {
  const res = await tokenUpdate(`${BASE_URL}/template/${id}/delete/`, {
    method: 'DELETE',
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
        deleteCookie("access");
        deleteCookie("refresh");
        window.dispatchEvent(new CustomEvent('logout', { detail: 'Token refresh failed' }));
        console.log("Refresh failed, logout event dispatched");
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

