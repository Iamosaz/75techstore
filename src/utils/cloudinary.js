// src/utils/cloudinary.js
export const getOptimizedImage = (url, type = 'product') => {
  if (!url) return '/placeholder.webp';
  if (url.includes('cloudinary.com')) {
    const transforms = {
      product: 'w_400,h_400,c_fill,q_auto,f_webp',
      thumbnail: 'w_150,h_150,c_fill,q_auto,f_webp',
      hero: 'w_1200,h_600,c_fill,q_auto,f_webp',
      avatar: 'w_80,h_80,c_fill,q_auto,f_webp',
      blog: 'w_800,h_400,c_fill,q_auto,f_webp',
    };
    return url.replace('/upload/', `/upload/${transforms[type] || transforms.product}/`);
  }
  return url;
};
export default getOptimizedImage;