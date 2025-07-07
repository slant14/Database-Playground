import styles from "./RunButton.module.css";
import triangleJpg from "../../../assets/triangle.jpg";

export function RunButton({ handleClick }) {
  return (
    <>
      <button className={styles.runButton} onClick={handleClick}>
        <img src={triangleJpg} />
        <p>run</p>
      </button>
    </>
  );
}
