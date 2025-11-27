// If a new search has been made, the first condition formats the search result as a selected token. 
// Otherwise, if you have tokens in your private adress, those will be displayed. 
// If neither is true, a set of default tokens will be shown. 

import { UserToken } from "~~/src/shared/types";

export const getTokenAddressesToDisplay = async (
  newSearchedAddress: string,
  spendablePrivateTokens: UserToken[],
  defaultPrivacyPoolTokenList: string[],
) => {
  let tokensToChoose: string[];

  if (newSearchedAddress !== "") {
    tokensToChoose = [newSearchedAddress];
  } else if (spendablePrivateTokens?.length) {
    tokensToChoose = spendablePrivateTokens.map((token: UserToken) => token.address); // Display private Tokens
  } else {
    tokensToChoose = defaultPrivacyPoolTokenList; // Display Defaults
  }

  return tokensToChoose;
};