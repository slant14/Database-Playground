import styles from "./RunButton.module.css";
import triangleJpg from "../assets/triangle.jpg";

function handleClick() {
    console.log("salam bro")
}

export default function RunButton() {
    return (
        <>
            <button className={styles.runButton} onClick={handleClick}>
                <img src={triangleJpg} /><p>run</p>
            </button>
        </>
    )
}