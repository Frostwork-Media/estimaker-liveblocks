export const testExport = 100;

export type ProjectMetadata = {
  name: string;
  public: "true" | "false";
  slug: string;
};

/**
 * This is the unsafeMetadata stored on the clerk user
 */
export type UserMetadata = { username: string };
