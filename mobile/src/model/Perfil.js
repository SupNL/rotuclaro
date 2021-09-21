export class Perfil {
    constructor(perfilObject) {
        this.gramas = perfilObject.gramas;

        this.limiteMedioKcal = perfilObject.limiteMedioKcal;
        this.limiteAltoKcal = perfilObject.limiteAltoKcal;

        this.limiteMedioCarboidratos = perfilObject.limiteMedioCarboidratos;
        this.limiteAltoCarboidratos = perfilObject.limiteAltoCarboidratos;

        this.limiteMedioAcucares = perfilObject.limiteMedioAcucares;
        this.limiteAltoAcucares = perfilObject.limiteAltoAcucares;

        this.limiteMedioGordurasTotais = perfilObject.limiteMedioGordurasTotais;
        this.limiteAltoGordurasTotais = perfilObject.limiteAltoGordurasTotais;

        this.limiteMedioGordurasTrans = perfilObject.limiteMedioGordurasTrans;
        this.limiteAltoGordurasTrans = perfilObject.limiteAltoGordurasTrans;

        this.limiteMedioGordurasSaturadas = perfilObject.limiteMedioGordurasSaturadas;
        this.limiteAltoGordurasSaturadas = perfilObject.limiteAltoGordurasSaturadas;

        this.limiteMedioSodio = perfilObject.limiteMedioSodio;
        this.limiteAltoSodio = perfilObject.limiteAltoSodio;

        this.componentesAlergenicos = perfilObject.componentesAlergenicos;
    }

    // informarRestricoes(produto) {
    //     let avisos = {};

    //     avisos.componentes = produto.componentesAlergenicos.map(c => {
    //         const result = this.componentesAlergenicos.find(componentePerfil => componentePerfil.id == c.id);
    //         if (result) return c.nome;
    //     });
    // }
}
