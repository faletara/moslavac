import * as migration_20260528_094613_add_legal_fields from './20260528_094613_add_legal_fields';
import * as migration_20260605_071033_add_vrapce_collections from './20260605_071033_add_vrapce_collections';

export const migrations = [
  {
    up: migration_20260528_094613_add_legal_fields.up,
    down: migration_20260528_094613_add_legal_fields.down,
    name: '20260528_094613_add_legal_fields',
  },
  {
    up: migration_20260605_071033_add_vrapce_collections.up,
    down: migration_20260605_071033_add_vrapce_collections.down,
    name: '20260605_071033_add_vrapce_collections',
  },
];
