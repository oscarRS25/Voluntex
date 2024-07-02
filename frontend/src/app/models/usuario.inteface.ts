export interface Usuario{
    id?: number,
    nombre?: string,
    apePaterno?: string,
    apeMaterno?: string,
    email?: string,
    password?: string,
    telefono?: string,
    fechaNac?: Date,
    rolFk?: any,
    empresaFk?: number,
    areaFk?: any
}