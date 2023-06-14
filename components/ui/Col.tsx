export function Col({ children, classes }: { children: any, classes?: string}){
    return (
        <div className={"flex flex-col "+classes}>
            {children}
        </div>
    )
}