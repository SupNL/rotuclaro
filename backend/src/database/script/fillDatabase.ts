import { createConnection } from 'typeorm';
import ControleComponenteAlergenico from '../../controller/ControleComponenteAlergenico';
import ControleProduto from '../../controller/ControleProduto';
import { ComponenteAlergenico } from '../../model/ComponenteAlergenico';
import { Produto } from '../../model/Produto';

const listaComponentes = [
    new ComponenteAlergenico('Soja'),
    new ComponenteAlergenico('Lactose'),
];

const listaProdutos = [
    new Produto(
        '7891080400087',
        'MARGARINA DELÍCIA',
        10,
        63,
        0,
        0,
        7,
        2.2,
        0,
        0.065,
        0,
        0,
        'Óleos vegetais líquidos e interesterificados, água, sal, leite desnatado reconstituído, vitamina A (1.500 U.I./ 100g), estabilizantes: mono e diglicerídeos de ácidos graxos, lecitina de soja e ésteres de poliglicerol de ácidos graxos, conservador sorbato de potássio, acidulante ácido lático, aromatizantes, antioxidantes: EDTA cálcio dissódico, BHT e ácido cítrico e corante natural de urucum e cúrcuma.',
        [listaComponentes[0], listaComponentes[1]]
    ),
];

createConnection().then(() => {
    const componentesPromises = () => {
        return listaComponentes.map((componente) => {
            return new Promise<void>((resolve) => {
                console.log(
                    `[SCRIPT BD] COMPONENTE ALERGENICO - "${componente.nome}"`
                );
                ControleComponenteAlergenico.create(componente).then(() => {
                    resolve();
                });
            });
        });
    };

    const produtosPromises = () => {
        return listaProdutos.map((produto) => {
            return new Promise<void>((resolve) => {
                console.log(`[SCRIPT BD] PRODUTO - "${produto.nome}"`);
                ControleProduto.create(produto).then(() => {
                    resolve();
                });
            });
        });
    };

    console.log('[SCRIPT BD] FILLING DATABASE');

    Promise.all(componentesPromises()).then(() => {
        Promise.all(produtosPromises()).then(() => {
            console.log('[SCRIPT BD] FINISHED');
        });
    });
});
