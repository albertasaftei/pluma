import { createSignal, createMemo } from "solid-js";
import type { Accessor } from "solid-js";
import { buildDocumentTree, buildFolderTree } from "~/utils/sidebar.utils";
import { api } from "~/lib/api";
import type { Document } from "~/lib/api";
import type { Tag } from "~/types/Tag.types";
import type { TreeNode } from "~/types/Sidebar.types";

/**
 * Reactive primitive for sidebar filter state.
 * Accepts a getter for the document list so that derived memos
 * (tree, filteredTree, availableColors, etc.) stay reactive to the
 * same source without needing to call useAppLayout() internally.
 */
export function createSidebarFilterState(getDocuments: Accessor<Document[]>) {
  const [tags, setTags] = createSignal<Tag[]>([]);
  const [selectedFilterTags, setSelectedFilterTags] = createSignal<number[]>(
    [],
  );
  const [filterMode, setFilterMode] = createSignal<"any" | "all">("any");
  const [tagMappings, setTagMappings] = createSignal<Record<string, number[]>>(
    {},
  );
  const [filterModifiedFrom, setFilterModifiedFrom] = createSignal("");
  const [filterModifiedTo, setFilterModifiedTo] = createSignal("");
  const [filterCreatedFrom, setFilterCreatedFrom] = createSignal("");
  const [filterCreatedTo, setFilterCreatedTo] = createSignal("");
  const [filterFavorite, setFilterFavorite] = createSignal(false);
  const [filterColors, setFilterColors] = createSignal<string[]>([]);

  // --- Derived memos ---

  const tree = createMemo(() => buildDocumentTree(getDocuments()));

  const availableColors = createMemo(() => {
    const colors = new Set<string>();
    let hasNoColor = false;
    for (const doc of getDocuments()) {
      if (doc.type === "file") {
        if (doc.color) colors.add(doc.color);
        else hasNoColor = true;
      }
    }
    return { colors: [...colors], hasNoColor };
  });

  const activeFilterCount = createMemo(() => {
    let count = selectedFilterTags().length;
    if (filterModifiedFrom()) count++;
    if (filterModifiedTo()) count++;
    if (filterCreatedFrom()) count++;
    if (filterCreatedTo()) count++;
    if (filterFavorite()) count++;
    count += filterColors().length;
    return count;
  });

  const filteredTree = createMemo(() => {
    const currentTree = tree();
    const filterTags = selectedFilterTags();
    const modFrom = filterModifiedFrom();
    const modTo = filterModifiedTo();
    const createdFrom = filterCreatedFrom();
    const createdTo = filterCreatedTo();
    const favOnly = filterFavorite();
    const colors = filterColors();

    const hasTagFilter = filterTags.length > 0;
    const hasDateFilter = modFrom || modTo || createdFrom || createdTo;
    const hasFavFilter = favOnly;
    const hasColorFilter = colors.length > 0;

    if (!hasTagFilter && !hasDateFilter && !hasFavFilter && !hasColorFilter) {
      return currentTree;
    }

    const mappings = tagMappings();
    const mode = filterMode();

    const filterNode = (node: TreeNode): TreeNode | null => {
      if (node.type === "file") {
        if (hasTagFilter) {
          const docTags = mappings[node.path] || [];
          const tagMatch =
            mode === "any"
              ? filterTags.some((t) => docTags.includes(t))
              : filterTags.every((t) => docTags.includes(t));
          if (!tagMatch) return null;
        }

        if (modFrom || modTo) {
          const d = node.modified.slice(0, 10);
          if (modFrom && d < modFrom) return null;
          if (modTo && d > modTo) return null;
        }

        if (createdFrom || createdTo) {
          const d = (node.created_at ?? node.modified).slice(0, 10);
          if (createdFrom && d < createdFrom) return null;
          if (createdTo && d > createdTo) return null;
        }

        if (hasFavFilter && !node.favorite) return null;

        if (hasColorFilter) {
          const c = node.color ?? "none";
          if (!colors.includes(c)) return null;
        }

        return node;
      }

      const filteredChildren = node.children
        .map(filterNode)
        .filter((n): n is TreeNode => n !== null);

      if (filteredChildren.length > 0) {
        return { ...node, children: filteredChildren };
      }
      return null;
    };

    return currentTree.map(filterNode).filter((n): n is TreeNode => n !== null);
  });

  const folderOptions = createMemo(() => {
    const result: { path: string; label: string }[] = [
      { path: "/", label: "/ (root)" },
    ];

    const flatten = (nodes: ReturnType<typeof buildFolderTree>) => {
      for (const node of nodes) {
        const indent = "\u00A0\u00A0\u00A0\u00A0".repeat(node.depth);
        const prefix = node.depth > 0 ? `${indent}└─ ` : "";
        result.push({ path: node.path, label: `${prefix}${node.name}` });
        if (node.children.length > 0) flatten(node.children);
      }
    };

    flatten(buildFolderTree(getDocuments()));
    return result;
  });

  const refreshTags = async () => {
    try {
      const [tagsResult, mappingsResult] = await Promise.all([
        api.listTags(),
        api.getTagMappings(),
      ]);
      setTags(tagsResult.tags);
      setTagMappings(mappingsResult.mappings);
    } catch {
      // Tags might not be available yet.
    }
  };

  return {
    tags,
    setTags,
    selectedFilterTags,
    setSelectedFilterTags,
    filterMode,
    setFilterMode,
    tagMappings,
    setTagMappings,
    filterModifiedFrom,
    setFilterModifiedFrom,
    filterModifiedTo,
    setFilterModifiedTo,
    filterCreatedFrom,
    setFilterCreatedFrom,
    filterCreatedTo,
    setFilterCreatedTo,
    filterFavorite,
    setFilterFavorite,
    filterColors,
    setFilterColors,
    availableColors,
    activeFilterCount,
    filteredTree,
    folderOptions,
    refreshTags,
  };
}

/**
 * Reactive primitive for sidebar modal + form state.
 * Covers the new-doc, new-folder, rename, move, and filter modals,
 * plus the form fields associated with each.
 */
export function createSidebarModalState() {
  const getDefaultDocName = () => {
    const now = new Date();
    return `Note (${now.toLocaleDateString()}  ${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")})`;
  };

  const [showNewDocModal, setShowNewDocModal] = createSignal(false);
  const [showNewFolderModal, setShowNewFolderModal] = createSignal(false);
  const [showRenameModal, setShowRenameModal] = createSignal(false);
  const [showMoveModal, setShowMoveModal] = createSignal(false);
  const [showFilterModal, setShowFilterModal] = createSignal(false);

  const [newDocName, setNewDocName] = createSignal(getDefaultDocName());
  const [newFolderName, setNewFolderName] = createSignal("");
  const [newItemName, setNewItemName] = createSignal(getDefaultDocName());
  const [targetFolder, setTargetFolder] = createSignal<string>("/");
  const [itemToRename, setItemToRename] = createSignal<string | null>(null);
  const [itemToMove, setItemToMove] = createSignal<{
    path: string;
    name: string;
    type: "file" | "folder";
  } | null>(null);
  const [bulkMovePaths, setBulkMovePaths] = createSignal<string[]>([]);

  return {
    getDefaultDocName,
    showNewDocModal,
    setShowNewDocModal,
    showNewFolderModal,
    setShowNewFolderModal,
    showRenameModal,
    setShowRenameModal,
    showMoveModal,
    setShowMoveModal,
    showFilterModal,
    setShowFilterModal,
    newDocName,
    setNewDocName,
    newFolderName,
    setNewFolderName,
    newItemName,
    setNewItemName,
    targetFolder,
    setTargetFolder,
    itemToRename,
    setItemToRename,
    itemToMove,
    setItemToMove,
    bulkMovePaths,
    setBulkMovePaths,
  };
}
