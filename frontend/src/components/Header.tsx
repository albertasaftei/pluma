import { Show, createSignal, onMount } from "solid-js";
import Button from "./Button";
import Logo from "./Logo";
import Popover, { PopoverItem } from "./Popover";
import { api } from "~/lib/api";
import { PopoverItemProps } from "~/types/Popover.types";

interface HeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onDashboard: () => void;
  onOpenOrgPanel: () => void;
  onOpenAdminPanel: () => void;
  onOrgSwitch: () => void;
}

export default function Header(props: HeaderProps) {
  const [mounted, setMounted] = createSignal(false);
  const [isAdmin, setIsAdmin] = createSignal(false);
  const [isOrgAdmin, setIsOrgAdmin] = createSignal(false);
  const [menuOpen, setMenuOpen] = createSignal(false);

  onMount(() => {
    setMounted(true);
    setIsAdmin(api.isAdmin());
    setIsOrgAdmin(api.isOrgAdmin());
  });

  const handleLogout = () => {
    api.clearToken();
    window.location.href = "/";
  };

  const menuItems = (): PopoverItemProps[] => {
    const items: PopoverItemProps[] = [];

    if (mounted() && isOrgAdmin()) {
      items.push({
        icon: "i-carbon-settings",
        label: "Organization",
        onClick: () => {
          props.onOpenOrgPanel();
          setMenuOpen(false);
        },
      });
    }

    if (mounted() && isAdmin()) {
      items.push({
        icon: "i-carbon-user-admin",
        label: "Admin Panel",
        onClick: () => {
          props.onOpenAdminPanel();
          setMenuOpen(false);
        },
      });
    }

    items.push({
      icon: "i-carbon-logout",
      label: "Logout",
      onClick: () => {
        handleLogout();
        setMenuOpen(false);
      },
    });

    return items;
  };
  return (
    <header class="h-14 border-b border-neutral-800 flex items-center justify-between px-2 sm:px-4 bg-neutral-950">
      <div class="flex items-center gap-1 sm:gap-2">
        <Show when={!props.sidebarOpen}>
          <Button
            onClick={props.onToggleSidebar}
            variant="icon"
            size="lg"
            aria-label="Open sidebar"
          >
            <div class="i-carbon-side-panel-open w-5 h-5" />
          </Button>
        </Show>
        <Button
          onClick={props.onDashboard}
          variant="ghost"
          size="lg"
          class="flex items-center gap-1 sm:gap-2"
          title="Go to Dashboard"
        >
          <Logo color="#2a9d8f" />
          <h1 class="hidden sm:block text-lg font-semibold text-neutral-100">
            pluma
          </h1>
        </Button>
      </div>

      <div class="flex items-center gap-2 sm:gap-3">
        {/* Desktop: Show individual icons */}
        <div class="hidden md:flex items-center gap-2">
          {/* Organization Settings (for org admins) */}
          <Show when={mounted() && isOrgAdmin()}>
            <Button
              onClick={props.onOpenOrgPanel}
              variant="icon"
              size="md"
              title="Organization Settings"
            >
              <div class="i-carbon-settings w-5 h-5" />
            </Button>
          </Show>

          {/* Global Admin Panel (for global admin only) */}
          <Show when={mounted() && isAdmin()}>
            <Button
              onClick={props.onOpenAdminPanel}
              variant="icon"
              size="md"
              title="Admin Panel"
            >
              <div class="i-carbon-user-admin w-5 h-5" />
            </Button>
          </Show>

          <Button
            onClick={handleLogout}
            variant="icon"
            size="md"
            title="Logout"
          >
            <div class="i-carbon-logout w-5 h-5" />
          </Button>
        </div>

        {/* Mobile: Hamburger menu */}
        <div class="md:hidden">
          <Popover
            isOpen={menuOpen()}
            onClose={() => setMenuOpen(false)}
            trigger={
              <Button
                variant="icon"
                size="md"
                title="Menu"
                onClick={() => setMenuOpen(!menuOpen())}
              >
                <div class="i-carbon-overflow-menu-vertical w-5 h-5" />
              </Button>
            }
          >
            {menuItems().map((item) => (
              <PopoverItem
                icon={item.icon}
                label={item.label}
                onClick={item.onClick}
              />
            ))}
          </Popover>
        </div>
      </div>
    </header>
  );
}
