import { PRIVATE_ADDRESS_NOTIFICATIONS } from "~~/src/constants/notifications";

// Password is at least 8 characters
// Contains at least one uppercase letter
// Contains at least one number
// No restrictions on lowercase letters or special characters
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

export const validateNewPasswordChoice = (password1: string | null, password2: string | null) => { 

    if (!password1 || !PASSWORD_REGEX.test(password1)) {
      throw new Error(PRIVATE_ADDRESS_NOTIFICATIONS.ERROR_PASSWORD_TOO_WEAK);
    }

    if (password1 !== password2) {
        throw new Error(PRIVATE_ADDRESS_NOTIFICATIONS.ERROR_NON_MATCHING_2_PASSWORDS);
    }
};

