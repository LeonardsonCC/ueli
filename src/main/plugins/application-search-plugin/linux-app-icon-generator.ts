import { FileHelpers } from "../../../common/helpers/file-helpers";
import { applicationIconLocation, getApplicationIconFilePath } from "./application-icon-helpers";
import {executeCommandWithOutput, executeCommand} from "../../executors/command-executor";
//import { existsSync } from "fs";
// import { executeCommand, executeCommandWithOutput } from "../../executors/command-executor";

export function generateLinuxAppIcons(applicationFilePaths: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
        if (applicationFilePaths.length === 0) {
            resolve();
        }
        console.log("TESTE");

        FileHelpers.fileExists(applicationIconLocation)
            .then((fileExistsResult) => {
                if (!fileExistsResult.fileExists) {
                    FileHelpers.createFolderSync(applicationIconLocation);
                }

                Promise.all (applicationFilePaths.map((application) => {
                    //console.log("DEBUG: getApp, app", getApplicationIconFilePath(application), application)
                    generateIconCache(getApplicationIconFilePath(application), application);
                })) // TODO: Retirar o console.log
                    .then(() => resolve())
                    .catch((err) => reject(err));
            })
            .catch((err) => reject(err));
    });
}

function generateIconCache(destinationPath: string, applicationBinaryFile: string): void {
    executeCommandWithOutput(`grep -lri "${applicationBinaryFile}" /usr/share/applications/`)
        .then((desktopFiles) => {
            const desktopFilesList = desktopFiles.split("\n");
            let desktopFile: null|string = null;
            if (desktopFiles.length > 0) desktopFile = desktopFilesList[0];

            executeCommandWithOutput(`cat ${desktopFile} | grep -oP  "(?<=Icon=).*"`)
                .then((iconName) => {
                    iconName = iconName.replace("\n", "");
                    if (iconName != "") {
                        // TODO: TEMA GTK do usuário (gsettings get org.gnome.desktop.interface gtk-theme)
                        executeCommandWithOutput(`find /usr/share/icons/ -name "${iconName}.*"`)
                            .then((iconFiles) => {
                                console.log(`find /usr/share/icons/ -name "${iconName}.*"`, iconFiles);
                                const iconFilesList = iconFiles.split("\n");
                                if (iconFilesList.length > 0) {
                                   const iconPath = iconFilesList[0];
                                   executeCommand(`cp ${iconPath} ${destinationPath}`)
                                        .then(() => {
                                            console.log("Sucesso ao gerar cache");
                                        })
                                        .catch((err) => {
                                            console.log("Erro ao gerar cache", err);
                                        })
                                }
                            })
                            .catch((err) => {
                                console.log("erro ao buscar icone", err);
                            })
                    }
                })
                .catch((err) => {
                    console.log("Ícone não encontrado", desktopFile);
                });
        })
        .catch((err) => {
            console.log("erro ao buscar arquivos", err);
        })

}

