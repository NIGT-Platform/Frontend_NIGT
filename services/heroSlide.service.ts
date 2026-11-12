import { axiosInstance } from '../lib/axios';

export interface HeroSlide {
  id: string;
  imageUrl: string;
  caption?: string | null;
  subCaption?: string | null;
  order: number;
  isActive: boolean;
  createdAt: string;
}

export const getPublicHeroSlides = async (): Promise<HeroSlide[]> => {
  const res = await axiosInstance.get('/hero-slides');
  return res.data.slides || [];
};

export const getAdminHeroSlides = async (): Promise<HeroSlide[]> => {
  const res = await axiosInstance.get('/hero-slides/admin');
  return res.data.slides || [];
};

export const createHeroSlide = async (formData: FormData): Promise<HeroSlide> => {
  const res = await axiosInstance.post('/hero-slides/admin', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.slide;
};

export const deleteHeroSlide = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/hero-slides/admin/${id}`);
};

