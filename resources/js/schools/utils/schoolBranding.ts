declare global {
  interface Window {
    __SCHOOL_DATA__?: {
      name: string;
      code: string;
      logo: string;
      phone?: string;
      country?: string;
      city?: string;
      address?: string;
    };
  }
}

export const getSchoolBrand = (): string => {
  return window.__SCHOOL_DATA__?.name || 'منصة شفيع';
};

export const getSchoolLogo = (): string => {
  const code = getSchoolCode();
  if (code) {
    return `/school/${code}/assets/LogoWithText.svg`;
  }
  return window.__SCHOOL_DATA__?.logo || '/schools/LogoWithText.svg';
};

export const getSchoolCode = (): string => {
  return window.__SCHOOL_DATA__?.code || '';
};

export const getSchoolAsset = (assetPath: string): string => {
  const code = getSchoolCode();
  const cleanPath = assetPath.replace(/^\/+/, '');
  if (code) {
    return `/school/${code}/assets/${cleanPath}`;
  }
  return `/schools/${cleanPath}`;
};
