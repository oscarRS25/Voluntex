import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VoluntariadoService } from '../../services/voluntariado.service';

@Component({
  selector: 'app-registro-voluntariados',
  templateUrl: './registro-voluntariados.component.html',
  styleUrls: ['./registro-voluntariados.component.css']
})
export class RegistroVoluntariadosComponent implements OnInit {
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  registroExitoso = false;

  constructor(private _formBuilder: FormBuilder, private voluntariadoService: VoluntariadoService) {
    this.firstFormGroup = this._formBuilder.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      cupo: [null, Validators.required],
      ingresos: [null, Validators.required],
      costo: [null, Validators.required],
      pais: ['', Validators.required],
      estado: ['', Validators.required],
      ciudad: ['', Validators.required]
    });
    this.thirdFormGroup = this._formBuilder.group({
      fechaInicio: [null, Validators.required],
      fechaCierre: [null, Validators.required],
      estatus: [null, Validators.required],
      fkEmpresa: [null, Validators.required]
    });
  }

  ngOnInit() {
    // Si necesitas realizar alguna configuración adicional, puedes hacerlo aquí
  }

  //Para resetear los datos del formulario, 
  resetStepper() {
    this.isLinear = false;
    this.firstFormGroup.reset();
    this.secondFormGroup.reset();
    this.thirdFormGroup.reset();
  }

  onSubmit() {
    // Validar los formularios
    if (this.firstFormGroup.invalid || this.secondFormGroup.invalid || this.thirdFormGroup.invalid) {
      console.log('Formulario inválido');
      return;
    }

    // Recopilar los datos del formulario
    const voluntariado = {
      ...this.firstFormGroup.value,
      ...this.secondFormGroup.value,
      ...this.thirdFormGroup.value
    };

    // Simulación de envío al servidor
    this.voluntariadoService.registrarVoluntariado(voluntariado).subscribe(
      response => {
        console.log('Voluntariado registrado exitosamente', response);
        this.registroExitoso = true;
        this.resetStepper();
      },
      error => {
        console.error('Error al registrar el voluntariado', error);
      }
    );
  }

}
