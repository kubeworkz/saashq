import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
export function Dropdown(props: { title: any; children: any }) {
  return (
    <Menu as="div" className="relative">
      <div>
        <Menu.Button className="inline-flex duration-200 w-full justify-between gap-4 rounded-md px-2 py-1.5 hover:bg-white/20 text-sm font-normal text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
          {props.title}
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute min-w-max right-0 mt-2 rounded-md origin-top-right border border-white/20 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          {props.children}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

export function Item(props: { icon?: any; children: any }) {
  return (
    <Menu.Item>
      {({ active }) => (
        <button
          className={`${
            active ? "text-neutral-800" : "text-neutral-800"
          } group flex w-full items-center hover:bg-neutral-50 bg-white gap-2 rounded-md px-3 py-3 text-sm`}
        >
          {props.icon && <div className="text-neutral-800">{props.icon}</div>}
          <span>{props.children}</span>
        </button>
      )}
    </Menu.Item>
  );
}

Dropdown.Item = Item;

export default Dropdown;
