import { For, Show, type Accessor } from "solid-js";
import type { Tag } from "~/types/Tag.types";

interface FilterNotesBodyProps {
  filterMode: Accessor<"any" | "all">;
  setFilterMode: (mode: "any" | "all") => void;
  selectedFilterTags: Accessor<number[]>;
  setSelectedFilterTags: (tags: number[]) => void;
  tags: Accessor<Tag[]>;
  filterModifiedFrom: Accessor<string>;
  setFilterModifiedFrom: (v: string) => void;
  filterModifiedTo: Accessor<string>;
  setFilterModifiedTo: (v: string) => void;
  filterCreatedFrom: Accessor<string>;
  setFilterCreatedFrom: (v: string) => void;
  filterCreatedTo: Accessor<string>;
  setFilterCreatedTo: (v: string) => void;
  filterFavorite: Accessor<boolean>;
  setFilterFavorite: (v: boolean) => void;
  filterColors: Accessor<string[]>;
  setFilterColors: (v: string[]) => void;
  availableColors: Accessor<{ colors: string[]; hasNoColor: boolean }>;
}

export default function FilterNotesBody(props: FilterNotesBodyProps) {
  const toggleColor = (c: string) => {
    const current = props.filterColors();
    if (current.includes(c)) {
      props.setFilterColors(current.filter((x) => x !== c));
    } else {
      props.setFilterColors([...current, c]);
    }
  };

  return (
    <div class="space-y-5">
      {/* Tags */}
      <div>
        <label class="block text-sm text-secondary-body mb-2">Match mode</label>
        <div class="flex rounded-md border border-base overflow-hidden text-sm">
          <button
            onClick={() => props.setFilterMode("any")}
            class={`flex-1 px-3 py-1.5 cursor-pointer transition-colors ${
              props.filterMode() === "any"
                ? "bg-[var(--color-primary)] text-white"
                : "text-secondary-body hover:bg-elevated"
            }`}
          >
            Any of selected tags
          </button>
          <button
            onClick={() => props.setFilterMode("all")}
            class={`flex-1 px-3 py-1.5 cursor-pointer transition-colors ${
              props.filterMode() === "all"
                ? "bg-[var(--color-primary)] text-white"
                : "text-secondary-body hover:bg-elevated"
            }`}
          >
            All selected tags
          </button>
        </div>
      </div>

      <div>
        <div class="flex items-center justify-between mb-2">
          <label class="text-sm text-secondary-body">Tags</label>
          <Show when={props.selectedFilterTags().length > 0}>
            <button
              onClick={() => props.setSelectedFilterTags([])}
              class="text-xs text-[var(--color-primary)] hover:underline cursor-pointer"
            >
              Clear all
            </button>
          </Show>
        </div>
        <div class="max-h-48 overflow-y-auto space-y-1">
          <Show
            when={props.tags().length > 0}
            fallback={
              <p class="py-4 text-center text-sm text-muted-body">
                No tags yet. Create tags from the Tags page.
              </p>
            }
          >
            <For each={props.tags()}>
              {(tag) => {
                const isSelected = () =>
                  props.selectedFilterTags().includes(tag.id);
                return (
                  <button
                    onClick={() => {
                      const current = props.selectedFilterTags();
                      if (current.includes(tag.id)) {
                        props.setSelectedFilterTags(
                          current.filter((id) => id !== tag.id),
                        );
                      } else {
                        props.setSelectedFilterTags([...current, tag.id]);
                      }
                    }}
                    class="w-full px-3 py-2 text-left text-sm rounded-lg hover:bg-elevated transition-colors flex items-center gap-3 cursor-pointer"
                    classList={{ "bg-elevated": isSelected() }}
                  >
                    <div
                      class={`w-5 h-5 flex-shrink-0 ${isSelected() ? "i-carbon-checkbox-checked text-[var(--color-primary)]" : "i-carbon-checkbox text-muted-body"}`}
                    />
                    <div
                      class="w-3.5 h-3.5 rounded-full flex-shrink-0 border border-base"
                      style={{
                        "background-color":
                          tag.color || "var(--color-text-muted)",
                      }}
                    />
                    <span class="flex-1 truncate text-body">{tag.name}</span>
                    <span class="text-xs text-muted-body tabular-nums">
                      {tag.document_count}
                    </span>
                  </button>
                );
              }}
            </For>
          </Show>
        </div>
      </div>

      {/* Date modified */}
      <div>
        <div class="flex items-center justify-between mb-2">
          <label class="text-sm text-secondary-body">Date modified</label>
          <Show when={props.filterModifiedFrom() || props.filterModifiedTo()}>
            <button
              onClick={() => {
                props.setFilterModifiedFrom("");
                props.setFilterModifiedTo("");
              }}
              class="text-xs text-[var(--color-primary)] hover:underline cursor-pointer"
            >
              Clear
            </button>
          </Show>
        </div>
        <div class="flex gap-2">
          <div class="flex-1">
            <span class="text-xs text-muted-body block mb-1">From</span>
            <input
              type="date"
              value={props.filterModifiedFrom()}
              onInput={(e) =>
                props.setFilterModifiedFrom(e.currentTarget.value)
              }
              class="w-full px-2 py-1.5 text-sm bg-base border border-base rounded-lg text-body focus:outline-none focus:border-[var(--color-primary)] cursor-pointer"
            />
          </div>
          <div class="flex-1">
            <span class="text-xs text-muted-body block mb-1">To</span>
            <input
              type="date"
              value={props.filterModifiedTo()}
              onInput={(e) => props.setFilterModifiedTo(e.currentTarget.value)}
              class="w-full px-2 py-1.5 text-sm bg-base border border-base rounded-lg text-body focus:outline-none focus:border-[var(--color-primary)] cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Date created */}
      <div>
        <div class="flex items-center justify-between mb-2">
          <label class="text-sm text-secondary-body">Date created</label>
          <Show when={props.filterCreatedFrom() || props.filterCreatedTo()}>
            <button
              onClick={() => {
                props.setFilterCreatedFrom("");
                props.setFilterCreatedTo("");
              }}
              class="text-xs text-[var(--color-primary)] hover:underline cursor-pointer"
            >
              Clear
            </button>
          </Show>
        </div>
        <div class="flex gap-2">
          <div class="flex-1">
            <span class="text-xs text-muted-body block mb-1">From</span>
            <input
              type="date"
              value={props.filterCreatedFrom()}
              onInput={(e) => props.setFilterCreatedFrom(e.currentTarget.value)}
              class="w-full px-2 py-1.5 text-sm bg-base border border-base rounded-lg text-body focus:outline-none focus:border-[var(--color-primary)] cursor-pointer"
            />
          </div>
          <div class="flex-1">
            <span class="text-xs text-muted-body block mb-1">To</span>
            <input
              type="date"
              value={props.filterCreatedTo()}
              onInput={(e) => props.setFilterCreatedTo(e.currentTarget.value)}
              class="w-full px-2 py-1.5 text-sm bg-base border border-base rounded-lg text-body focus:outline-none focus:border-[var(--color-primary)] cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Favorites */}
      <div>
        <label class="block text-sm text-secondary-body mb-2">Favorites</label>
        <button
          onClick={() => props.setFilterFavorite(!props.filterFavorite())}
          class={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer border ${
            props.filterFavorite()
              ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
              : "text-secondary-body border-base hover:bg-elevated"
          }`}
        >
          <div
            class={`w-4 h-4 flex-shrink-0 ${props.filterFavorite() ? "i-carbon-star-filled" : "i-carbon-star"}`}
          />
          Favorites only
        </button>
      </div>

      {/* Color */}
      <Show
        when={
          props.availableColors().colors.length > 0 ||
          props.availableColors().hasNoColor
        }
      >
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="text-sm text-secondary-body">Color</label>
            <Show when={props.filterColors().length > 0}>
              <button
                onClick={() => props.setFilterColors([])}
                class="text-xs text-[var(--color-primary)] hover:underline cursor-pointer"
              >
                Clear
              </button>
            </Show>
          </div>
          <div class="flex flex-wrap gap-2">
            <For each={props.availableColors().colors}>
              {(color) => {
                const isSelected = () => props.filterColors().includes(color);
                return (
                  <button
                    onClick={() => toggleColor(color)}
                    title={color}
                    class={`w-7 h-7 rounded-full border-2 cursor-pointer transition-all flex-shrink-0 ${
                      isSelected()
                        ? "border-[var(--color-primary)] scale-110 shadow-sm"
                        : "border-transparent hover:scale-105"
                    }`}
                    style={{ "background-color": color }}
                  />
                );
              }}
            </For>
            <Show when={props.availableColors().hasNoColor}>
              <button
                onClick={() => toggleColor("none")}
                title="No color"
                class={`w-7 h-7 rounded-full border-2 cursor-pointer transition-all flex-shrink-0 bg-elevated flex items-center justify-center ${
                  props.filterColors().includes("none")
                    ? "border-[var(--color-primary)] scale-110 shadow-sm"
                    : "border-base hover:scale-105"
                }`}
              >
                <div class="i-carbon-close-outline w-3.5 h-3.5 text-muted-body" />
              </button>
            </Show>
          </div>
        </div>
      </Show>
    </div>
  );
}
