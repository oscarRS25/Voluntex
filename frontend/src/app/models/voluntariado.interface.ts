export interface Voluntariado {
    id?: number;
    titulo?: string;
    descripcion?: string;
    cupo?: number;
    ingresos?: number;
    costo?: number;
    pais?: string;
    estado?: string;
    ciudad?: string;
    fechaInicio?: any;
    estatus?: number;
    fechaCierre?: any;
    fkEmpresa?: number;
}
