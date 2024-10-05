import { SettingsFormatter } from '@trymodules/settings';

export class JsonFormatter implements SettingsFormatter {
  serialize<T>(data: T): string {
    return JSON.stringify(data);
  }

  deserialize<T>(data: string): T {
    return JSON.parse(data) as T;
  }
}
