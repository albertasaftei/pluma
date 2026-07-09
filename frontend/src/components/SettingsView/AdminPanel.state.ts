import { createSignal } from "solid-js";

// --- Shared data types ---

export interface User {
  id: number;
  username: string;
  email: string;
  createdAt: string;
  isAdmin: boolean;
  isBanned: boolean;
}

export interface OrgMembership {
  orgId: number;
  orgName: string;
  orgSlug: string;
  role: string;
  joinedAt: string;
  isOwner: boolean;
}

export interface OrgListItem {
  id: number;
  name: string;
  slug: string;
}

// --- Reactive primitives ---

/**
 * Reactive primitive for the user list and overall panel loading state.
 */
export function createAdminUserListState() {
  const [users, setUsers] = createSignal<User[]>([]);
  const [loading, setLoading] = createSignal(false);
  const [isOwner, setIsOwner] = createSignal(false);

  return { users, setUsers, loading, setLoading, isOwner, setIsOwner };
}

/**
 * Reactive primitive for the create-user inline form.
 */
export function createAdminCreateFormState() {
  const [showCreateForm, setShowCreateForm] = createSignal(false);
  const [username, setUsername] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [newUserIsAdmin, setNewUserIsAdmin] = createSignal(false);
  const [error, setError] = createSignal("");

  return {
    showCreateForm,
    setShowCreateForm,
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    newUserIsAdmin,
    setNewUserIsAdmin,
    error,
    setError,
  };
}

/**
 * Reactive primitive for the per-user org management section.
 */
export function createAdminOrgState() {
  const [expandedUserId, setExpandedUserId] = createSignal<number | null>(null);
  const [userOrgsCache, setUserOrgsCache] = createSignal<
    Record<number, OrgMembership[]>
  >({});
  const [allOrgs, setAllOrgs] = createSignal<OrgListItem[]>([]);
  const [orgLoadingFor, setOrgLoadingFor] = createSignal<number | null>(null);
  const [addOrgForm, setAddOrgForm] = createSignal<
    Record<number, { orgId: number; role: string }>
  >({});

  return {
    expandedUserId,
    setExpandedUserId,
    userOrgsCache,
    setUserOrgsCache,
    allOrgs,
    setAllOrgs,
    orgLoadingFor,
    setOrgLoadingFor,
    addOrgForm,
    setAddOrgForm,
  };
}
