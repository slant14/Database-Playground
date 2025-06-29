import { act } from "react";

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