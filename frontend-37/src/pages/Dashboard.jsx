import dashboardImg from '../assets/dashboardImg.png';
import humansImg from "../assets/humans.jpg";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
    return (
        <div>
            <div className={styles.mainDiv}>
                <div>
                    <h1 className={styles.bigTitle}>Interactive databases exercises</h1>
                    <p className={styles.description}>Improve your skills in managing databases!</p>
                </div>
                <img className={styles.dashboardImg} src={dashboardImg} alt="dashboard image" />
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