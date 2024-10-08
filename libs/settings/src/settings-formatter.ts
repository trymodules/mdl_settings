export interface SettingsFormatter {
  /**
   * The name of the formatter
   */
  readonly NAME: Symbol;

  /**
   * Serialize the data to a string
   * @param data The data to serialize
   */
  serialize<T>(data: T | null | undefined): string;

  /**
   * Deserialize the data from a string
   * @param data Serialized data
   */
  deserialize<T>(data: string | null | undefined): T;
}
