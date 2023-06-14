import classNames from "classnames";

export function Select(props: { children: any; onChange: any; label?: any }) {
  return (
    <div className="flex flex-col gap-2">
      {props.label && (
        <div className="text-sm font-medium text-neutral-800">
          {props.label}
        </div>
      )}
      <select
        onChange={(e) => props.onChange(e.target.value)}
        className={classNames(
          "hover:border-neutral-60 w-full border border-neutral-200 bg-transparent py-[.3rem] text-sm text-gray-600 text-neutral-800 outline-none placeholder:font-normal placeholder:text-neutral-400",
          {
            "rounded-md border border-white/20 px-[1rem] ": true,
          }
        )}
      >
        {props.children}
      </select>
    </div>
  );
}

function Option(props: { value: any; children: any }) {
  return <option value={props.value}>{props.children}</option>;
}

Select.Option = Option;

export default Select;
