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

        this.limiteMedioGordurasSaturadas =
            perfilObject.limiteMedioGordurasSaturadas;
        this.limiteAltoGordurasSaturadas =
            perfilObject.limiteAltoGordurasSaturadas;

        this.limiteMedioSodio = perfilObject.limiteMedioSodio;
        this.limiteAltoSodio = perfilObject.limiteAltoSodio;

        this.componentesAlergenicos = perfilObject.componentesAlergenicos;
    }

    converter(gramas, item) {
        return item * (this.gramas / gramas);
    }

    informarRestricoes(produto) {
        let avisos = {};
        const gramas = produto.gramasPorcao;

        avisos.componentes = produto.componentesAlergenicos.map((c) => {
            const result = this.componentesAlergenicos.find(
                (componentePerfil) => {
                    return componentePerfil.id == c.id;
                }
            );
            if (result) return c.nome;
        });
        avisos.componentes = avisos.componentes.filter((c) => c != null);

        let item;
        let componentInfo = {};
        avisos.items = [];

        item = this.converter(gramas, produto.kcal);
        componentInfo = {
            tipo: 'calorias',
            total: item,
            limiteAlto: this.limiteAltoKcal,
            limiteMedio: this.limiteMedioKcal,
        };
        if (item > this.limiteAltoKcal) {
            componentInfo.nivel = 'alto';
        } else if (item > this.limiteMedioKcal) {
            componentInfo.nivel = 'médio';
        } else {
            componentInfo.nivel = 'baixo';
        }
        avisos.items.push(componentInfo);

        item = this.converter(gramas, produto.carboidratos);
        componentInfo = {
            tipo: 'carboidratos',
            total: item,
            limiteAlto: this.limiteAltoCarboidratos,
            limiteMedio: this.limiteMedioCarboidratos,
        };
        if (item > this.limiteAltoCarboidratos) {
            componentInfo.nivel = 'alto';
        } else if (item > this.limiteMedioCarboidratos) {
            componentInfo.nivel = 'médio';
        } else {
            componentInfo.nivel = 'baixo';
        }
        avisos.items.push(componentInfo);

        item = this.converter(gramas, produto.acucares);
        componentInfo = {
            tipo: 'açúcares',
            total: item,
            limiteAlto: this.limiteAltoAcucares,
            limiteMedio: this.limiteMedioAcucares,
        };
        if (item > this.limiteAltoAcucares) {
            componentInfo.nivel = 'alto';
        } else if (item > this.limiteMedioAcucares) {
            componentInfo.nivel = 'médio';
        } else {
            componentInfo.nivel = 'baixo';
        }
        avisos.items.push(componentInfo);

        item = this.converter(gramas, produto.gorduras);
        componentInfo = {
            tipo: 'gorduras totais',
            total: item,
            limiteAlto: this.limiteAltoGordurasTotais,
            limiteMedio: this.limiteMedioGordurasTotais,
        };
        if (item > this.limiteAltoGordurasTotais) {
            componentInfo.nivel = 'alto';
        } else if (item > this.limiteMedioGordurasTotais) {
            componentInfo.nivel = 'médio';
        } else {
            componentInfo.nivel = 'baixo';
        }
        avisos.items.push(componentInfo);

        item = this.converter(gramas, produto.gordurasTrans);
        componentInfo = {
            tipo: 'gorduras trans',
            total: item,
            limiteAlto: this.limiteAltoGordurasTrans,
            limiteMedio: this.limiteMedioGordurasTrans,
        };
        if (
            this.limiteMedioGordurasTrans == 0 &&
            this.limiteAltoGordurasTrans == 0
        ) {
            componentInfo.nivel = 'ignorar';
        } else if (item > this.limiteAltoGordurasTrans) {
            componentInfo.nivel = 'alto';
        } else if (item > this.limiteMedioGordurasTrans) {
            componentInfo.nivel = 'médio';
        } else {
            componentInfo.nivel = 'baixo';
        }
        avisos.items.push(componentInfo);

        item = this.converter(gramas, produto.gordurasSaturadas);
        componentInfo = {
            tipo: 'gorduras trans',
            total: item,
            limiteAlto: this.limiteAltoGordurasSaturadas,
            limiteMedio: this.limiteMedioGordurasSaturadas,
        };
        if (
            this.limiteMedioGordurasSaturadas == 0 &&
            this.limiteAltoGordurasSaturadas == 0
        ) {
            componentInfo.nivel = 'ignorar';
        } else if (item > this.limiteAltoGordurasSaturadas) {
            componentInfo.nivel = 'alto';
        } else if (item > this.limiteMedioGordurasSaturadas) {
            componentInfo.nivel = 'médio';
        } else {
            componentInfo.nivel = 'baixo';
        }
        avisos.items.push(componentInfo);

        item = this.converter(gramas, produto.sodio);
        componentInfo = {
            tipo: 'sódio',
            total: item,
            limiteAlto: this.limiteAltoSodio,
            limiteMedio: this.limiteMedioSodio,
        };
        if (item > this.limiteAltoSodio) {
            componentInfo.nivel = 'alto';
        } else if (item > this.limiteMedioSodio) {
            componentInfo.nivel = 'médio';
        } else {
            componentInfo.nivel = 'baixo';
        }
        avisos.items.push(componentInfo);

        return avisos;
    }
}
