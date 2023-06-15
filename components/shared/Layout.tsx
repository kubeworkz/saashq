export default function Layout(props: { children: React.ReactNode }) {
  return <div className="m-auto max-w-6xl px-4 sm:px-6">{props.children}</div>;
}

function Page (props: { children: React.ReactNode}){
    return (
        <>
            {props.children}
        </>
    )
}

Layout.Page = Page;