import { executeCommand } from "./command-executor";
import { shell } from "electron";
import { OperatingSystem } from "../../common/operating-system";

export function executeFilePathWindows(filePath: string, privileged: boolean): Promise<void> {
    return privileged
        ? executeFilePathWindowsAsPrivileged(filePath)
        : openFile(filePath);
}

export function executeFilePathMacOs(filePath: string, privileged: boolean): Promise<void> {
    return privileged
        ? executeFilePathMacOsAsPrivileged(filePath)
        : openFile(filePath);
}

export function executeFilePathLinux(filePath: string, privileged: boolean): Promise<void> {
    return privileged
        ? executeFilePathLinuxAsPrivileged(filePath)
        : openFile(filePath);
}

export function getExecuteFilePath(operatingSystem: OperatingSystem) {
    switch (operatingSystem) {
        case OperatingSystem.Windows: 
            return executeFilePathWindows;
        case OperatingSystem.macOS:
            return executeFilePathMacOs;
        case OperatingSystem.linux:
            return executeFilePathLinux;
        default:
            throw new Error("Operating System not found!")
    }
}

function openFile(filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const result = shell.openItem(filePath);
        if (result) {
            resolve();
        } else {
            reject(`Failed to open: ${filePath}`);
        }
    });
}

function executeFilePathWindowsAsPrivileged(filePath: string): Promise<void> {
    return executeCommand(`powershell -Command "& {Start-Process -Verb runas '${filePath}'}"`);
}

function executeFilePathMacOsAsPrivileged(filePath: string): Promise<void> {
    return executeCommand(`osascript -e 'do shell script "open \\"${filePath}\\"" with administrator privileges'`);
}

function executeFilePathLinuxAsPrivileged(filePath: string): Promise<void> {
    return executeCommand(`sudo xdg-open ${filePath}`);
}
