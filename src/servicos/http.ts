import { API_URL } from '../config';

type Metodo = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface Opcoes {
  metodo?: Metodo;
  token?: string;
  corpo?: object;
}

// Uma função só para falar com a API. Ela monta a URL, põe o token no
// cabeçalho Authorization, converte o corpo para JSON e trata o erro.
export async function requisicao<T>(caminho: string, opcoes: Opcoes = {}): Promise<T> {
  if (!API_URL) {
    throw new Error('EXPO_PUBLIC_API_URL não definida: confira o arquivo .env');
  }
  const cabecalhos: Record<string, string> = { 'Content-Type': 'application/json' };
  if (opcoes.token) {
    cabecalhos.Authorization = `Bearer ${opcoes.token}`;
  }
  const resposta = await fetch(API_URL + caminho, {
    method: opcoes.metodo ?? 'GET',
    headers: cabecalhos,
    body: opcoes.corpo ? JSON.stringify(opcoes.corpo) : undefined,
  });
  const dados = await resposta.json().catch(() => ({}));
  // 401 COM token = o token venceu. Sem token (no login), 401 é senha errada,
  // e a mensagem certa é a que a própria API mandou.
  if (resposta.status === 401 && opcoes.token) {
    throw new Error('Sessão expirada. Saia e entre de novo.');
  }
  if (!resposta.ok) {
    throw new Error(dados.error ?? `Erro ${resposta.status} ao chamar a API.`);
  }
  return dados as T;
}

// Transforma qualquer erro capturado num texto para mostrar na tela.
export function mensagemDe(erro: unknown): string {
  return erro instanceof Error ? erro.message : 'Erro inesperado.';
}
