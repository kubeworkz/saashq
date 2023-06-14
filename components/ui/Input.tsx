import classNames from "classnames";

export function Input(props: {
  onChange?: any;
  suffix?: any;
  value?: string;
  placeholder?: string;
  label?: any;
}) {
  return (
    <div className="flex flex-col gap-2">
      {props.label && (
        <div className="text-sm font-medium text-neutral-800">
          {props.label}
        </div>
      )}
      <div className="flex items-center rounded-md bg-transparent text-sm text-neutral-800 duration-200 placeholder:text-neutral-600 hover:shadow">
        {props.suffix && (
          <div
            className={classNames(
              "grid h-10 w-10 text-white place-items-center bg-neutral-800",
              {
                "rounded-bl-md rounded-tl-md": props.suffix,
              },
              {
                "rounded-bl-md rounded-tr-md border": !props.suffix,
              }
            )}
          >
            {props.suffix}
          </div>
        )}
        <input
          placeholder={props.placeholder ?? ""}
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          className={classNames(
            "hover:border-neutral-60 w-full border border-neutral-200 bg-transparent py-[.3rem] text-neutral-800 outline-none placeholder:text-neutral-400 placeholder:font-normal",
            {
              "rounded-md border border-white/20 px-[1rem] ": !props.suffix,
              "rounded-br-md rounded-tr-md border-y border-r border-white/20 px-[.5rem]  ":
                props.suffix,
            }
          )}
        />
      </div>
    </div>
  );
}

export default Input;
