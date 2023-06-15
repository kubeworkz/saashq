
export function Description(props: {
  title: string;
  description: any;
}) {
  return (
    <div className="flex flex-col items-start gap-0">
      <p className="text-neutral-600 text-sm uppercase tracking-wide">{props.title}</p>
      <p className="text-sm text-white">{props.description}</p>
    </div>
  );
}

export default Description;
