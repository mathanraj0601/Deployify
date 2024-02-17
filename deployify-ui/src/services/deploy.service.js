import ax from "axios";

// const axios = new Axios({
//   baseURL: "http://localhost:3000/",
// });

const axios = ax.create({
  baseURL: "http://localhost:3000",
});

export const deployProject = (gitHUbURl) => {
  return axios.post("/deploy", {
    repoUrl: gitHUbURl,
  });
};

export async function getStatus(id) {
  const res = await axios.get(`/status?id=${id}`);
  console.log(res);
  return res;
}
