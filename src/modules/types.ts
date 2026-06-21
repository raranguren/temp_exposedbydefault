export interface FingerprintData {
  category: string;
  key: string;
  value: string;
  // If set, its result replaces `value` in the tile after render
  resolve?: () => Promise<string>;
  tooltip?: string;
}
