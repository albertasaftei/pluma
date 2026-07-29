import { createSignal, onMount, onCleanup, Show } from "solid-js";

export default function ReloadPrompt() {
  const [needRefresh, setNeedRefresh] = createSignal(false);
  const [offlineReady, setOfflineReady] = createSignal(false);
  let registration: ServiceWorkerRegistration | undefined;

  onMount(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    // Listen for SW updates on the already-registered SW
    navigator.serviceWorker.ready.then((reg) => {
      registration = reg;

      // Check for updates every hour
      setInterval(() => reg.update(), 60 * 60 * 1000);

      // If there's a waiting SW, a new version is available
      if (reg.waiting) {
        setNeedRefresh(true);
      }

      reg.addEventListener("updatefound", () => {
        const newWorker = reg.installing;
        if (!newWorker) return;

        newWorker.addEventListener("statechange", () => {
          if (newWorker.state === "installed") {
            if (navigator.serviceWorker.controller) {
              // New content available
              setNeedRefresh(true);
            } else {
              // Content cached for offline
              setOfflineReady(true);
            }
          }
        });
      });
    });

    // Reload on controller change (after skipWaiting)
    let refreshing = false;
    const onControllerChange = () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    };
    navigator.serviceWorker.addEventListener(
      "controllerchange",
      onControllerChange
    );

    onCleanup(() => {
      navigator.serviceWorker.removeEventListener(
        "controllerchange",
        onControllerChange
      );
    });
  });

  const updateServiceWorker = () => {
    const waiting = registration?.waiting;
    if (waiting) {
      waiting.postMessage({ type: "SKIP_WAITING" });
    }
  };

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  return (
    <Show when={offlineReady() || needRefresh()}>
      <div class="fixed bottom-6 right-6 z-[100] max-w-sm rounded-lg border shadow-xl overflow-hidden transform transition-all duration-300 ease-out animate-toast-slide-in bg-blue-500/90 border-blue-400 text-white">
        <div class="flex flex-col gap-2 px-4 py-3">
          <div class="flex items-center gap-3">
            <div class="i-carbon-information-filled w-5 h-5 flex-shrink-0" />
            <span class="text-sm font-medium">
              <Show
                when={needRefresh()}
                fallback="App ready to work offline"
              >
                New content available. Reload to update.
              </Show>
            </span>
          </div>
          <div class="flex items-center justify-end gap-2">
            <Show when={needRefresh()}>
              <button
                class="px-3 py-1 text-xs font-medium rounded bg-white/20 hover:bg-white/30 transition-colors"
                onClick={updateServiceWorker}
              >
                Reload
              </button>
            </Show>
            <button
              class="px-3 py-1 text-xs font-medium rounded bg-white/10 hover:bg-white/20 transition-colors"
              onClick={close}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Show>
  );
}
