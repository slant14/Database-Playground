import styles from "./TopBar.module.css";

export function TopBar({children, contentStyle, ...props}){
    return <div className={styles.topbar} {...props}>
        <div className={styles["topbar-title"]}>
            <p><a href="/">Database Playground</a></p>
        </div>
        <div className={styles["topbar-content"]} style={contentStyle}>
            {children}
        </div>
    </div>;
}