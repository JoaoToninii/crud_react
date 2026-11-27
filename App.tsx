import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Sessao } from './src/api/login';
import { Botao } from './src/componentes/Botao';
import { apagarSessao, lerSessao, salvarSessao } from './src/servicos/armazenamento';
import { lerClaims, tokenExpirado } from './src/servicos/jwt';
import { TelaLogin } from './src/telas/TelaLogin';

export default function App() {
  const [sessao, setSessao] = useState<Sessao | null>(null);
  const [verificando, setVerificando] = useState(true);

  // Roda UMA vez, quando o app abre: procura uma sessão guardada no cofre.
  useEffect(() => {
    async function restaurar() {
      const salva = await lerSessao();
      if (salva) {
        const anterior: Sessao = JSON.parse(salva);
        if (tokenExpirado(anterior.token)) {
          await apagarSessao();
        } else {
          setSessao(anterior);
        }
      }
      setVerificando(false);
    }
    restaurar();
  }, []);

  async function entrou(nova: Sessao) {
    await salvarSessao(JSON.stringify(nova));
    setSessao(nova);
  }

  async function sair() {
    await apagarSessao();
    setSessao(null);
  }

  if (verificando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color="#14A5C4" />
      </View>
    );
  }

  if (!sessao) {
    return <TelaLogin aoEntrar={entrou} />;
  }

  const expira = new Date((lerClaims(sessao.token).exp ?? 0) * 1000);
  return (
    <View style={styles.centro}>
      <Text style={styles.titulo}>Olá, {sessao.nome}!</Text>
      <Text style={styles.linha}>Condomínio: {sessao.idCondominio}</Text>
      <Text style={styles.linha}>Token válido até {expira.toLocaleString('pt-BR')}</Text>
      <Botao rotulo="Sair" variante="secundario" aoTocar={sair} />
      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  centro: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    gap: 8,
    backgroundColor: '#F1F5F9',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F1B33',
  },
  linha: {
    fontSize: 16,
    color: '#334155',
    marginBottom: 8,
  },
});
