import classNames from "classnames";
import { Loader2 } from "tabler-icons-react";

export default function Card(props: { children: any; classes?: string; loading?: boolean; }) {

  if(props.loading){
    return (
      <div className="bg-white animate-pulse p-6 rounded-md grid place-items-center">
        <div className="text-gray-400">
          <Loader2 className="animate-spin" />
        </div>
      </div>
    )
  }
  return (
    <div
      className={classNames(
        "rounded-md bg-white p-6 ",
        props.classes
      )}
    >
      {props.children}
    </div>
  );
}