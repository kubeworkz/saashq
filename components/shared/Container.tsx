import classNames from "classnames";

export function Container(props: {
  children: any;
  classes?: string;
  row?: boolean;
  col?: boolean;
}) {
  return (
    <div
      className={classNames(
        "m-auto max-w-5xl px-4 lg:px-6",
        props.classes,
        { "flex flex-row": props.row },
        { "flex flex-col": props.col },

      )}
    >
      {props.children}
    </div>
  );
}

export default Container;
