import styles from './Button.module.scss';

interface ButtonProps {
  title: string;
  className?: string;
  onClick?: () => void;
  handleLoginClick?: () => void;
}

export default function Button({ title, className, onClick, handleLoginClick }: ButtonProps) {
  const buttonClasses = `${styles.btn} ${className}`;

  return (
    <div className={buttonClasses}  onClick={handleLoginClick}>
      {title}
    </div>
  );
}
