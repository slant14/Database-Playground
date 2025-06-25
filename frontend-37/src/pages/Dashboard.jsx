import dashboardImg from "../assets/people.png";
import humansImg from "../assets/humans.jpg";
import styles from "./Dashboard.module.css";
import { MainBar } from "../components/MainBar";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      console.log(localStorage.getItem("session_id"), "!!!!");
      if (!localStorage.getItem("session_id")) {
        const res = await fetch("https://api.dbpg.ru/session", {
          credentials: "include",
        });
        const { session_id } = await res.json();
        localStorage.setItem("session_id", session_id);
        console.log(session_id);
      } else {
        console.log(localStorage.getItem("session_id"));
      }
    };

    run();
  }, []);

  const onClick = async () => {
    const res = await fetch(
      `https://api.dbpg.ru/session/info/?session_id=${localStorage.getItem("session_id")}`,
      {
        credentials: "include",
      },
    );
    const json = await res.json();
    if (json.template) {
      navigate("/playground");
    } else {
      navigate("/template");
    }
  };

  return (
    <div>
      <MainBar onClick={onClick} />
      <div className={styles.mainDiv}>
        <div>
          <h1 className={styles.bigTitle}>Interactive databases exercises</h1>
          <p className={styles.description}>
            Improve your skills in managing databases!
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
          <img src={humansImg} alt="Humans" />
          <div>
            <p className={styles.pAboutClassrooms}>Create classrooms</p>
            <p className={styles.pAboutAdding}>And add students</p>
          </div>
        </div>
        <div className={styles.rectangle}>
          <img src={humansImg} alt="Humans" />
          <div>
            <p className={styles.pAboutClassrooms}>Create classrooms</p>
            <p className={styles.pAboutAdding}>And add students</p>
          </div>
        </div>
        <div className={styles.rectangle}>
          <img src={humansImg} alt="Humans" />
          <div>
            <p className={styles.pAboutClassrooms}>Create classrooms</p>
            <p className={styles.pAboutAdding}>And add students</p>
          </div>
        </div>
      </div>
    </div>
  );
}
