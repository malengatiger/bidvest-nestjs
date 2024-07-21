export class Constants {
  public static readonly PROFILE_IMAGE = "PROFILE_IMAGE";
  public static readonly SPLASH_IMAGE = "SPLASH_IMAGE";
  public static readonly GENERIC_IMAGE = "GENERIC_IMAGE";
  public static readonly GENERIC_VIDEO = "GENERIC_VIDEO";
  public static readonly DOCUMENT = "DOCUMENT";

  public static readonly admin = "admin";

  public static parse(str: string): string {
    if (str.includes("video")) {
      return Constants.GENERIC_VIDEO;
    } else if (str.includes("profile") || str.includes("user")) {
      return Constants.PROFILE_IMAGE;
    } else if (str.includes("image") || str.includes("picture")) {
      return Constants.GENERIC_IMAGE;
    } else if (str.includes("file") || str.includes("document")) {
      return Constants.DOCUMENT;
    } else if (
      str.includes("splash") ||
      str.includes("hero") ||
      str.includes("background")
    ) {
      return Constants.SPLASH_IMAGE;
    } else {
      return Constants.GENERIC_IMAGE;
    }
  }
}
