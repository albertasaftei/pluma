import { createSignal } from "solid-js";
import type { ApiKey } from "./types";

/**
 * Reactive primitive for the API key list and its loading state.
 */
export function createApiKeyListState() {
  const [keys, setKeys] = createSignal<ApiKey[]>([]);
  const [loading, setLoading] = createSignal(true);

  return { keys, setKeys, loading, setLoading };
}

/**
 * Reactive primitive for the create-key dialog form fields.
 * Includes the one-time created-key display state.
 */
export function createApiKeyFormState() {
  const [showCreate, setShowCreate] = createSignal(false);
  const [formName, setFormName] = createSignal("");
  const [formPermissions, setFormPermissions] = createSignal<string[]>([]);
  const [formExpiresAt, setFormExpiresAt] = createSignal("");
  const [saving, setSaving] = createSignal(false);
  const [formError, setFormError] = createSignal("");
  const [createdKey, setCreatedKey] = createSignal("");
  const [showCreated, setShowCreated] = createSignal(false);

  return {
    showCreate,
    setShowCreate,
    formName,
    setFormName,
    formPermissions,
    setFormPermissions,
    formExpiresAt,
    setFormExpiresAt,
    saving,
    setSaving,
    formError,
    setFormError,
    createdKey,
    setCreatedKey,
    showCreated,
    setShowCreated,
  };
}

/**
 * Reactive primitive for the revoke-key confirmation dialog.
 */
export function createApiKeyRevokeState() {
  const [revokeDialog, setRevokeDialog] = createSignal<{
    isOpen: boolean;
    key: ApiKey | null;
  }>({ isOpen: false, key: null });
  const [revoking, setRevoking] = createSignal(false);

  return { revokeDialog, setRevokeDialog, revoking, setRevoking };
}
