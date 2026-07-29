import { $markSchema } from "@milkdown/utils";

export const fontSizeSchema = $markSchema("fontSize", () => {
  return {
    attrs: {
      size: {
        default: null,
        validate: "string|null",
      },
    },
    parseDOM: [
      {
        tag: "span[data-font-size]",
        getAttrs: (node: HTMLElement) => ({
          size: node.style.fontSize || null,
        }),
      },
      {
        // Also match spans with font-size from clipboard paste
        tag: "span",
        getAttrs: (node: HTMLElement) => {
          const size = node.style.fontSize;
          return size ? { size } : false;
        },
        priority: 10,
      },
    ],
    toDOM: (mark) => [
      "span",
      {
        style: `font-size: ${mark.attrs.size}`,
        "data-font-size": mark.attrs.size || "",
      },
    ],
    parseMarkdown: {
      match: (node) => node.type === "fontSize",
      runner: (state, node, markType) => {
        const size = (node as any).data?.size;
        state.openMark(markType, { size });
        state.next(node.children);
        state.closeMark(markType);
      },
    },
    toMarkdown: {
      match: (node) => node.type.name === "fontSize",
      runner: (state, mark) => {
        state.withMark(mark, "fontSize", undefined, {
          data: { size: mark.attrs.size },
        });
      },
    },
  };
});
