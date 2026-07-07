interface CometImageUrlOptions {
  transparent?: boolean;
}

export const getCometImageUrl = (
  uuid: string,
  options: CometImageUrlOptions = {},
): string => {
  return `/api/images/${uuid}${options.transparent ? "?transparent=1" : ""}`;
};
