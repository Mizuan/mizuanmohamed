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
import { index as articlesIndex } from '@/routes/admin/articles';
import { index as categoriesIndex } from '@/routes/admin/categories';
import { index as pagesIndex } from '@/routes/admin/pages';
import { index as projectsIndex } from '@/routes/admin/projects';
import { index as tagsIndex } from '@/routes/admin/tags';
import { dashboard } from '@/routes';
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
        href: categoriesIndex(),
        icon: Layers,
    },
    {
        title: 'Tags',
        href: tagsIndex(),
        icon: TagIcon,
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
