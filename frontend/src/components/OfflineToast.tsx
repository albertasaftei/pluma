import { createSignal, onMount, onCleanup, Show } from "solid-js";

export default function OfflineToast() {
  const [isOffline, setIsOffline] = createSignal(false);
  const [showBackOnline, setShowBackOnline] = createSignal(false);
  const [offlineDismissed, setOfflineDismissed] = createSignal(false);

  onMount(() => {
    // Only run in browser
    if (typeof window === "undefined") return;

    setIsOffline(!navigator.onLine);

    const handleOffline = () => {
      setOfflineDismissed(false);
      setIsOffline(true);
    };
    const handleOnline = () => {
      setIsOffline(false);
      setShowBackOnline(true);
      setTimeout(() => setShowBackOnline(false), 3000);
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    onCleanup(() => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    });
  });

  return (
    <>
      <Show when={isOffline() && !offlineDismissed()}>
        <div class="fixed top-4 left-1/2 -translate-x-1/2 z-[100] rounded-lg border shadow-xl overflow-hidden transform transition-all duration-300 ease-out animate-toast-slide-in bg-yellow-500/90 border-yellow-400 text-white">
          <div class="flex items-center gap-3 px-4 py-3">
            <div class="i-carbon-wifi-off w-5 h-5 flex-shrink-0" />
            <span class="text-sm font-medium">
              You are offline — showing cached content
            </span>
            <button
              onClick={() => setOfflineDismissed(true)}
              class="ml-1 i-carbon-close w-4 h-4 flex-shrink-0 opacity-80 hover:opacity-100 cursor-pointer"
              aria-label="Dismiss"
            />
          </div>
        </div>
      </Show>
      <Show when={showBackOnline()}>
        <div class="fixed top-4 left-1/2 -translate-x-1/2 z-[100] rounded-lg border shadow-xl overflow-hidden transform transition-all duration-300 ease-out animate-toast-slide-in bg-green-500/90 border-green-400 text-white">
          <div class="flex items-center gap-3 px-4 py-3">
            <div class="i-carbon-checkmark-filled w-5 h-5 flex-shrink-0" />
            <span class="text-sm font-medium">Back online</span>
            <button
              onClick={() => setShowBackOnline(false)}
              class="ml-1 i-carbon-close w-4 h-4 flex-shrink-0 opacity-80 hover:opacity-100 cursor-pointer"
              aria-label="Dismiss"
            />
          </div>
        </div>
      </Show>
    </>
  );
}
