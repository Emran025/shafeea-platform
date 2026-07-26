interface LogoProps {
    showText?: boolean;
}

export function LogoMark({ className = '' }: { className?: string }) {
    return ( 
        <img
            src="/Logo.svg"
            alt="LogoMark"
        />
    );
}

export function LogoText({ className = '' }: { className?: string }) {
    return (
        <img
            src="/LogoText.svg"
            alt="LogoText"
            loading="lazy"
        />
    );
}

export default function Logo({ showText = true }: LogoProps) {
    return (
        <>
            <div className="nav__logo-mark">
                <LogoMark className="nav__logo-mark-svg" />
            </div>
            {showText && <LogoText className="nav__logo-text" />}
        </>
    );
}
