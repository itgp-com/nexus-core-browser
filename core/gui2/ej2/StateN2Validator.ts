import {N2} from '../N2';


export interface StateN2Validator<WIDGET extends N2 = N2> {
    validationRule ?: ValidationRuleDetails<WIDGET>;
}


export class ValidationRuleDetails<WIDGET extends N2 = N2> {
    validator: (ev: ValidationEvent<WIDGET>)=> boolean ; // mandatory
    errorMessage: (ev: ValidationErrorMessage<WIDGET>)=> string ; // mandatory
    data ?: (ev: ValidationData<WIDGET, number>)=> number ; // optional
}

export interface ValidationEventCommon<WIDGET extends N2 = N2> {
    n2Widget: WIDGET;
}

export interface ValidationData<WIDGET extends N2 = N2, DATATYPE = any> extends ValidationEventCommon<WIDGET> {
    data: DATATYPE | (() => DATATYPE); // additional data to pass to the validationRule
}

export interface ValidationEvent<WIDGET extends N2 = N2, DATATYPE = any> extends ValidationEventCommon<WIDGET> {
    element?: HTMLInputElement,
    value: string;
    data: DATATYPE
}

export interface ValidationErrorMessage<WIDGET extends N2 = N2, DATATYPE = any> extends ValidationEventCommon<WIDGET> {
    data: DATATYPE
}

export const N2_VALIDATION_RULE:string = '_n2_validation';