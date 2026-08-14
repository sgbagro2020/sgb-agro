import sgbLogoImg from '../assets/images/sgb_logo_1786080419834.jpg';

// Official SGB Agro Industries Uploaded Branding Logos
export const OFFICIAL_GEAR_LOGO = sgbLogoImg;
export const OFFICIAL_COMPANY_LOGO = sgbLogoImg;

export const getSavedLogo = (): string => {
  try {
    const saved = localStorage.getItem('sgb_custom_logo');
    if (saved) return saved;
  } catch (e) {
    // Ignore localStorage access errors
  }
  return sgbLogoImg;
};

