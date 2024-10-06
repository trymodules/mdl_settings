export interface SharedSettingsParams {
  /**
   * The namespace of the settings to load/save.
   * Suggestion: follow app_name/env_name/module_name format. e.g. my_awesome_app/prod/my_module
   */
  namespace: string;
}

export interface LoadSettingsParams<TSettings = unknown>
  extends SharedSettingsParams {
  /**
   * The default settings to use if none are found
   */
  defaultVal?: TSettings;
}

export interface SaveSettingsParams<TSettings = unknown>
  extends SharedSettingsParams {
  /**
   * The settings to save
   */
  settings: TSettings;
}

export interface DeleteSettingsParams extends SharedSettingsParams {}

export interface SettingsProvider<TSettings = unknown> {
  /**
   * The name of the provider
   */
  readonly NAME: Symbol;

  /**
   * Load settings from the storage
   * @param params The parameters to load the settings
   */
  load(params: LoadSettingsParams<TSettings>): Promise<TSettings | undefined>;

  /**
   * Save settings to the storage
   * @param params The parameters to save the settings
   */
  save(params: SaveSettingsParams<TSettings>): Promise<void>;

  /**
   * Delete settings from the storage
   * @param params The parameters to delete the settings
   */
  delete(params: SharedSettingsParams): Promise<void>;
}
