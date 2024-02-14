import ax from "axios";

// const axios = new Axios({
//   baseURL: "http://localhost:3000/",
// });

const axios = ax.create({
  baseURL: "http://localhost:3000/",
});

export const deployProject = () => {
  return axios.post("/deploy");
};

export const getStatus = (id) => {
  return axios.get(`/status?id=${id}`);
};
