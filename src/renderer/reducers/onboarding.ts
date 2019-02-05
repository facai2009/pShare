import { getType } from 'typesafe-actions';
import OnboardingActions from '../../shared/actions/onboarding';
import { ValidationResult } from "../../shared/system/validator/ValidationResult";
import { blinq } from 'blinq';

interface Validatable<T> {
    value: T,
    validationResult?: ValidationResult<T>,
    isValidating: boolean
}

interface OnboardingUserNameCommonnameValidationState {
    userName: Validatable<string>,
    commonName: Validatable<string>,
    token: Validatable<string>,
    isValid: boolean
}

const defaultState: OnboardingUserNameCommonnameValidationState = {
    userName: {
        value: "",
        isValidating: false

    },
    commonName: {
        value: "",
        isValidating: false

    },
    token: {
        value: "",
        isValidating: false

    },
    isValid: false
}
const fieldNamesUnderValidation: Array<keyof OnboardingUserNameCommonnameValidationState> = ["userName", "commonName", "token"]

export default (state: OnboardingUserNameCommonnameValidationState = defaultState, action: OnboardingActions): OnboardingUserNameCommonnameValidationState => {
    switch (action.type) {
        case getType(OnboardingActions.validated): {
            const { value: validationResult } = action.payload;
            return {
                ...state,
                [action.payload.fieldName]: {
                    value: action.payload.value.value,
                    validationResult,
                    isValidating: false
                },
                isValid:
                    validationResult.success
                    && blinq(fieldNamesUnderValidation)
                        .where(f => action.payload.fieldName !== f)
                        .all(f =>
                            typeof (state[f] as any).validationResult !== 'undefined'
                            && (state[f] as any).validationResult.success)
            }
        }

        case getType(OnboardingActions.validate):
            return {
                ...state,
                [action.payload.fieldName]: {
                    ...(state as any)[action.payload.fieldName],
                    isValidating: true
                }
            }

        case getType(OnboardingActions.resetValidation):
            return {
                ...state,
                [action.payload.fieldName]: {
                    ...(state as any)[action.payload.fieldName],
                    isValidating: false,
                    validationResult: undefined
                },
                isValid: false
            }

        default:
            return state;


    }
}