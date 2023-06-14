export default function Feature({
  icon,
  message,
  desc,
}: {
  icon: any;
  message: any;
  desc: any;
}) {
  return (
    <div className="m-2 flex max-w-sm flex-row p-5 items-start">
      <div className="custom-box-shadow w-fit items-center justify-center rounded bg-transparent p-3">
        {icon}
      </div>
      <div className="ml-5">
        <p className="text-gray-600 text-md font-bold">{message}</p>
        <p className="text-gray-400 max-w-xs font-sm">{desc}</p>
      </div>
    </div>
  );
}
