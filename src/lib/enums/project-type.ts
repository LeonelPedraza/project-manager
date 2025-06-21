export type ProjectType =
    | "GENERIC"
    | "SOFTWARE"
    | "MARKETING"
    | "DESIGN"
    | "RESEARCH"
    | "BUSINESS"
    | "OTHER";

export const ProjectType = {
    GENERIC: "GENERIC",
    SOFTWARE: "SOFTWARE",
    MARKETING: "MARKETING",
    DESIGN: "DESIGN",
    RESEARCH: "RESEARCH",
    BUSINESS: "BUSINESS",
    OTHER: "OTHER",
} as const;