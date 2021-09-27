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
        item = this.converter(gramas, produto.kcal);
        avisos.items = [];
        if (item > this.limiteAltoKcal) {
            avisos.items.push({
                tipo: 'calorias',
                nivel: 'alto',
                total: item,
                limite: this.limiteAltoKcal,
            });
        } else if (item > this.limiteMedioKcal) {
            avisos.items.push({
                tipo: 'calorias',
                nivel: 'médio',
                total: item,
                limite: this.limiteMedioKcal,
            });
        }

        item = this.converter(gramas, produto.carboidratos);
        if (item > this.limiteAltoCarboidratos) {
            avisos.items.push({
                tipo: 'carboidratos',
                nivel: 'alto',
                total: item,
                limite: this.limiteAltoCarboidratos,
            });
        } else if (item > this.limiteMedioCarboidratos) {
            avisos.items.push({
                tipo: 'carboidratos',
                total: item,
                limite: this.limiteMedioCarboidratos,
            });
        }

        item = this.converter(gramas, produto.acucares);
        if (item > this.limiteAltoAcucares) {
            avisos.items.push({
                tipo: 'açúcares',
                nivel: 'alto',
                total: item,
                limite: this.limiteAltoAcucares,
            });
        } else if (item > this.limiteMedioAcucares) {
            avisos.items.push({
                tipo: 'açúcares',
                nivel: 'médio',
                total: item,
                limite: this.limiteMedioAcucares,
            });
        }

        item = this.converter(gramas, produto.gorduras);
        if (item > this.limiteAltoGordurasTotais) {
            avisos.items.push({
                tipo: 'gorduras totais',
                nivel: 'alto',
                total: item,
                limite: this.limiteAltoGordurasTotais,
            });
        } else if (item > this.limiteMedioGordurasTotais) {
            avisos.items.push({
                tipo: 'gorduras totais',
                nivel: 'médio',
                total: item,
                limite: this.limiteMedioGordurasTotais,
            });
        }

        if (
            this.limiteMedioGordurasTrans != 0 &&
            this.limiteAltoGordurasTrans != 0
        ) {
            item = this.converter(gramas, produto.gordurasTrans);
            if (item > this.limiteAltoGordurasTrans) {
                avisos.items.push({
                    tipo: 'gorduras trans',
                    nivel: 'alto',
                    total: item,
                    limite: this.limiteAltoGordurasTrans,
                });
            } else if (item > this.limiteMedioGordurasTrans) {
                avisos.items.push({
                    tipo: 'gorduras trans',
                    nivel: 'médio',
                    total: item,
                    limite: this.limiteMedioGordurasTrans,
                });
            }
        }

        if (
            this.limiteMedioGordurasSaturadas != 0 &&
            this.limiteAltoGordurasSaturadas != 0
        ) {
            item = this.converter(gramas, produto.gordurasSaturadas);
            if (item > this.limiteAltoGordurasSaturadas) {
                avisos.items.push({
                    tipo: 'gorduras saturadas',
                    nivel: 'alto',
                    total: item,
                    limite: this.limiteAltoGordurasSaturadas,
                });
            } else if (item > this.limiteMedioGordurasSaturadas) {
                avisos.items.push({
                    tipo: 'gorduras saturadas',
                    nivel: 'médio',
                    total: item,
                    limite: this.limiteMedioGordurasSaturadas,
                });
            }
        }

        item = this.converter(gramas, produto.sodio);
        if (item > this.limiteAltoSodio) {
            avisos.items.push({
                tipo: 'sódio (sal)',
                nivel: 'alto',
                total: item,
                limite: this.limiteAltoSodio,
            });
        } else if (item > this.limiteMedioSodio) {
            avisos.items.push({
                tipo: 'sódio (sal)',
                nivel: 'médio',
                total: item,
                limite: this.limiteMedioSodio,
            });
        }

        return avisos;
    }
}
