import { Switch } from "@headlessui/react";

export function Toggle(props: {
  checked: boolean;
  onChange: any;
}) {
  return (
    <Switch
      checked={props.checked}
      onChange={props.onChange}
      className={`${props.checked ? "bg-emerald-600" : "bg-rose-600"}
          relative inline-flex h-[32px] w-[66px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
    >
      <span className="sr-only">Toggle</span>
      <span
        aria-hidden="true"
        className={`${props.checked ? "translate-x-9" : "translate-x-0"}
            pointer-events-none inline-block h-[28px] w-[28px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
      />
    </Switch>
  );
}
