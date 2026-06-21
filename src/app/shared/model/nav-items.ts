export interface NavItem {
  label: string;
  route: string;
  icon?: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Início', route: '/', icon: 'home-outline' },
  { label: 'Crianças', route: '/children', icon: 'people-outline' },
  { label: 'Campanhas', route: '/campaigns', icon: 'megaphone-outline' },
];
