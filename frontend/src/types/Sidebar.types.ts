import type { Document } from "~/lib/api";

// SidebarProps is intentionally empty — Sidebar reads all state and callbacks
// from AppLayoutContext via useAppLayout() and derives navigation from useNavigate().
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SidebarProps {}

export interface TreeNode extends Document {
  children: TreeNode[];
  depth: number;
}
