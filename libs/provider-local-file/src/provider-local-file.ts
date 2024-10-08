import { readFileSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { join as joinPath } from 'node:path';

import {
  LoadSettingsParams,
  SaveSettingsParams,
  SettingsProvider,
  SettingsFormatter,
  SharedSettingsParams,
  MODULE_NAME,
} from '@trymodules/settings';

export interface LocalFileSettingsProviderOptions {
  /**
   * The formatter to use to serialize/deserialize the settings
   */
  formatter: SettingsFormatter;

  /**
   * The path to the directory where the settings files are stored
   */
  storagePath: string;

  /**
   * File extension to use for the settings files (e.g. 'json')
   * DO NOT USE A DOT (.) IN THE FILE EXTENSION
   */
  fileExtension: string;
}

export class LocalFileSettingsProvider<TSettings = unknown>
  implements SettingsProvider<TSettings>
{
  readonly NAME = Symbol('provider-local-file');

  constructor(protected readonly opts: LocalFileSettingsProviderOptions) {}

  protected getFilePath(namespace: string): string {
    const { storagePath, fileExtension } = this.opts;

    return joinPath(
      storagePath,
      `trymodules.${MODULE_NAME.description}.${namespace}.${fileExtension}`
    );
  }

  async load({
    namespace,
    defaultVal,
  }: LoadSettingsParams<TSettings>): Promise<TSettings | null> {
    const { formatter } = this.opts;
    const filePath = this.getFilePath(namespace);

    // file doesn't exist
    if (existsSync(filePath) !== true) {
      return defaultVal ?? null;
    }

    return formatter.deserialize(readFileSync(filePath, { encoding: 'utf-8' }));
  }

  async save({ namespace, settings }: SaveSettingsParams): Promise<void> {
    const { formatter } = this.opts;
    const filePath = this.getFilePath(namespace);

    writeFileSync(filePath, formatter.serialize(settings), {
      encoding: 'utf-8',
    });
  }

  async delete({ namespace }: SharedSettingsParams): Promise<void> {
    const filePath = this.getFilePath(namespace);

    // file doesn't exist
    if (existsSync(filePath) !== true) {
      return;
    }

    rmSync(filePath);
  }
}
