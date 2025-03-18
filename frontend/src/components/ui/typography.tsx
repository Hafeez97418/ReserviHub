import clsx from "clsx"

export function TypographyH1({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <h1 className={clsx("scroll-m-20 text-3xl font-bold tracking-tight lg:text-4xl", className)}>
            {children}
        </h1>
    )
}


export function TypographyH3({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <h1 className={clsx("scroll-m-20 text-2xl font-semibold tracking-tight", className)}>
            {children}
        </h1>
    )
}