import { Check } from "tabler-icons-react";

export function Checkbox(props: {
  checked: boolean;
  toggleChecked: any;
  children: any;
}) {
  return (
    <div className="flex flex-row items-start gap-2 duration-200">
      {props.checked ? (
        <div
          onClick={props.toggleChecked}
          className="h-5 w-5 cursor-pointer rounded-md border border-white/20 bg-white"
        >
            <Check size={16} />
            </div>
      ) : (
        <div
          onClick={props.toggleChecked}
          className="h-5 w-5 cursor-pointer rounded-md border border-white/20 hover:border-white-50"
        />
      )}
      <p className="text-sm text-white">{props.children}</p>
    </div>
  );
}

export default Checkbox;
