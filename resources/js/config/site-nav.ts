import { Home, Users, Award, Phone, BookOpen, Shield, LucideIcon } from 'lucide-react';

// Define types for navigation items
export interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
  description?: string; // Optional property for items that have descriptions
}

export interface NavigationSection {
  title: string;
  items: NavigationItem[];
}

export const navigationItems: NavigationItem[] = [
  { name: 'الرئيسية', href: '/', icon: Home },
  { name: 'من نحن', href: '/about', icon: Users },
  { name: 'خدماتنا', href: '/services', icon: Award },
  { name: 'تواصل معنا', href: '/contact', icon: Phone },
];

export const bePartOfUs: NavigationItem[] = [
  { name: 'شارك كمعلم', href: '/teachers/apply', icon: Users, description: 'انظم كمعلم وكن جزءا في عملية المساهمة التعليمية' },
  { name: 'انظم كمدرسة', href: '/schools/apply', icon: Home, description: 'أضف مدرستك لتستفيد من ميزاتنا الفريدة' },
];

export const helpItems: NavigationItem[] = [
  { name: 'الأسئلة الشائعة', href: '/faq', icon: BookOpen },
  { name: 'مركز المساعدة', href: '/help', icon: Shield },
  { name: 'الدعم الفني', href: '/support', icon: Phone },
];

export const sitNavigationItems: NavigationSection[] = [ 
  { title: 'القائمة الرئيسية', items: navigationItems },
  { title: 'انظم إلينا', items: bePartOfUs },
  { title: 'المساعدة والدعم', items: helpItems } 
];