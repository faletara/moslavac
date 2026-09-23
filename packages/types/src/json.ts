/**
 * Bilo koja vrijednost koja preživi `JSON.parse`. Transportni slojevi (Payload
 * REST, HNS) vraćaju ovo umjesto `unknown`: pozivatelj i dalje mora provjeriti
 * oblik, ali tip već kaže da je riječ o raščlanjenom JSON-u, a ne o bilo čemu.
 */
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };
