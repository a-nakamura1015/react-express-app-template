import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const getUsers = async () => {
  const response = await axios.get(`${API_URL}/users`);
  return response.data;
};

export const getPosts = async () => {
  const response = await axios.get(`${API_URL}/posts`);
  return response.data;
};

export const addPost = async (postData: { userId: number; title: string; content: string }) => {
  const response = await axios.post(`${API_URL}/posts`, postData);
  return response.data;
};
