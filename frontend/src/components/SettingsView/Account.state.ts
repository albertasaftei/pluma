import { createSignal } from "solid-js";

/**
 * Reactive primitive for the username / profile display section of Account settings.
 */
export function createUsernameState() {
  const [username, setUsername] = createSignal<string | null>(null);
  const [email, setEmail] = createSignal<string | null>(null);
  const [editingUsername, setEditingUsername] = createSignal(false);
  const [newUsername, setNewUsername] = createSignal("");
  const [savingUsername, setSavingUsername] = createSignal(false);
  const [usernameError, setUsernameError] = createSignal("");

  return {
    username,
    setUsername,
    email,
    setEmail,
    editingUsername,
    setEditingUsername,
    newUsername,
    setNewUsername,
    savingUsername,
    setSavingUsername,
    usernameError,
    setUsernameError,
  };
}

/**
 * Reactive primitive for the change-password modal in Account settings.
 * Includes a `reset()` method that clears all fields and closes the modal.
 */
export function createPasswordState() {
  const [changingPassword, setChangingPassword] = createSignal(false);
  const [currentPassword, setCurrentPassword] = createSignal("");
  const [newPassword, setNewPassword] = createSignal("");
  const [confirmNewPassword, setConfirmNewPassword] = createSignal("");
  const [showCurrentPassword, setShowCurrentPassword] = createSignal(false);
  const [showNewPassword, setShowNewPassword] = createSignal(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] =
    createSignal(false);
  const [passwordError, setPasswordError] = createSignal("");
  const [savingPassword, setSavingPassword] = createSignal(false);

  const reset = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmNewPassword(false);
    setPasswordError("");
    setSavingPassword(false);
    setChangingPassword(false);
  };

  return {
    changingPassword,
    setChangingPassword,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmNewPassword,
    setConfirmNewPassword,
    showCurrentPassword,
    setShowCurrentPassword,
    showNewPassword,
    setShowNewPassword,
    showConfirmNewPassword,
    setShowConfirmNewPassword,
    passwordError,
    setPasswordError,
    savingPassword,
    setSavingPassword,
    reset,
  };
}

/**
 * Reactive primitive for the change-email modal in Account settings.
 * Includes a `reset()` method that clears all fields and closes the modal.
 */
export function createEmailChangeState() {
  const [changingEmail, setChangingEmail] = createSignal(false);
  const [newEmailInput, setNewEmailInput] = createSignal("");
  const [emailChangeError, setEmailChangeError] = createSignal("");
  const [emailChangeSending, setEmailChangeSending] = createSignal(false);
  const [emailChangeSent, setEmailChangeSent] = createSignal(false);

  const reset = () => {
    setNewEmailInput("");
    setEmailChangeError("");
    setEmailChangeSending(false);
    setEmailChangeSent(false);
    setChangingEmail(false);
  };

  return {
    changingEmail,
    setChangingEmail,
    newEmailInput,
    setNewEmailInput,
    emailChangeError,
    setEmailChangeError,
    emailChangeSending,
    setEmailChangeSending,
    emailChangeSent,
    setEmailChangeSent,
    reset,
  };
}
