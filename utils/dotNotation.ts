export function getNestedValue<T, P extends string>(obj: T, path: P): any {
    return path.split('.').reduce((acc, key) => acc?.[key], obj as any);
}

export function hasNestedKey(obj: any, path: string): boolean {
    return path.split('.').every(key => {
        if (obj != null && key in obj) {
            obj = obj[key];
            return true;
        }
        return false;
    });
}
