// Shapes for the asset microservice (nest.jonfjz.dev). The service does not
// publish response schemas in its OpenAPI doc, so the list/info endpoints are
// parsed defensively from a few plausible field names.

export interface AssetItem {
  /** Object key in storage — the stable identifier used by info/delete/metadata. */
  key: string;
  /** Display file name (basename of the key). */
  name: string;
  /** Public URL for previewing / linking the asset. */
  url: string;
  /** File extension in lowercase, without the dot (e.g. "png"). */
  ext: string;
  /** True when the asset is a previewable image. */
  isImage: boolean;
  size?: number;
  lastModified?: string;
  contentType?: string;
  entryId?: string;
  metadata?: Record<string, string>;
}
