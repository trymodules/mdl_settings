export interface Formatter {
  /**
   * Serialize the data to a string
   * @param data The data to serialize
   */
  serialize<T>(data: T): string;

  /**
   * Deserialize the data from a string
   * @param data Serialized data
   */
  deserialize<T>(data: string): T;
}
