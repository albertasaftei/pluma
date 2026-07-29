import type { Data, Processor } from "unified";
import { visit } from "unist-util-visit";
import type {
  Handle,
  Options as ToMarkdownExtension,
} from "mdast-util-to-markdown";
import type { Parent, Root } from "mdast";

declare module "mdast" {
  export interface FontSize extends Parent {
    type: "fontSize";
    data: {
      size: string;
    };
    children: PhrasingContent[];
  }

  interface StaticPhrasingContentMap {
    fontSize: FontSize;
  }

  interface PhrasingContentMap {
    fontSize: FontSize;
  }

  interface RootContentMap {
    fontSize: FontSize;
  }
}

// Captures the full style attribute value from any <span style="..."> tag
const SPAN_WITH_STYLE_RE = /^<span\s[^>]*style="([^"]*)"[^>]*>$/i;
// Extracts the font-size value from a style string
const FONT_SIZE_IN_STYLE_RE = /(?:^|;)\s*font-size:\s*([^;"]+)/i;
// Matches ANY span open tag (used for nesting depth tracking)
const ANY_SPAN_OPEN_RE = /^<span[\s>]/i;
const SPAN_CLOSE_RE = /^<\/span>$/i;

/**
 * Remark plugin to support font size via inline HTML spans.
 *
 * Parses:   <span style="font-size: 14px">text</span>
 * Produces: fontSize mdast node with { data: { size: "14px" } }
 *
 * Skips combined spans that also contain color: — remarkTextColor handles those.
 * Skips combined spans that also contain font-family: — remarkFontFamily handles those.
 *
 * Serializes back to: <span style="font-size: 14px">text</span>
 */
export function remarkFontSize(this: Processor) {
  const data = this.data();
  add(data, "toMarkdownExtensions", fontSizeToMarkdown);

  return (tree: Root) => {
    visit(tree, (node) => {
      const parent = node as unknown as Parent;
      if (!parent.children || !Array.isArray(parent.children)) return;

      let i = 0;
      while (i < parent.children.length) {
        const child = parent.children[i] as any;

        if (child.type !== "html") {
          i++;
          continue;
        }

        const spanMatch = child.value?.match(SPAN_WITH_STYLE_RE);
        if (!spanMatch) {
          i++;
          continue;
        }

        const styleAttr = spanMatch[1];

        // Skip combined spans — remarkTextColor and remarkFontFamily handle those
        if (/(?:^|;)\s*color:/i.test(styleAttr)) {
          i++;
          continue;
        }
        if (/(?:^|;)\s*font-family:/i.test(styleAttr)) {
          i++;
          continue;
        }

        const sizeMatch = styleAttr.match(FONT_SIZE_IN_STYLE_RE);
        if (!sizeMatch) {
          i++;
          continue;
        }

        const size = sizeMatch[1].trim();

        // Find the matching closing </span>, skipping over any nested spans
        let closeIdx = -1;
        let depth = 0;
        for (let j = i + 1; j < parent.children.length; j++) {
          const sibling = parent.children[j] as any;
          if (sibling.type === "html") {
            if (ANY_SPAN_OPEN_RE.test(sibling.value)) {
              depth++;
            } else if (SPAN_CLOSE_RE.test(sibling.value)) {
              if (depth === 0) {
                closeIdx = j;
                break;
              }
              depth--;
            }
          }
        }

        if (closeIdx === -1) {
          i++;
          continue;
        }

        // Grab everything between the open and close tags
        const children = parent.children.slice(i + 1, closeIdx) as any[];

        const fontSizeNode: any = {
          type: "fontSize",
          data: { size },
          children,
        };

        // Replace the open-tag, content, and close-tag with a single node
        parent.children.splice(i, closeIdx - i + 1, fontSizeNode);
        // Don't increment — re-visit in case of nested spans
      }
    });
  };
}

// ── Serializer ──────────────────────────────────────────────────────────────

const handleFontSize: Handle = (node, _, state, info) => {
  const size = (node as any).data?.size ?? "inherit";
  const tracker = state.createTracker(info);

  const open = `<span style="font-size: ${size}">`;
  const close = `</span>`;

  let value = tracker.move(open);
  value += tracker.move(
    state.containerPhrasing(node as any, {
      before: value,
      after: close,
      ...tracker.current(),
    }),
  );
  value += tracker.move(close);
  return value;
};

const fontSizeToMarkdown: ToMarkdownExtension = {
  unsafe: [],
  handlers: {
    fontSize: handleFontSize,
  },
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function add(
  data: Data,
  field: "toMarkdownExtensions",
  value: ToMarkdownExtension,
) {
  // @ts-ignore
  const list = (data[field] = data[field] || []);
  if (!list.includes(value)) list.push(value);
}
