import { homedir, platform } from "os";
import { getCurrentOperatingSystem } from "../helpers/operating-system-helpers";
import { OperatingSystem } from "../operating-system";

export interface ApplicationSearchOptions {
    applicationFolders: string[];
    applicationFileExtensions: string[];
    enabled: boolean;
    showFullFilePath: boolean;
    useNativeIcons: boolean;
}

const windowsApplicationSearchOptions: ApplicationSearchOptions = {
    applicationFileExtensions: [".lnk", ".appref-ms", ".url", ".exe"],
    applicationFolders: [
        "C:\\ProgramData\\Microsoft\\Windows\\Start Menu\\Programs",
        `${homedir()}\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu`,
        `${homedir()}\\Desktop`,
    ],
    enabled: true,
    showFullFilePath: false,
    useNativeIcons: true,
};

const macOsApplicationSearchOptions: ApplicationSearchOptions = {
    applicationFileExtensions: [".app"],
    applicationFolders: [
        "/Applications",
        "/System/Library/CoreServices",
        `${homedir()}/Applications`,
    ],
    enabled: true,
    showFullFilePath: false,
    useNativeIcons: true,
};

const linuxApplicationSearchOptions: ApplicationSearchOptions = {
    applicationFileExtensions: [".desktop"],
    applicationFolders: [
        "/usr/share/applications",
      // `${homedir()}/local/share/applications`,
    ],
    enabled: true,
    showFullFilePath: false,
    useNativeIcons: true,
};

function getSearchOptions(currentOperatingSystem: OperatingSystem) {
    switch (currentOperatingSystem) {
        case OperatingSystem.Windows: 
            return windowsApplicationSearchOptions; 
        case OperatingSystem.macOS:
            return macOsApplicationSearchOptions;
        case OperatingSystem.linux:
            return linuxApplicationSearchOptions;
        default:
            throw new Error("Operating system not found!");
    }
}

export const defaultApplicationSearchOptions = 
    getSearchOptions(getCurrentOperatingSystem(platform()));
