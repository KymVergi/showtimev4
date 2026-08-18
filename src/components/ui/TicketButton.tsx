import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

import styles from "./TicketButton.module.css";

type Variant = "primary" | "secondary" | "ghost";

interface CommonProps {
  children: ReactNode;
  variant?: Variant;
  size?: "default" | "small";
  block?: boolean;
  icon?: ReactNode;
  iconRight?: ReactNode;
  className?: string;
}

type ButtonProps = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type LinkProps = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

function classes({
  variant = "primary",
  size = "default",
  block,
  className,
}: CommonProps) {
  return [
    styles.btn,
    styles[variant],
    size === "small" ? styles.small : "",
    block ? styles.block : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

/** A ticket stub that happens to be a button. Renders an `<a>` when given `href`. */
export function TicketButton(props: ButtonProps | LinkProps) {
  const { children, icon, iconRight, variant, size, block, className, ...rest } =
    props as CommonProps & Record<string, unknown>;

  const content = (
    <>
      {icon && <span className={styles.icon}>{icon}</span>}
      <span>{children}</span>
      {iconRight && <span className={styles.icon}>{iconRight}</span>}
    </>
  );

  const cn = classes({ children, variant, size, block, className });

  if (typeof rest.href === "string") {
    return (
      <a className={cn} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={cn}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  );
}

export default TicketButton;
