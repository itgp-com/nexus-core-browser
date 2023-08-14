import {Nx2} from '../Nx2';


export interface StateNx2Validator<WIDGET extends Nx2 = Nx2> {
    validationRule ?: ValidationRuleDetails<WIDGET>;
}


export class ValidationRuleDetails<WIDGET extends Nx2 = Nx2> {
    validator: (ev: ValidationEvent<WIDGET>)=> boolean ; // mandatory
    errorMessage: (ev: ValidationErrorMessage<WIDGET>)=> string ; // mandatory
    data ?: (ev: ValidationData<WIDGET, number>)=> number ; // optional
}

export interface ValidationEventCommon<WIDGET extends Nx2 = Nx2> {
    n2Widget: WIDGET;
}

export interface ValidationData<WIDGET extends Nx2 = Nx2, DATATYPE = any> extends ValidationEventCommon<WIDGET> {
    data: DATATYPE | (() => DATATYPE); // additional data to pass to the validationRule
}

export interface ValidationEvent<WIDGET extends Nx2 = Nx2, DATATYPE = any> extends ValidationEventCommon<WIDGET> {
    element?: HTMLInputElement,
    value: string;
    data: DATATYPE
}

export interface ValidationErrorMessage<WIDGET extends Nx2 = Nx2, DATATYPE = any> extends ValidationEventCommon<WIDGET> {
    data: DATATYPE
}

export const NX_VALIDATION_RULE = '_nx_validation';