import { Router } from 'express';
import ControleComponenteAlergenico from '../../controller/ControleComponenteAlergenico';
import ControlePerfil from '../../controller/ControlePerfil';
import ControleProduto from '../../controller/ControleProduto';
import ControleRegistroConsulta from '../../controller/ControleRegistroConsulta';

const rotaRelatorio = Router();

interface DadosResumo {
    totalPerfil : number;
    componenteEvitado : {
        nomeComponente : string,
        numPerfis : number;
    };
    consultasHoje : number;
    produtoMaisConsultado : {
        nomeProduto : string,
        consultas : number;
    };
}

rotaRelatorio.get('/resumo', async (req, res) => {
    const totalPerfil = await ControlePerfil.count();
    const componenteEvitado = await ControleComponenteAlergenico.findMostAvoidedComponent();
    const consultasHoje = await ControleRegistroConsulta.getTodayFetches();
    const produtoMaisConsultado = await ControleProduto.findMostSearchProductFromThreeDays();
    
    const data : DadosResumo = {
        totalPerfil,
        componenteEvitado : {
            nomeComponente : componenteEvitado.componentName,
            numPerfis : componenteEvitado.count
        },
        consultasHoje,
        produtoMaisConsultado : {
            nomeProduto : produtoMaisConsultado.productName,
            consultas : produtoMaisConsultado.count,
        }
    };

    return res.status(200).json(data);
});

export default rotaRelatorio;
