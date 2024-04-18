"use client";
import axios from "axios";

export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  let data = null,
    error = null;

  try {
    const result = await axios.post(`/api/auth`, { id: email, password });
    data = result.data;
    if (typeof window !== "undefined") {
      console.log('setting authorization', data);
      axios.defaults.headers.common["Authorization"] = data.token;
      localStorage.setItem("user", JSON.stringify(data.data));
      localStorage.setItem('token', data.token)
    }
  } catch (e) {
    error = e;
  }
  return { data, error };
}
