export default function InfoCard({ title, description }: any) {
    return (
        <div
            className="px-6 py-8 z-20 hover:bg-neutral-200/30"
        >
            <h2 className={`mb-3 text-2xl font-semibold`}>
                {title}
            </h2>
            <p className={`m-0 sm:max-w-[30ch] text-sm opacity-50`}>
                {description}
            </p>
        </div>
    )
}