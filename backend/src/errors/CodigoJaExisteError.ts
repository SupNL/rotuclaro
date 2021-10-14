export class CodigoJaExisteError extends Error {
    constructor() {
        super('Código já existente');
    }
}