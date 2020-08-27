import { executeFilePathMacOs, executeFilePathWindows, executeFilePathLinux } from "./file-path-executor";
import { OperatingSystem } from "../../common/operating-system";

export function executeMacOSOperatingSystemSetting(executionArgument: string): Promise<void> {
    return executeFilePathMacOs(executionArgument, false);
}

export function executeWindowsOperatingSystemSetting(executionArgument: string): Promise<void> {
    return executeFilePathWindows(executionArgument, false);
}

export function executeLinuxOperatingSystemSetting(executionArgument: string): Promise<void> {
    return executeFilePathLinux(executionArgument, false);
}

export function getOperatingSystemSettingExecutor(operatingSystem: OperatingSystem) {
    switch (operatingSystem) {
        case OperatingSystem.Windows: 
            return executeWindowsOperatingSystemSetting;
        case OperatingSystem.macOS:
            return executeMacOSOperatingSystemSetting;
        case OperatingSystem.linux:
            return executeLinuxOperatingSystemSetting;
        default:
            throw new Error("Operating System not found!")
    }
}
