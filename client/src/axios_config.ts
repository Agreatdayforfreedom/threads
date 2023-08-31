export const getAxiosConfig = () => {
  const token = localStorage.getItem("access_token");
  if (!token) return undefined;
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  return config;
};
