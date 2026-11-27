import { ROTAS } from '../config';
import { requisicao } from '../servicos/http';
import { Sessao } from './login';

// O método é DELETE, mas a API NÃO apaga: muda o morador para ativo = 0.
// O cadastro continua no banco (exclusão lógica) e some da lista de ativos.
export async function inativarMorador(sessao: Sessao, idMorador: string): Promise<void> {
  await requisicao(`${ROTAS.residentes}${idMorador}`, {
    metodo: 'DELETE',
    token: sessao.token,
  });
}
