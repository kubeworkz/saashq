export function Progress({
    label,
    width,
    color,
    labelClasses,
    leftContent
}: {
    label?: string;
    width: number;
    color: string;
    labelClasses?: string
    leftContent?: any
}) {
    return (
        <div className="flex flex-col w-full">
            {
                label && (
                    <div className="flex flex-row justify-between">
                        <div className={"mb-1 text-base font-medium text-" + color + "-500 " + labelClasses}>
                            {label}
                        </div>
                        <span className="text-sm font-medium text-gray-700 ml-4">{leftContent}</span>
                    </div>
                )
            }

            <div className={"mb-4 h-2.5 w-full bg-gray-200"}>
                <div
                    className={"h-2.5 bg-" + color + "-500"}
                    style={{ width: (width > 100 ? 100 : width) + "%" }}
                ></div>
            </div>
        </div>
    );
}
