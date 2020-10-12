import { ApplicationSearchPlugin } from "../plugins/application-search-plugin/application-search-plugin";
import { UserConfigOptions } from "../../common/config/user-config-options";
import { UeliCommandSearchPlugin } from "../plugins/ueli-command-search-plugin/ueli-command-search-plugin";
import { ShortcutsSearchPlugin } from "../plugins/shortcuts-search-plugin/shortcuts-search-plugin";
import { homedir } from "os";
import { openUrlInBrowser } from "../executors/url-executor";
import { getExecuteFilePath } from "../executors/file-path-executor";
import { SearchEngine } from "../search-engine";
import { EverythingPlugin } from "../plugins/everything-plugin/everthing-plugin";
import { SearchPlugin } from "../search-plugin";
import { ExecutionPlugin } from "../execution-plugin";
import { MdFindPlugin } from "../plugins/mdfind-plugin/mdfind-plugin";
import { TranslationPlugin } from "../plugins/translation-plugin/translation-plugin";
import { openFileLocation } from "../executors/file-path-location-executor";
import { TranslationSet } from "../../common/translation/translation-set";
import { WebSearchPlugin } from "../plugins/websearch-plugin/websearch-plugin";
import { FileBrowserExecutionPlugin } from "../plugins/filebrowser-plugin/filebrowser-plugin";
import { getPathValidator } from "../../common/helpers/file-path-validators";
import { getFileIconDataUrl } from "../../common/icon/generate-file-icon";
import { OperatingSystemCommandsPlugin } from "../plugins/operating-system-commands-plugin/operating-system-commands-plugin";
import { MacOsOperatingSystemCommandRepository } from "../plugins/operating-system-commands-plugin/mac-os-operating-system-command-repository";
import { WindowsOperatingSystemCommandRepository } from "../plugins/operating-system-commands-plugin/windows-operating-system-command-repository";
import { CalculatorPlugin } from "../plugins/calculator-plugin/calculator-plugin";
import { electronClipboardCopier } from "../executors/electron-clipboard-copier";
import { UrlPlugin } from "../plugins/url-plugin/url-plugin";
import { EmailPlugin } from "../plugins/email-plugin/email-plugin";
import { ElectronStoreFavoriteRepository } from "../favorites/electron-store-favorite-repository";
import { CurrencyConverterPlugin } from "../plugins/currency-converter-plugin/currency-converter-plugin";
import { executeCommand } from "../executors/command-executor";
import { WorkflowPlugin } from "../plugins/workflow-plugin/workflow-plugin";
import { CommandlinePlugin } from "../plugins/commandline-plugin/commandline-plugin";
import { getCommandlineExecutor } from "../executors/commandline-executor";
import { OperatingSystemSettingsPlugin } from "../plugins/operating-system-settings-plugin/operating-system-settings-plugin";
import { MacOsOperatingSystemSettingRepository } from "../plugins/operating-system-settings-plugin/macos-operating-system-setting-repository";
import { getOperatingSystemSettingExecutor } from "../executors/operating-system-setting-executor";
import { WindowsOperatingSystemSettingRepository } from "../plugins/operating-system-settings-plugin/windows-operating-system-setting-repository";
import { SimpleFolderSearchPlugin } from "../plugins/simple-folder-search-plugin/simple-folder-search-plugin";
import { Logger } from "../../common/logger/logger";
import { UwpPlugin } from "../plugins/uwp-plugin/uwp-plugin";
import { ColorConverterPlugin } from "../plugins/color-converter-plugin/color-converter-plugin";
import { ProductionApplicationRepository } from "../plugins/application-search-plugin/production-application-repository";
import { getDefaultAppIcon } from "../../common/icon/default-icons";
import { ApplicationIconService } from "../plugins/application-search-plugin/application-icon-service";
// import { generateWindowsAppIcons } from "../plugins/application-search-plugin/windows-app-icon-generator";
import { generateLinuxAppIcons } from "../plugins/application-search-plugin/linux-app-icon-generator";
import { gettFileSearcher } from "../executors/file-searchers";
import { getApplicationsSearcher } from "../executors/application-searcher";
// import { generateMacAppIcons } from "../plugins/application-search-plugin/mac-os-app-icon-generator";
import { DictionaryPlugin } from "../plugins/dictionary-plugin/dictionary-plugin";
import { BrowserBookmarksPlugin } from "../plugins/browser-bookmarks-plugin/browser-bookmarks-plugin";
import { GoogleChromeBookmarkRepository } from "../plugins/browser-bookmarks-plugin/google-chrome-bookmark-repository";
import { ControlPanelPlugin } from "../plugins/control-panel-plugin/control-panel-plugin";
import { getAllUwpApps } from "../plugins/uwp-plugin/uwp-apps-retriever";
import { getGoogleDictionaryDefinitions } from "../plugins/dictionary-plugin/google-dictionary-definition-retriever";
import { everythingSearcher } from "../plugins/everything-plugin/everything-searcher";
import { mdfindSearcher } from "../plugins/mdfind-plugin/mdfind-searcher";
import { OperatingSystem, OperatingSystemVersion } from "../../common/operating-system";
import { BraveBookmarkRepository } from "../plugins/browser-bookmarks-plugin/brave-bookmark-repository";

export function getProductionSearchEngine(
    operatingSystem: OperatingSystem,
    operatingSystemVersion: OperatingSystemVersion,
    config: UserConfigOptions,
    translationSet: TranslationSet,
    logger: Logger,
): SearchEngine {
    const filePathValidator = getPathValidator(operatingSystem);
    const filePathExecutor = getExecuteFilePath(operatingSystem);
    const filePathLocationExecutor = openFileLocation;
    const urlExecutor = openUrlInBrowser;
    const commandlineExecutor = getCommandlineExecutor(operatingSystem);
    const operatingSystemSettingsRepository = operatingSystem === OperatingSystem.Windows ? new WindowsOperatingSystemSettingRepository() : new MacOsOperatingSystemSettingRepository(); // TODO: Add linux here
    const operatingSystemSettingExecutor = getOperatingSystemSettingExecutor(operatingSystem);
    const applicationSearcher = getApplicationsSearcher(operatingSystem);
    const appIconGenerator = generateLinuxAppIcons; // TODO: Add linux here
    const defaultAppIcon = getDefaultAppIcon(operatingSystem);
    const fileSearcher = gettFileSearcher(operatingSystem);

    let chromeBookmarksFilePath;
    let braveBookmarksFilePath;
    if (operatingSystem === OperatingSystem.Windows) {
        chromeBookmarksFilePath = `${homedir()}\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Bookmarks`;
        braveBookmarksFilePath = `${homedir()}\\AppData\\Local\\BraveSoftware\\Brave-Browser\\User Data\\Default\\Bookmarks`;
    } else if (operatingSystem === OperatingSystem.macOS) {
        chromeBookmarksFilePath = `${homedir()}/Library/Application\ Support/Google/Chrome/Default/Bookmarks`
        braveBookmarksFilePath = `${homedir()}/Library/Application\ Support/BraveSoftware/Brave-Browser/Default/Bookmarks`
    } else {
        chromeBookmarksFilePath = `${homedir()}/.config/google-chrome/Default`
        braveBookmarksFilePath = `${homedir()}/.config/BraveSoftware/Brave-Browser/Default`
    }

    const operatingSystemCommandRepository = operatingSystem === OperatingSystem.Windows // TODO: Add linux here
        ? new WindowsOperatingSystemCommandRepository(translationSet)
        : new MacOsOperatingSystemCommandRepository(translationSet);

    const searchPlugins: SearchPlugin[] = [
        new UeliCommandSearchPlugin(translationSet),
        new ShortcutsSearchPlugin(
            config.shortcutOptions,
            urlExecutor,
            filePathExecutor,
            filePathLocationExecutor,
            executeCommand,
        ),
        new ApplicationSearchPlugin(
            config.applicationSearchOptions,
            new ProductionApplicationRepository(
                config.applicationSearchOptions,
                defaultAppIcon,
                new ApplicationIconService(
                    appIconGenerator,
                    logger,
                ),
                applicationSearcher,
                logger,
                operatingSystemVersion
            ),
            filePathExecutor,
            filePathLocationExecutor,
        ),
        new OperatingSystemCommandsPlugin(
            config.operatingSystemCommandsOptions,
            operatingSystemCommandRepository,
            executeCommand,
        ),
        new OperatingSystemSettingsPlugin(
            config.operatingSystemSettingsOptions,
            translationSet,
            operatingSystemSettingsRepository,
            operatingSystemSettingExecutor,
        ),
        new WorkflowPlugin(
            config.workflowOptions,
            filePathExecutor,
            urlExecutor,
            executeCommand,
        ),
        new SimpleFolderSearchPlugin(
            config.simpleFolderSearchOptions,
            fileSearcher,
            filePathExecutor,
            filePathLocationExecutor,
        ),
        new BrowserBookmarksPlugin(
            config.browserBookmarksOptions,
            translationSet,
            [
              new GoogleChromeBookmarkRepository(chromeBookmarksFilePath),
              new BraveBookmarkRepository(braveBookmarksFilePath),
            ],
            urlExecutor,
        ),
    ];

    const webSearchPlugin = new WebSearchPlugin(config.websearchOptions, translationSet, urlExecutor);

    const executionPlugins: ExecutionPlugin[] = [
        webSearchPlugin,
        new FileBrowserExecutionPlugin(
            config.fileBrowserOptions,
            filePathValidator,
            filePathExecutor,
            filePathLocationExecutor,
            getFileIconDataUrl,
        ),
        new TranslationPlugin(config.translationOptions, electronClipboardCopier),
        new CalculatorPlugin(config.calculatorOptions, translationSet, electronClipboardCopier),
        new UrlPlugin(config.urlOptions, translationSet, urlExecutor),
        new EmailPlugin(config.emailOptions, translationSet, urlExecutor),
        new CurrencyConverterPlugin(config.currencyConverterOptions, translationSet, electronClipboardCopier),
        new CommandlinePlugin(config.commandlineOptions, translationSet, commandlineExecutor, logger),
        new ColorConverterPlugin(config.colorConverterOptions, electronClipboardCopier),
        new DictionaryPlugin(config.dictionaryOptions, electronClipboardCopier, getGoogleDictionaryDefinitions),
    ];

    const fallbackPlugins: ExecutionPlugin[] = [
        webSearchPlugin,
    ];

    if (operatingSystem === OperatingSystem.Windows) {
        executionPlugins.push(
            new EverythingPlugin(
                config.everythingSearchOptions,
                filePathExecutor,
                filePathLocationExecutor,
                everythingSearcher
            ),
        );
        searchPlugins.push(
            new UwpPlugin(
                config.uwpSearchOptions,
                filePathExecutor,
                getAllUwpApps
            ),
        );
        searchPlugins.push(
            new ControlPanelPlugin(
                config.controlPanelOptions));
    }
    if (operatingSystem === OperatingSystem.macOS) {
        executionPlugins.push(
            new MdFindPlugin(
                config.mdfindOptions,
                filePathExecutor,
                filePathLocationExecutor,
                mdfindSearcher
            ),
        );
    }

    return new SearchEngine(
        searchPlugins,
        executionPlugins,
        fallbackPlugins,
        config.searchEngineOptions,
        config.generalOptions.logExecution,
        translationSet,
        new ElectronStoreFavoriteRepository(),
    );
}
