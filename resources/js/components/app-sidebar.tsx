import { Link } from '@inertiajs/react';
import {
    FileText,
    FolderKanban,
    Layers,
    LayoutGrid,
    Newspaper,
    Tag as TagIcon,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { index as articlesIndex } from '@/routes/admin/articles';
import { index as pagesIndex } from '@/routes/admin/pages';
import { index as projectsIndex } from '@/routes/admin/projects';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Articles',
        href: articlesIndex(),
        icon: Newspaper,
    },
    {
        title: 'Categories',
        href: '/admin/categories',
        icon: Layers,
        external: true,
    },
    {
        title: 'Tags',
        href: '/admin/tags',
        icon: TagIcon,
        external: true,
    },
    {
        title: 'Pages',
        href: pagesIndex(),
        icon: FileText,
    },
    {
        title: 'Projects',
        href: projectsIndex(),
        icon: FolderKanban,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
