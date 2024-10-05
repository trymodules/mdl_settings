export interface SharedSettingsParams {
  /**
   * The namespace of the settings to load/save (follow app_name.module_name)
   * e.g. my_awesome_app.my_module
   */
  namespace: string;
}

export interface LoadSettingsParams<TConfig = unknown>
  extends SharedSettingsParams {
  /**
   * The default settings to use if none are found
   */
  default?: TConfig;
}

export interface SaveSettingsParams<TConfig = unknown>
  extends SharedSettingsParams {
  /**
   * The settings to save
   */
  config: TConfig;
}

export interface SettingsProvider<TConfig = unknown> {
  /**
   * Load settings from the storage
   * @param params The parameters to load the settings
   */
  load(params: LoadSettingsParams<TConfig>): Promise<TConfig>;

  /**
   * Save settings to the storage
   * @param params The parameters to save the settings
   */
  save(params: SaveSettingsParams<TConfig>): Promise<void>;
}
