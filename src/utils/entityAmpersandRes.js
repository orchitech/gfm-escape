export const entityAmpersandReStr = '&(?=[a-zA-Z][a-zA-Z\\d]*;|#\\d{1,7};|#[xX][\\da-fA-F]{1,6};)';
export const entityAmpersandRe = new RegExp(entityAmpersandReStr);
export const entityAmpersandsRe = new RegExp(entityAmpersandReStr, 'g');
