import classNames from "classnames";

export function Badge(props: {
  size?: string;
  variant?: string;
  children: any;
}) {
  return (
    <div
      className={classNames(
        "flex gap-1 rounded-lg px-[.5rem] py-[.2rem] ",
        { "text-sm": props.size == "sm" || !props.size },
        { "text-base": props.size == "md" },
        { "text-lg": props.size == "lg" },
        { "text-xs": props.size == "xs" },
        {
          "bg-neutral-600/20 text-neutral-600":
            props.variant == "default" || !props.variant,
        },
        { "bg-emerald-600/20 text-emerald-600": props.variant == "success" },
        { "bg-amber-600/20 text-amber-600": props.variant == "warning" },
        { "bg-slate-100 text-black": props.variant == "info" },
        { "bg-rose-600/20 text-rose-600": props.variant == "error" },
      )}
    >
      {props.children}
    </div>
  );
}

export default Badge;
