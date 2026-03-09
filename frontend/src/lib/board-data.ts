import type { BoardState } from "./types";

export const initialBoardState: BoardState = {
  columns: [
    {
      id: "captacao",
      title: "Prospecção",
      cards: [
        {
          id: "card-captacao-1",
          title: "Vida em Grupo Nova Aurora",
          details:
            "Receber a massa segurável da indústria, validar capital por faixa salarial e confirmar janela comercial para início da vigência.",
        },
        {
          id: "card-captacao-2",
          title: "Prestamista Cooperativa Prisma",
          details:
            "Alinhar escopo do convênio, volume mensal de novos contratos e regra de elegibilidade para adesão automática.",
        },
      ],
    },
    {
      id: "triagem",
      title: "Qualificação",
      cards: [
        {
          id: "card-triagem-1",
          title: "AP Coletivo Rede Humaniza",
          details:
            "Conferir CNAE, perfil ocupacional, dispersão geográfica e histórico do corretor antes do envio para precificação.",
        },
      ],
    },
    {
      id: "analise",
      title: "Precificação",
      cards: [
        {
          id: "card-analise-1",
          title: "Vida Global Tech",
          details:
            "Revisar composição etária, capital médio por vida e cláusulas adicionais de invalidez para fechamento da taxa.",
        },
        {
          id: "card-analise-2",
          title: "Funeral Corporativo Atlas",
          details:
            "Comparar rede assistencial, prazo de implantação e custo por titular para apresentar a melhor condição comercial.",
        },
      ],
    },
    {
      id: "pendencias",
      title: "Pendências",
      cards: [
        {
          id: "card-pendencias-1",
          title: "Vida em Grupo Clínicas Essencial",
          details:
            "Aguardar sinistralidade dos últimos 24 meses e confirmação da convenção coletiva antes da proposta final.",
        },
      ],
    },
    {
      id: "fechamento",
      title: "Implantação",
      cards: [
        {
          id: "card-fechamento-1",
          title: "Vida PME Horizonte Log",
          details:
            "Condição aprovada, kit de implantação enviado e cronograma de cadastro das vidas em validação com RH.",
        },
      ],
    },
  ],
};
