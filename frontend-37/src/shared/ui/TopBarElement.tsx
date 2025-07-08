import { HTMLAttributes, ReactNode } from "react";
import styles from "./TopBarElement.module.css";

interface TopBarElementProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function TopBarElement({ children, ...props }: TopBarElementProps) {
  return (
    <div className={styles.topbarElement} {...props}>
      {children}
    </div>
  );
}
