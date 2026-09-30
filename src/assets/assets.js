import LogoImport from "./Logo.jpeg";
import bgImport from "./bg.webp";
import greenDecorationFlowerImport from "./green decoration flower type.jpg";
import heroImport from "./hero.png";
import heroAcademicBgImport from "./hero_academic_bg.jpg";
import image2Import from "./image2.jpg";
import moon_lightImport from "./moon_light.jpg";
import muftiImport from "./mufti.jpeg";
import teacherImport from "./teacher.avif";
import viteImport from "./vite.svg";

/**
 * Normalizes any static imported asset or remote DB image into a valid string URL.
 */
export function getSrc(img, fallback = "") {
  if (!img) return fallback;
  if (typeof img === "string") {
    const trimmed = img.trim();
    if (!trimmed || trimmed === "[object Object]") return fallback;
    return trimmed;
  }
  if (typeof img === "object" && img !== null) {
    if (img.src && typeof img.src === "string") return img.src;
    if (img.url && typeof img.url === "string") return img.url;
    if (img.secure_url && typeof img.secure_url === "string") return img.secure_url;
    if (img.path && typeof img.path === "string") return img.path;
  }
  return fallback;
}

export const Logo = getSrc(LogoImport);
export const LogoImg = Logo;
export const bg = getSrc(bgImport);
export const greenDecorationFlower = getSrc(greenDecorationFlowerImport);
export const GreenDecorationBg = greenDecorationFlower;
export const hero = getSrc(heroImport);
export const heroAcademicBg = getSrc(heroAcademicBgImport);
export const HeroAcademicBg = heroAcademicBg;
export const image2 = getSrc(image2Import);
export const AboutImage = image2;
export const CampusImage = image2;
export const moon_light = getSrc(moon_lightImport);
export const mufti = getSrc(muftiImport);
export const FounderImage = mufti;
export const teacher = getSrc(teacherImport);
export const DirectorImage = teacher;
export const TeacherImage = teacher;
export const vite = getSrc(viteImport);

/**
 * Robust image URL resolver for all database fields (courses, blogs, teachers, students, notifications).
 * Returns a guaranteed valid string URL or the default logo fallback.
 */
export function getImageUrl(dbImage, fallback = Logo) {
  if (!dbImage) return fallback;
  const resolved = getSrc(dbImage);
  if (!resolved || resolved === "[object Object]") return fallback;
  return resolved;
}

export const assets = {
  Logo,
  LogoImg,
  bg,
  greenDecorationFlower,
  GreenDecorationBg,
  hero,
  heroAcademicBg,
  HeroAcademicBg,
  image2,
  AboutImage,
  CampusImage,
  moon_light,
  mufti,
  FounderImage,
  teacher,
  DirectorImage,
  TeacherImage,
  vite,
  getImageUrl,
  getSrc,
};

export default assets;
