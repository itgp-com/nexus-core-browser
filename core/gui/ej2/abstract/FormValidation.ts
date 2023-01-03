/**
 * Based on Syncfusion source code at node_modules/@syncfusion/ej2-inputs/src/form-validator/form-validator.js
 */



export interface ValidFormField_RetVal {
   valid: boolean;
   error_message ?: string;
}

export interface ValidFormField_Args {
   element? : HTMLInputElement;
   value: string;
}


/**
 *
 * @param args { element: this.inputElement, value: this.inputElement.value }
 */
export let validFormField:  (args: ValidFormField_Args) => Promise<ValidFormField_RetVal>;

/*  ---- From  form-validator.js ----------

 // Check the input element whether it's value satisfy the validation rule or not
 FormValidator.prototype.isValid = function (name, rule) {
 var params = this.rules[name][rule];
 var param = (params instanceof Array && typeof params[1] === 'string') ? params[0] : params;
 var currentRule = this.rules[name][rule];
 var args = { value: this.inputElement.value, param: param, element: this.inputElement, formElement: this.element };
 this.trigger('validationBegin', args);
 if (currentRule && typeof currentRule[0] === 'function') {
 var fn = currentRule[0];
 return fn.call(this, { element: this.inputElement, value: this.inputElement.value });
 }
 else if (FormValidator_1.isCheckable(this.inputElement)) {
 if (rule !== 'required') {
 return true;
 }
 return selectAll('input[name=' + name + ']:checked', this.element).length > 0;
 }
 else {
 return FormValidator_1.checkValidator[rule](args);
 }
 };

 */