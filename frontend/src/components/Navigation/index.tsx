import styles from "./Navigation.module.scss";

interface NavigationProps {
  title: string;
}

export default function Navigation({title}: NavigationProps) {
  return (
    <div className={styles.nav}>
      {title}
    </div>
  );
}