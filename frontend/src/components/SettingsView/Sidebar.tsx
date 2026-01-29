import { Show } from "solid-js";
import Button from "../Button";

export type SettingsSection =
  | "account"
  | "import-export"
  | "organization"
  | "admin"
  | null;

interface SettingsSidebarProps {
  activeSection: SettingsSection;
  onSectionChange: (section: SettingsSection) => void;
  onClose: () => void;
  onLogout: () => void;
  isAdmin: boolean;
  isOrgAdmin: boolean;
}

export default function SettingsSidebar(props: SettingsSidebarProps) {
  return (
    <aside class="w-64 border-r border-neutral-800 bg-neutral-950 flex flex-col">
      <div class="p-4 border-b border-neutral-800">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-white">Settings</h2>
          <Button
            onClick={props.onClose}
            variant="icon"
            size="md"
            title="Close settings"
          >
            <div class="i-carbon-close w-5 h-5" />
          </Button>
        </div>
      </div>

      <nav class="flex flex-col flex-1 p-2 gap-1">
        <Button
          onClick={() => props.onSectionChange("account")}
          variant={props.activeSection === "account" ? "primary" : "ghost"}
          size="md"
          fullWidth
        >
          <div class="i-carbon-user w-4 h-4" />
          <span class="ml-2">Account</span>
        </Button>

        <Button
          onClick={() => props.onSectionChange("import-export")}
          variant={
            props.activeSection === "import-export" ? "primary" : "ghost"
          }
          size="md"
          fullWidth
        >
          <div class="i-carbon-document-import w-4 h-4" />
          <span class="ml-2">Import / Export</span>
        </Button>

        <Show when={props.isOrgAdmin}>
          <Button
            onClick={() => props.onSectionChange("organization")}
            variant={
              props.activeSection === "organization" ? "primary" : "ghost"
            }
            size="md"
            fullWidth
          >
            <div class="i-carbon-enterprise w-4 h-4" />
            <span class="ml-2">Organization</span>
          </Button>
        </Show>

        <Show when={props.isAdmin}>
          <Button
            onClick={() => props.onSectionChange("admin")}
            variant={props.activeSection === "admin" ? "primary" : "ghost"}
            size="md"
            fullWidth
          >
            <div class="i-carbon-user-admin w-4 h-4" />
            <span class="ml-2">Admin Panel</span>
          </Button>
        </Show>

        <div class="border-t border-neutral-800 my-2" />

        <Button
          onClick={props.onLogout}
          variant="ghost"
          size="md"
          fullWidth
          class="text-red-400 hover:text-red-300 hover:bg-red-950/30"
        >
          <div class="i-carbon-logout w-4 h-4" />
          <span class="ml-2">Logout</span>
        </Button>
      </nav>
    </aside>
  );
}
