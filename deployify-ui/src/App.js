import "./App.css";
import { useState } from "react";
import { deployProject, getStatus } from "./services/deploy.service";

function App() {
  const [deployStatus, setDeployStatus] = useState("");
  const [id, setId] = useState("");
  const [loading, setLoading] = useState("");
  const [githubUrl, setGithubURl] = useState("");

  const handleReset = () => {
    setId("");
    setDeployStatus("");
  };
  const handleSubmit = async () => {
    try {
      const res = await deployProject(githubUrl);
      console.log("called deploy project" + githubUrl);
      setId(res.data.data.id);
      setDeployStatus(res.data.data.status);
      setLoading(true);
      console.log(res);
      await getDeployStatus(res.data.data.id);
    } catch (err) {
      alert("Backend not working");
    }
  };

  const getDeployStatus = async (id) => {
    const intervalId = setInterval(async () => {
      try {
        console.log("getting deploy status");

        const res = await getStatus(id);

        console.log(res);
        if (res.data.data.status === "deployed") {
          setLoading(false);
          setDeployStatus("deployed");
          clearInterval(intervalId);
        }
      } catch (err) {
        console.log(err);
      }
    }, 3000);
  };

  return (
    <div className="App">
      <div className="app-container">
        <div className="input-header">
          <h2>Deployify</h2>
          Effortless React Deployments Inspired by Vercel, Deployify streamlines
          React app deployment. Simply connect your GitHub repo for automatic
          deployments and a user-friendly experience. Deployify - Your shortcut
          to hassle-free React deployments! 🚀
        </div>
        <div className="input-box">
          {(deployStatus === "" || deployStatus === "uploaded") && (
            <>
              <label> Enter you Github URl</label>
              <input
                type="text"
                placeholder="https://github.com/your-username/your-repository.git"
                onChange={(e) => setGithubURl(e.target.value)}
              />
            </>
          )}
        </div>
        <div className="input-btn">
          {(deployStatus === "" || deployStatus === "uploaded") && (
            <button disabled={id !== ""} onClick={handleSubmit}>
              Deploy {id}
            </button>
          )}
          {deployStatus === "deployed" && (
            <div className="link-box">
              <div className="link"> {`http://${id}.deployify.com`}</div>
              <a
                className="link-btn"
                href={`http://${id}.deployify.com`}
                rel="noopener noreferrer"
                target="_blank"
              >
                Visit site
              </a>
              <button className="reset-btn" onClick={handleReset}>
                Deploy new Project
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
