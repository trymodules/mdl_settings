import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'trymodules_settings' })
export class SettingsEntity {
  @PrimaryColumn({
    type: 'varchar',
    primary: true,
    length: 254,
    nullable: false,
    unique: true,
  })
  /**
   * The namespace of the settings
   */
  namespace: string;

  @Column({ type: 'text', nullable: true })
  /**
   * The serialized settings
   */
  val: string | null;
}
