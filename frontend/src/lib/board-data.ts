import type { BoardState } from "./types";

export const initialBoardState: BoardState = {
  columns: [
    {
      id: "captacao",
      title: "Captação",
      cards: [
        {
          id: "card-captacao-1",
          title: "Renovação Auto Frota",
          details: "Mapear dados da frota da Transportes Horizonte para cotação anual.",
        },
        {
          id: "card-captacao-2",
          title: "Seguro Empresarial Filial Recife",
          details: "Validar questionário inicial da operação e agendar visita técnica.",
        },
      ],
    },
    {
      id: "triagem",
      title: "Triagem",
      cards: [
        {
          id: "card-triagem-1",
          title: "Vida em Grupo Cooperativa Sul",
          details: "Conferir relação de vidas e documentação cadastral recebida.",
        },
      ],
    },
    {
      id: "analise",
      title: "Análise Técnica",
      cards: [
        {
          id: "card-analise-1",
          title: "RC Profissional Clínica Mais Vida",
          details: "Revisar histórico de sinistros e limites sugeridos pela subscrição.",
        },
        {
          id: "card-analise-2",
          title: "Transporte Nacional Cargas",
          details: "Comparar franquias e cláusulas para a operação interestadual.",
        },
      ],
    },
    {
      id: "pendencias",
      title: "Pendências",
      cards: [
        {
          id: "card-pendencias-1",
          title: "Patrimonial Rede Solar",
          details: "Aguardar envio do laudo elétrico e atualização do valor em risco.",
        },
      ],
    },
    {
      id: "fechamento",
      title: "Fechamento",
      cards: [
        {
          id: "card-fechamento-1",
          title: "Saúde PME Grupo Atlântico",
          details: "Condição comercial aprovada e proposta liberada para assinatura.",
        },
      ],
    },
  ],
};
