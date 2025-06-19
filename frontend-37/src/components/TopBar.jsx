import { NavLink } from "react-router";
import styles from "./TopBar.module.css";

export function TopBar({ children, contentStyle, ...props }) {
  return (
    <div className={styles.topbar} {...props}>
      <div className={styles["topbar-title"]}>
        <p>
          <NavLink to="/" end>
            Database Playground
          </NavLink>
        </p>
      </div>
      <div className={styles["topbar-content"]} style={contentStyle}>
        {children}
      </div>
    </div>
  );
}

