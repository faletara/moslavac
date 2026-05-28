import * as migration_20260528_094613_add_legal_fields from './20260528_094613_add_legal_fields';

export const migrations = [
  {
    up: migration_20260528_094613_add_legal_fields.up,
    down: migration_20260528_094613_add_legal_fields.down,
    name: '20260528_094613_add_legal_fields'
  },
];
