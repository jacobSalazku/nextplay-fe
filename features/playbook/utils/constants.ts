import { Dribbble, Move, Pencil, Shield, Target } from "lucide-react";

export const initialPlayerPosition = [
  {
    id: "PG",
    position: "PG",
    x: 297,
    y: 131,
    color: "#3b82f6",
  },
  {
    id: "SG",
    position: "SG",
    x: 96,
    y: 195,
    color: "#10b981",
  },
  {
    id: "SF",
    position: "SF",
    x: 501,
    y: 193,
    color: "#f59e0b",
  },
  {
    id: "PF",
    position: "PF",
    x: 217,
    y: 341,
    color: "#8b5cf6",
  },
  {
    id: "C",
    position: "C",
    x: 370,
    y: 335,
    color: "#ef4444",
  },
];

export const tools = [
  { id: "move", icon: Move, label: "Player" },
  { id: "draw", icon: Pencil, label: "Draw" },
];

export const colors = [
  "#f97316", // orange
  "#ef4444", // red
  "#3b82f6", // blue
  "#10b981", // green
  "#f59e0b", // yellow
  "#8b5cf6", // purple
  "#000000", // black
  "#666666", // gray
];

export const categories = [
  { id: "offense", label: "Offense", value: "OFFENSE" },
  { id: "defense", label: "Defense", value: "DEFENSE" },
  { id: "special", label: "Special", value: "SPECIAL" },
];

export const categoriesFilter = [
  {
    id: "offense",
    label: "Offense",
    icon: Dribbble,
    gradient: "bg-gradient-to-bl from-orange-500 to-orange-950",
    border: "border-orange-800/30",
    count: 12,
  },
  {
    id: "defense",
    label: "Defense",
    icon: Shield,
    gradient: "bg-gradient-to-bl from-blue-500 to-blue-950",
    border: "border-blue-800/30",
    count: 8,
  },

  {
    id: "special",
    label: "Special",
    icon: Target,
    gradient: "bg-gradient-to-bl from-purple-500 to-purple-950",
    border: "border-purple-800/30",
    count: 3,
  },
];
