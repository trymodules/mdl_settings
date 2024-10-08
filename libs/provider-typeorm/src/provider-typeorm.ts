import {
  LoadSettingsParams,
  SaveSettingsParams,
  SettingsFormatter,
  SettingsProvider,
  SharedSettingsParams,
} from '@trymodules/settings';
import { DataSource } from 'typeorm';

import { SettingsEntity } from './models';

export type TypeormSettingsProviderOptions = {
  /**
   * The TypeORM data source to use to interact with the database
   */
  dataSource: DataSource;

  /**
   * The formatter to use to serialize/deserialize the settings
   */
  formatter: SettingsFormatter;

  /**
   * Set to true to use soft delete
   */
  softDelete?: boolean;
};

export class TypeormSettingsProvider<TSettings = unknown>
  implements SettingsProvider<TSettings>
{
  readonly NAME = Symbol('provider-typeorm');

  protected get repository() {
    return this.opts.dataSource.getRepository(SettingsEntity);
  }

  constructor(protected readonly opts: TypeormSettingsProviderOptions) {}

  async load({
    namespace,
    defaultVal,
  }: LoadSettingsParams<TSettings>): Promise<TSettings | null> {
    const { formatter } = this.opts;

    const settingsRecord = await this.repository.findOne({
      select: ['val'],
      where: { namespace },
    });

    // no settings found, return default value (if provided)
    if (typeof settingsRecord === 'undefined' || settingsRecord === null) {
      return defaultVal ?? null;
    }

    // deserialize the settings
    return formatter.deserialize(settingsRecord.val);
  }

  async save(params: SaveSettingsParams<TSettings>): Promise<void> {
    const { formatter } = this.opts;

    // either insert or update
    await this.repository.save({
      namespace: params.namespace,
      val: formatter.serialize(params.settings),
    });
  }

  async delete(params: SharedSettingsParams): Promise<void> {
    // either soft delete or hard delete
    await (this.opts.softDelete
      ? this.repository.softDelete({ namespace: params.namespace })
      : this.repository.delete({ namespace: params.namespace }));
  }
}
