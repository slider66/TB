import clsxFn from "clsx";

import type { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from "react";

type ButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

type CallToActionProps =
  | ({
      as: "button";
      children: ReactNode;
      variant?: "primary" | "secondary" | "ghost";
    } & ButtonProps)
  | {
      as?: "link";
      children: ReactNode;
      href: string;
      variant?: "primary" | "secondary" | "ghost";
    };

const baseClass =
  "inline-flex items-center justify-center rounded-[12px] font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-tb-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<NonNullable<CallToActionProps["variant"]>, string> = {
  primary:
    "bg-tb-primary text-white shadow-button hover:bg-tb-primaryHover active:bg-tb-primaryActive h-[var(--tb-btn-md)] px-6",
  secondary:
    "border-2 border-tb-primary bg-white text-tb-primary hover:bg-tb-primary/10 active:bg-tb-primary/15 h-[var(--tb-btn-md)] px-6",
  ghost:
    "text-tb-text-base hover:text-tb-primary hover:bg-tb-primary/10 active:bg-tb-primary/15 h-[var(--tb-btn-md)] px-4",
};

const CallToAction = (props: CallToActionProps) => {
  const variant = props.variant ?? "primary";

  if (props.as === "button") {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { variant: _unusedVariant, className, ...buttonProps } = props;
    return (
      <button
        {...buttonProps}
        className={clsxFn(baseClass, variants[variant], className)}
      />
    );
  }

  const { children, href } = props;
  return (
    <a href={href} className={clsxFn(baseClass, variants[variant])}>
      {children}
    </a>
  );
};

export default CallToAction;


