import { TaskDefinition } from "@/types/experimentConfig";
import { Href, RelativePathString } from "expo-router";

export class RoutingService {

    /**
     * Gets the correct pathname string for a given task definition.
     * This is the single source of truth for the path.
     * Used by NotificationService.
     */
    static getTaskPathname(task: TaskDefinition): RelativePathString {
        switch (task.type) {
            case "screen":
                return task.path_to_screen as RelativePathString;
            case "survey":
                return '/survey' as RelativePathString;
            case "web":
                return '/web' as RelativePathString;
            default:
                console.warn(`getTaskPathname: Unknown task type for task ${task}`);
                return '/' as RelativePathString; // Default to home as a fallback
        }
    }

    /**
     * Gets the full Href object (pathname + params) for a task.
     * Used for all navigation (e.g., ToDoList, completeTask).
     */
    static getTaskHref(task: TaskDefinition): Href {
        const pathname = this.getTaskPathname(task);
        return { pathname, params: { taskId: task.id } };
    }
}
