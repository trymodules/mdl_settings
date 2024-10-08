import {
  SSMClient,
  GetParameterCommand,
  PutParameterCommand,
  GetParameterCommandInput,
  PutParameterCommandInput,
  DeleteParameterCommand,
} from '@aws-sdk/client-ssm';
import { Except, PartialDeep } from 'type-fest';
import {
  LoadSettingsParams,
  SaveSettingsParams,
  SettingsProvider,
  SettingsFormatter,
  SharedSettingsParams,
  MODULE_NAME,
} from '@trymodules/settings';

export interface AwsSSMSettingsProviderOptions {
  /**
   * The SSM client to use to interact with the AWS SSM service
   */
  ssmClient: SSMClient;

  /**
   * The formatter to use to serialize/deserialize the settings
   */
  formatter: SettingsFormatter;

  /**
   * Set to true to decrypt the parameter value
   */
  encrypted?: boolean;

  getParameterCommandOpts?: PartialDeep<GetParameterCommandInput>;
  putParameterCommandOpts?: PartialDeep<PutParameterCommandInput>;
}

export class AwsSSMSettingsProvider<TSettings = unknown>
  implements SettingsProvider<TSettings>
{
  readonly NAME = Symbol('provider-aws-ssm');

  protected readonly ssmClient: SSMClient;
  protected readonly formatter: SettingsFormatter;

  protected readonly encrypted?: boolean;

  protected readonly getParameterCommandOpts?: Except<
    PartialDeep<GetParameterCommandInput>,
    'Name'
  >;
  protected readonly putParameterCommandOpts?: Except<
    PartialDeep<PutParameterCommandInput>,
    'Name'
  >;

  constructor({
    ssmClient,
    formatter,
    encrypted,
    getParameterCommandOpts,
    putParameterCommandOpts,
  }: AwsSSMSettingsProviderOptions) {
    this.ssmClient = ssmClient;
    this.formatter = formatter;
    this.encrypted = encrypted;
    this.getParameterCommandOpts = getParameterCommandOpts;
    this.putParameterCommandOpts = putParameterCommandOpts;
  }

  async load({
    namespace,
    defaultVal,
  }: LoadSettingsParams<TSettings>): Promise<TSettings | null> {
    const output = await this.ssmClient.send(
      new GetParameterCommand({
        ...this.getParameterCommandOpts,

        Name: namespace,
        WithDecryption: this.encrypted,
      })
    );

    // either the parameter doesn't exist or it has no value
    if (
      typeof output.Parameter === 'undefined' ||
      typeof output.Parameter.Value === 'undefined'
    ) {
      return defaultVal ?? null;
    }

    return this.formatter.deserialize(output.Parameter.Value);
  }

  async save({ namespace, settings }: SaveSettingsParams): Promise<void> {
    await this.ssmClient.send(
      new PutParameterCommand({
        // overridable options
        Description: `@trymodules/settings | ${namespace}`,
        Overwrite: true,
        Tags: [
          {
            Key: 'trymodules:module',
            Value: MODULE_NAME.description,
          },
          {
            Key: `trymodules:${MODULE_NAME.description}:provider`,
            Value: this.NAME.description,
          },
          {
            Key: `trymodules:${MODULE_NAME.description}:format`,
            Value: this.formatter.NAME.description,
          },
        ],

        ...this.putParameterCommandOpts,

        // non-overridable options
        Name: namespace,
        Value: this.formatter.serialize(settings),

        // store data in plain text or encrypted
        Type: this.encrypted === true ? 'SecureString' : 'String',
      })
    );
  }

  async delete({ namespace }: SharedSettingsParams): Promise<void> {
    await this.ssmClient.send(
      new DeleteParameterCommand({
        Name: namespace,
      })
    );
  }
}
