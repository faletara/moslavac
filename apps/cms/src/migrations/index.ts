import * as migration_20260724_163800_baseline from './20260724_163800_baseline';
import * as migration_20260724_165008_add_equipment_feature from './20260724_165008_add_equipment_feature';
import * as migration_20260724_170000_cleanup_orphans from './20260724_170000_cleanup_orphans';

export const migrations = [
  {
    up: migration_20260724_163800_baseline.up,
    down: migration_20260724_163800_baseline.down,
    name: '20260724_163800_baseline',
  },
  {
    up: migration_20260724_165008_add_equipment_feature.up,
    down: migration_20260724_165008_add_equipment_feature.down,
    name: '20260724_165008_add_equipment_feature',
  },
  {
    up: migration_20260724_170000_cleanup_orphans.up,
    down: migration_20260724_170000_cleanup_orphans.down,
    name: '20260724_170000_cleanup_orphans'
  },
];
