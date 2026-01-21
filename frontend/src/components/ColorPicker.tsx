import { For, Show } from "solid-js";
import { COLOR_PALETTE } from "~/utils/sidebar.utils";

interface ColorPickerProps {
  currentColor?: string;
  onColorSelect: (color: string | null) => void;
}

export default function ColorPicker(props: ColorPickerProps) {
  return (
    <div class="px-2 py-2 border-t border-neutral-800">
      <div class="text-xs text-neutral-500 mb-2">Color</div>
      <div class="flex flex-wrap gap-1">
        <For each={COLOR_PALETTE}>
          {(color) => (
            <button
              onClick={(e) => {
                e.stopPropagation();
                props.onColorSelect(color.value);
              }}
              class="w-6 h-6 rounded border-2 hover:scale-110 transition-transform"
              style={{
                "background-color": color.value,
                "border-color":
                  props.currentColor === color.value ? "#fff" : "transparent",
              }}
              title={color.name}
            />
          )}
        </For>
        <Show when={props.currentColor}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              props.onColorSelect(null);
            }}
            class="w-6 h-6 rounded border-2 border-neutral-700 hover:scale-110 transition-transform flex items-center justify-center"
            title="Remove color"
          >
            <div class="i-carbon-close w-3 h-3 text-neutral-500" />
          </button>
        </Show>
      </div>
    </div>
  );
}
