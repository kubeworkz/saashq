import classNames from "classnames";
import { Loader2 } from "tabler-icons-react";

export function Button(props: {
  size?: string;
  variant?: string;
  children: any;
  onClick?: any;
  ghost?: boolean;
  loading?: boolean;
  disabled?: boolean;
  classes?: string;
}) {
  return (
    <button
      onClick={props.onClick}
      disabled={props.disabled}
      className={classNames(
        "flex gap-2 rounded-md font-medium items-center font-normal duration-200 ", props.classes,
        { "text-sm px-[.8rem] py-[.4rem]  ": props.size == "sm" || !props.size },
        { "text-base px-[1rem] py-[.5rem]  ": props.size == "md" },
        { "text-lg px-[1rem] py-[.5rem]  ": props.size == "lg" },
        { "text-xs px-[.7rem] py-[.3rem]  ": props.size == "xs" },
        {
          "border  text-neutral-600 border-neutral-200 hover:border-neutral-300  ":
            props.variant == "default" || !props.variant,
        },
        {
          "border border-transparent bg-blue-600/20 text-blue-600 hover:border-blue-600/50":
            props.variant == "success",
        },
        {
          "border border-transparent bg-amber-600/20 text-amber-600 hover:border-amber-600/50":
            props.variant == "warning",
        },
        {
          "border border-transparent bg-neutral-900 text-white hover:opacity-90":
            props.variant == "info" && !props.ghost,
        },
        {
          "border border-transparent bg-white text-white hover:bg-black hover:border-white":
            props.variant == "info" && props.ghost,
        },
        {
          "border border-transparent bg-rose-600/20 text-rose-600 hover:border-rose-600/50":
            props.variant == "error",
        },
        {
          "border-none shadow-none font-medium hover:border-transparent hover:opacity-80": props.ghost
        },
        {
          "opacity-60 cursor-wait": props.loading && !props.ghost
        },
        {
          "opacity-60 cursor-not-allowed": props.disabled && !props.ghost
        },
        {
          "border-none text-neutral-500 cursor-wait hover:border-none": props.loading && props.ghost
        },
        {
          "border-none text-neutral-500 cursor-not-allowed hover:border-none opacity-80": props.disabled && props.ghost
        }
      )}
    >
      {props.loading && <div className="animate-spin z-0"><Loader2 size={18} /></div>}
      {props.children}
    </button>
  );
}

export default Button;
