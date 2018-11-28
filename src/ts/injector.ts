import { OperatingSystem } from "./operating-system";
import { MacOsSettingsPlugin } from "./search-plugins/mac-os-settings-plugin";
import { SearchPlugin } from "./search-plugins/search-plugin";
import { Windows10SettingsSearchPlugin } from "./search-plugins/windows-10-settings-plugin";
import { DirectorySeparator } from "./directory-separator";
import { FileExecutionCommandBuilder } from "./builders/file-execution-command-builder";
import { FileLocationExecutionCommandBuilder } from "./builders/file-location-execution-command-builder";
import { FilePathRegex } from "./file-path-regex";
import { OpenUrlWithDefaultBrowserCommandBuilder } from "./builders/open-url-with-default-browser-command-builder";
import { TrayIconPathBuilder } from "./builders/tray-icon-path-builder";
import { OperatingSystemHelpers } from "./helpers/operating-system-helpers";
import { IconSet } from "./icon-sets/icon-set";
import { allWindowsSettings } from "./operating-system-settings/windows/windows-settings";
import { allWindows10Apps } from "./operating-system-settings/windows/windows-10-apps";
import { allMacOsSettings } from "./operating-system-settings/macos/mac-os-settings";

export class Injector {
  public static getWebUrlRegExp(): RegExp {
    return new RegExp(/^((https?:)?[/]{2})?([a-z0-9]+[.])+[a-z]{2,}.*$/i, "gi");
  }

  public static getOpenUrlWithDefaultBrowserCommand(platform: string, url: string): string {
    switch (OperatingSystemHelpers.getOperatingSystemFromString(platform)) {
      case OperatingSystem.Windows:
        return OpenUrlWithDefaultBrowserCommandBuilder.buildWindowsCommand(url);
      case OperatingSystem.macOS:
        return OpenUrlWithDefaultBrowserCommandBuilder.buildMacCommand(url);
    }
  }

  public static getFileExecutionCommand(platform: string, filePath: string): string {
    switch (OperatingSystemHelpers.getOperatingSystemFromString(platform)) {
      case OperatingSystem.Windows:
        return FileExecutionCommandBuilder.buildWindowsFileExecutionCommand(filePath);
      case OperatingSystem.macOS:
        return FileExecutionCommandBuilder.buildMacOsFileExecutionCommand(filePath);
    }
  }

  public static getFileLocationExecutionCommand(platform: string, filePath: string): string {
    switch (OperatingSystemHelpers.getOperatingSystemFromString(platform)) {
      case OperatingSystem.Windows:
        return FileLocationExecutionCommandBuilder.buildWindowsLocationExecutionCommand(filePath);
      case OperatingSystem.macOS:
        return FileLocationExecutionCommandBuilder.buildMacOsLocationExecutionCommand(filePath);
    }
  }

  public static getFilePathRegExp(platform: string): RegExp {
    const globalAndIgnoreCaseRegexOption = "gi";

    switch (OperatingSystemHelpers.getOperatingSystemFromString(platform)) {
      case OperatingSystem.Windows: return new RegExp(FilePathRegex.windowsFilePathRegExp, globalAndIgnoreCaseRegexOption);
      case OperatingSystem.macOS: return new RegExp(FilePathRegex.macOsFilePathRegexp, globalAndIgnoreCaseRegexOption);
    }
  }

  public static getDirectorySeparator(platform: string): DirectorySeparator {
    switch (OperatingSystemHelpers.getOperatingSystemFromString(platform)) {
      case OperatingSystem.Windows: return DirectorySeparator.WindowsDirectorySeparator;
      case OperatingSystem.macOS: return DirectorySeparator.macOsDirectorySeparator;
    }
  }

  public static getTrayIconPath(operatingSystem: OperatingSystem, pathToProjectRoot: string): string {
    switch (operatingSystem) {
      case OperatingSystem.Windows:
        return TrayIconPathBuilder.buildWindowsTrayIconPath(pathToProjectRoot);
      case OperatingSystem.macOS:
        return TrayIconPathBuilder.buildMacOsTrayIconPath(pathToProjectRoot);
    }
  }

  public static getOperatingSystemSettingsPlugin(platform: string, iconSet: IconSet): SearchPlugin {
    switch (OperatingSystemHelpers.getOperatingSystemFromString(platform)) {
      case OperatingSystem.Windows: return new Windows10SettingsSearchPlugin(allWindowsSettings, allWindows10Apps, iconSet);
      case OperatingSystem.macOS: return new MacOsSettingsPlugin(allMacOsSettings, iconSet);
    }
  }
}
