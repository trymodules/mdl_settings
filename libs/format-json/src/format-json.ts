import { SettingsFormatter } from '@trymodules/settings';

export class JsonFormatter implements SettingsFormatter {
  readonly NAME = Symbol('format-json');

  serialize<T>(data: T | null): string {
    return JSON.stringify(data ?? null);
  }

  deserialize<T>(data: string | null): T | null {
    // If the data is null or undefined, return null
    if (typeof data === 'undefined' || data === null) {
      return null;
    }

    // data is a string, parse it as JSON
    return JSON.parse(data) as T;
  }
}
