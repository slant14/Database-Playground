import styles from "./TopBarElement.module.css";

export function TopBarElement({children, ...props}){
    return <div className={styles.topbarElement} {...props}>
        {children}
    </div>;
}