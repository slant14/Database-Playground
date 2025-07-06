import dashboardImg from "../assets/people.png";
import humansImg from "../assets/humans.jpg";
import assignmentsImg from "../assets/taska.jpg";
import humanWithDeskImg from "../assets/rectangleAndHuman.jpg";
import styles from "./Dashboard.module.css";
import { MainBar } from "../components/MainBar";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { API_URL } from "../const";

export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      if (!localStorage.getItem("session_id")) {
        const res = await fetch(API_URL + "/session", {
          credentials: "include",
        });
        const { session_id } = await res.json();
        localStorage.setItem("session_id", session_id);
      } else {
        const res = await fetch(API_URL + "/session/valid", {
          credentials: "include",
        });
        const { valid } = await res.json();
        console.log(valid);
        if (!valid) {
          localStorage.removeItem("session_id");
          run();
        }
      }
    };

    run();
  }, []);

  const onClick = async () => {
    await fetch(
      `${API_URL}/session/info/?session_id=${localStorage.getItem("session_id")}`,
      {
        credentials: "include",
      }
    );
    navigate("/template");
  };

  return (
    <div>
      <MainBar onClick={onClick} con />
      <div className={styles.mainDiv}>
        <div>
          <h1 className={styles.bigTitle}>Learn databases</h1>
          <p className={styles.description}>
            Complete assignments, experiment in playground and become expert!
          </p>
        </div>
        <img
          className={styles.dashboardImg}
          src={dashboardImg}
          alt="dashboard image"
        />
      </div>
      <div className={styles.rectangleContainer}>
        <div className={styles.rectangle}>
          <img className={styles.peopleImg} src={humansImg} alt="Humans" />
          <div>
            <p className={styles.pAboutClassrooms}>Create classrooms</p>
            <p className={styles.pAboutAdding}>And add students</p>
          </div>
        </div>
        <div className={styles.rectangle}>
          <img
            className={styles.assignmentsImg}
            src={assignmentsImg}
            alt="Assignments"
          />
          <div>
            <p className={styles.pAboutClassrooms}>Automatic grading</p>
            <p className={styles.pAboutAdding}>For assignments</p>
          </div>
        </div>
        <div className={styles.rectangle}>
          <img
            className={styles.humanWithDeskImg}
            src={humanWithDeskImg}
            alt="HumanWithDesk"
          />
          <div>
            <p className={styles.pAboutClassrooms}>Add TA's</p>
            <p className={styles.pAboutAdding}>To help you manage classrooms</p>
          </div>
        </div>
      </div>
    </div>
  );
}
