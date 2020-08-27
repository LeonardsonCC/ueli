import { win32 } from "path";
import { OperatingSystem } from "../../common/operating-system";

export function isValidWindowsFilePath(filePath: string): boolean {
    filePath = win32.normalize(filePath);
    return /^(([a-zA-Z]:\\)|(\\{2}))[\\\S|*\S]?.*$/.test(filePath);
}

export function isValidMacOsFilePath(filePath: string): boolean {
    return /^\/$|(^(?=\/)|^\.|^\.\.)(\/(?=[^/\0])[^/\0]+)*\/?$/.test(filePath);
}

export function isValidLinuxFilePath(filePath: string): boolean {
    return /^\/$|(^(?=\/)|^\.|^\.\.)(\/(?=[^/\0])[^/\0]+)*\/?$/.test(filePath);
}

export function getPathValidator(operatingSystem: OperatingSystem) {
    switch (operatingSystem) {
        case OperatingSystem.Windows: 
            return isValidWindowsFilePath;
        case OperatingSystem.macOS:
            return isValidMacOsFilePath;
        case OperatingSystem.linux:
            return isValidLinuxFilePath;
        default:
            throw new Error("Operating System not found!")
    }
}
