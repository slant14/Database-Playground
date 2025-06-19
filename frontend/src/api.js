const BASE_URL = process.env.REACT_APP_API_URL || "";

export async function getHello() {
  const res = await fetch(`${BASE_URL}/api/hello/`);
  if (!res.ok) throw new Error("API call failed");
  return res.json();
}

export async function getCode(text) {
  const res = await fetch(`${BASE_URL}/api/chroma_query/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code: text }),
  });
  if (!res.ok) throw new Error("API call failed");
  return res.json();
}