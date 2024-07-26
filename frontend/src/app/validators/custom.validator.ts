import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function fechaCierrePosteriorValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const fechaCierre = new Date(control.value);
    const fechaActual = new Date();

    // Comparamos solo la fecha sin la hora
    fechaActual.setHours(0, 0, 0, 0);
    fechaCierre.setHours(0, 0, 0, 0);

    return fechaCierre > fechaActual ? null : { fechaCierreInvalida: true };
  };
}

export function nonNegativeValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const isValid = control.value >= 0;
      return isValid ? null : {'nonNegative': {value: control.value}};
    };
}

export function nonZeroValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const isValid = control.value > 0;
      return isValid ? null : {'nonZero': {value: control.value}};
    };
}