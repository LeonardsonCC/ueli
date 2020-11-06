import { homedir } from "os";
import { join } from "path";
import { FileHelpers } from "../../../common/helpers/file-helpers";
import { applicationIconLocation, getApplicationIconFilePath } from "./application-icon-helpers";
//import { existsSync } from "fs";
// import { executeCommand, executeCommandWithOutput } from "../../executors/command-executor";

export function generateLinuxAppIcons(applicationFilePaths: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
        if (applicationFilePaths.length === 0) {
            resolve();
        }

        FileHelpers.fileExists(applicationIconLocation)
            .then((fileExistsResult) => {
                if (!fileExistsResult.fileExists) {
                    FileHelpers.createFolderSync(applicationIconLocation);
                }

                Promise.all (applicationFilePaths.map((application) => {
                    console.log("DEBUG: getApp, app", getApplicationIconFilePath(application), application)
                    getIconFilePath(application)
                })) // TODO: Retirar o console.log
                    .then(() => resolve())
                    .catch((err) => reject(err));
            })
            .catch((err) => reject(err));
    });
}

function getIconFilePath(applicationDesktopFile: string): string {
    const defaultIconsPath = getIconsPath();
    applicationDesktopFile;

    return defaultIconsPath[0];
}

function getIconsPath(): string[] {
    return [
        '/usr/share/icons/',
        '/usr/local/share/icons/',
        '/usr/share/pixmaps/',
        '/usr/local/share/pixmaps/',
        join(homedir(), '.icons/'),
        join(homedir(), '.local/share/icons/'),
        join(homedir(), '.local/share/pixmaps/'),
        join(homedir(), '.pixmaps/')
    ]
}
