import { createConnection } from 'typeorm';
import ControleComponenteAlergenico from '../../controller/ControleComponenteAlergenico';
import ControleProduto from '../../controller/ControleProduto';
import { ComponenteAlergenico } from '../../model/ComponenteAlergenico';
import { Produto } from '../../model/Produto';

const listaComponentes = [
    // 0
    new ComponenteAlergenico('Soja'),
    new ComponenteAlergenico('Lactose'),
    new ComponenteAlergenico('Leite'),
    new ComponenteAlergenico('Amendoins'),
    new ComponenteAlergenico('Nozes'),

    // 5
    new ComponenteAlergenico('Glúten'),
    new ComponenteAlergenico('Albumina (Ovo)'),
    new ComponenteAlergenico('Peixes'),
    new ComponenteAlergenico('Frutos do mar'),
    new ComponenteAlergenico('Camarão'),

    // 10
    new ComponenteAlergenico('Soja transgênica'),
    new ComponenteAlergenico('Trigo'),
    new ComponenteAlergenico('Cevada'),
    new ComponenteAlergenico('Centeio'),
    new ComponenteAlergenico('Aveia'),
];

const listaProdutos = [
    new Produto(
        '7891080400087',
        'MARGARINA COM SAL DELICIA 500G',
        10, // Gramas por porção
        63, // Kcal
        0, // Carboidratos
        0, // Açúcares
        7, // Gorduras
        2.2, // Gorduras Saturadas
        0, // Gorduras Trans
        0.065, // Sódio
        0, // Proteínas
        0, // Fibras
        'Óleos vegetais líquidos e interesterificados, água, sal, leite desnatado reconstituído, vitamina A (1.500 U.I./ 100g), estabilizantes: mono e diglicerídeos de ácidos graxos, lecitina de soja e ésteres de poliglicerol de ácidos graxos, conservador sorbato de potássio, acidulante ácido lático, aromatizantes, antioxidantes: EDTA cálcio dissódico, BHT e ácido cítrico e corante natural de urucum e cúrcuma.',
        [listaComponentes[0], listaComponentes[1]]
    ),
    new Produto(
        '7898215151708',
        'LEITE UHT INTEGRAL PIRACANJUBA 1L',
        200 * 1.36, // Gramas/ML por porção
        115, // Kcal
        9.1, // Carboidratos
        0, // Açúcares
        6, // Gorduras
        3.6, // Gorduras Saturadas
        0, // Gorduras Trans
        0.122, // Sódio
        6.1, // Proteínas
        0, // Fibras
        'Leite integral e estabilizantes citrato de sódio, trifosfato de sódio, monofosfato de sódio e difosfato de sódio.',
        [listaComponentes[1], listaComponentes[2]]
    ),
    new Produto(
        '7892840816803',
        'SALGADINHO ELMA CHIPS CHEETOS ONDA REQUEIJAO 37GR',
        37, // Gramas/ML por porção
        184, // Kcal
        24, // Carboidratos
        1.1, // Açúcares
        8.8, // Gorduras
        1.7, // Gorduras Saturadas
        0, // Gorduras Trans
        0.168, // Sódio
        1.9, // Proteínas
        0, // Fibras
        'Farinha de milho enriquecida com ferro e ácido fólico (Bacillus thuringiensis, Agrobacterium sp, Agrobacterium tumefaciens, Streptomyces viridochromogenes, Zea mays, Dicossoma sp e Sphingobium herbicidovorans), óleo vegetal de soja e preparado para salgadinho sabor requeijão (soro de leite, óleo vegetal de palma, xarope de glucose, sal, cloreto de potássio, maltodextrina, realçadores de sabor: glutamato monossódico, inosinato dissódico e guanilato dissódico, aromatizantes, reguladores de acidez: ácido cítrico e ácido láctico, corantes: urucum e cúrcuma e emulsificante mono e diglicerídeos de ácidos graxos).',
        [
            listaComponentes[0],
            listaComponentes[1],
            listaComponentes[2],
            listaComponentes[11],
            listaComponentes[12],
            listaComponentes[13],
            listaComponentes[14],
            listaComponentes[5]
        ]
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
