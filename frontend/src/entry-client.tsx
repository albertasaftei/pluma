// @refresh reload
import { mount, StartClient } from "@solidjs/start/client";
import "./styles/globals.css";

mount(() => <StartClient />, document.getElementById("app")!);

// Register service worker with root scope
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/_build/sw.js", { scope: "/" });
  });
}
