import { dump, load } from 'js-yaml';
import { SettingsFormatter } from '@trymodules/settings';

export class YamlFormatter implements SettingsFormatter {
  readonly NAME = Symbol('format-yaml');

  serialize<T>(data: T | null): string {
    return dump(data ?? null);
  }

  deserialize<T>(data: string | null): T | null {
    // If the data is null or undefined, return null
    if (typeof data === 'undefined' || data === null) {
      return null;
    }

    // data is a string, parse it as YAML
    return load(data) as T;
  }
}
