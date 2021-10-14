import ControleUsuario from '../controller/ControleUsuario';
import { Usuario, NivelUsuario } from '../model/Usuario';

const checkForAdmin = async (): Promise<void> => {
    const [, count] = await ControleUsuario.findMany({
        where: { nivel: NivelUsuario.ADMIN },
    });
    if (count == 0) {
        console.log('\nESTA MENSAGEM SERÁ APRRESENTADA APENAS UMA ÚNICA VEZ\n');
        console.log(
            'Administrador não encontrado no banco de dados. Crriando um administrador.'
        );

        const administrator = new Usuario();
        const login = 'admin';
        const senha = 'admin@admin';

        administrator.nome = 'ADMIN';
        administrator.login = login;
        administrator.senha = senha;
        administrator.nivel = NivelUsuario.ADMIN;

        await ControleUsuario.create(administrator);

        console.log('\nAdministrador padrão criado:');
        console.log(`\tLogin: ${login}\n\tSenha: ${senha}\n`);
        console.log(
            'Por favor, troque a senha padrão do admin para evitar problemas de segurança.'
        );
        console.log('\nESTA MENSAGEM SERÁ APRRESENTADA APENAS UMA ÚNICA VEZ\n');
    }
};

export default checkForAdmin;
