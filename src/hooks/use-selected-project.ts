import { ProjectContext } from "@/context/project-context";
import { useContext } from "react";

export const useSelectedProject = () => {
    const context = useContext(ProjectContext);
    return context;
};