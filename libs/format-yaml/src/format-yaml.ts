import { dump, load } from 'js-yaml';

import { SettingsFormatter } from '@trymodules/settings';

export class YamlFormatter implements SettingsFormatter {
  serialize<T>(data: T): string {
    return dump(data);
  }

  deserialize<T>(data: string): T {
    return load(data) as T;
  }
}
