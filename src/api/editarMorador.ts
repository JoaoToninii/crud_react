import { ROTAS } from '../config';
import { requisicao } from '../servicos/http';
import { somenteDigitos } from '../utils/formatar';
import { DadosMorador } from './cadastrarMorador';
import { Sessao } from './login';

// PUT = atualização parcial: a API só mexe nos campos enviados.
// Telefone fica de fora: a edição desta API não aceita telefone.
export async function editarMorador(
  sessao: Sessao,
  idMorador: string,
  dados: DadosMorador,
): Promise<void> {
  await requisicao(`${ROTAS.residentes}${idMorador}`, {
    metodo: 'PUT',
    token: sessao.token,
    corpo: {
      nome: dados.nome.trim(),
      cpf: somenteDigitos(dados.cpf),
      email: dados.email.trim(),
    },
  });
}
