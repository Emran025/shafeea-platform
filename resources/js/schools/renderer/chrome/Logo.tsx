import { getSchoolBrand, getSchoolLogo } from '../../utils/schoolBranding';

interface LogoProps {
    showText?: boolean;
}

export function LogoMark({ className = '' }: { className?: string }) {
    const logoUrl = getSchoolLogo();
    const brandName = getSchoolBrand();

    return (
        <img
            src={logoUrl}
            alt={brandName}
            className={`nav__logo-mark-img ${className}`}
            onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                if (!target.dataset.fallbackTried) {
                    target.dataset.fallbackTried = 'true';
                    target.src = '/schools/LogoWithText.svg';
                }
            }}
        />
    );
}

export function LogoText({ className = '' }: { className?: string }) {
    const brandName = getSchoolBrand();

    return (
        <span className={`nav__logo-brand-text ${className}`}>
            {brandName}
        </span>
    );
}

export default function Logo({ showText = true }: LogoProps) {
    return (
        <div className="nav__logo-wrapper">
            <div className="nav__logo-mark">
                <LogoMark className="nav__logo-mark-svg" />
            </div>
            {showText && <LogoText className="nav__logo-text" />}
        </div>
    );
}
