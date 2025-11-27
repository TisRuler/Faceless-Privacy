import { UserToken } from "~~/src/shared/types";

export const isValidTokenInfo = (token: any): token is UserToken => token !== null && token !== undefined;