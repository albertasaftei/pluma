import { Show, createSignal, onMount } from "solid-js";
import Button from "./Button";
import Logo from "./Logo";
import OrganizationSelector from "./OrganizationSelector";
import { api } from "~/lib/api";

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

  onMount(() => {
    setMounted(true);
    setIsAdmin(api.isAdmin());
    setIsOrgAdmin(api.isOrgAdmin());
  });

  const handleLogout = () => {
    api.clearToken();
    window.location.href = "/";
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
        {/* Organization Selector */}
        <Show when={mounted()}>
          <OrganizationSelector onSwitch={props.onOrgSwitch} />
        </Show>

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

        <Button onClick={handleLogout} variant="icon" size="md" title="Logout">
          <div class="i-carbon-logout w-5 h-5" />
        </Button>
      </div>
    </header>
  );
}
