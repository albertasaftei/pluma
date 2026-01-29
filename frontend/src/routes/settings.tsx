import { createSignal, Show, onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { api } from "~/lib/api";
import SettingsSidebar, {
  type SettingsSection,
} from "~/components/SettingsView/Sidebar";
import Account from "~/components/SettingsView/Account";
import ImportExport from "~/components/SettingsView/ImportExport";
import OrganizationPanel from "~/components/OrganizationPanel";
import AdminPanel from "~/components/SettingsView/AdminPanel";

export default function SettingsPage() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] =
    createSignal<SettingsSection>("account");
  const [isAdmin, setIsAdmin] = createSignal(false);
  const [isOrgAdmin, setIsOrgAdmin] = createSignal(false);

  onMount(() => {
    setIsAdmin(api.isAdmin());
    setIsOrgAdmin(api.isOrgAdmin());
  });

  const handleLogout = () => {
    api.clearToken();
    window.location.href = "/";
  };

  const handleClose = () => {
    navigate("/editor");
  };

  return (
    <div class="flex h-screen overflow-hidden bg-neutral-950">
      <SettingsSidebar
        activeSection={activeSection()}
        onSectionChange={setActiveSection}
        onClose={handleClose}
        onLogout={handleLogout}
        isAdmin={isAdmin()}
        isOrgAdmin={isOrgAdmin()}
      />

      {/* Main Content */}
      <div class="flex-1 overflow-auto bg-neutral-900">
        <Show
          when={activeSection() !== null}
          fallback={
            <div class="flex items-center justify-center h-full">
              <div class="text-center text-neutral-400">
                <div class="i-carbon-settings w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Select a settings option from the sidebar</p>
              </div>
            </div>
          }
        >
          <Show when={activeSection() === "account"}>
            <Account />
          </Show>

          <Show when={activeSection() === "import-export"}>
            <ImportExport />
          </Show>

          <Show when={activeSection() === "organization"}>
            <OrganizationPanel
              isOpen={true}
              inline={true}
              onClose={() => setActiveSection(null)}
            />
          </Show>

          <Show when={activeSection() === "admin"}>
            <AdminPanel
              isOpen={true}
              inline={true}
              onClose={() => setActiveSection(null)}
            />
          </Show>
        </Show>
      </div>
    </div>
  );
}
