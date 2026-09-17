window.NB_STORE_DATA = {
  brand: {
    name: "NARROWBORNE",
    domain: "narrowborne.com.br",
    instagram: "",
    whatsapp: "",
    email: ""
  },
  payments: {
    provider: "external",
    checkoutUrl: "",
    checkoutLabel: "Ir para pagamento"
  },
  chat: {
    enabled: true,
    botName: "NARROW Assist",
    welcome: "Olá! Sou o assistente virtual da NARROWBORNE. Pode escrever sua dúvida que eu vou tentar ajudar.",
    whatsapp: "",
    whatsappMessage: "Olá! Vim pelo atendimento do site e preciso de ajuda.",
    offlineText: "Nosso atendimento humano está fora do horário agora. O robô continua disponível e sua mensagem no WhatsApp poderá ser respondida posteriormente.",
    schedule: {
      timezone: "America/Sao_Paulo",
      days: [1, 2, 3, 4, 5, 6],
      start: "09:00",
      end: "18:00"
    },
    faqs: [
      {
        id: "pagamento",
        question: "Quais são as formas de pagamento?",
        keywords: ["pagamento", "pagar", "pix", "cartão", "cartao", "boleto", "parcelar", "parcelamento"],
        answer: "As formas disponíveis aparecem no checkout seguro quando você finaliza o carrinho. Se precisar confirmar uma opção específica antes da compra, posso chamar um atendente."
      },
      {
        id: "entrega",
        question: "Como funciona a entrega?",
        keywords: ["entrega", "frete", "envio", "prazo", "chegar", "cep", "transportadora", "correios"],
        answer: "O prazo e a forma de entrega dependem do endereço e da modalidade disponível para o pedido. Para uma estimativa exata, fale com o atendimento e informe seu CEP."
      },
      {
        id: "trocas",
        question: "Como faço uma troca ou devolução?",
        keywords: ["troca", "trocar", "devolução", "devolucao", "devolver", "reembolso", "defeito"],
        answer: "Para solicitar troca ou devolução, fale com nosso atendimento e tenha em mãos o número do pedido, a peça e o motivo da solicitação. Vamos orientar você sobre os próximos passos."
      },
      {
        id: "pedido",
        question: "Preciso de ajuda com meu pedido",
        keywords: ["pedido", "rastreio", "rastrear", "código", "codigo", "comprou", "compra", "status"],
        answer: "Consigo encaminhar você ao atendimento humano. Tenha o número do pedido ou o e-mail usado na compra para facilitar a consulta."
      },
      {
        id: "tamanhos",
        question: "Quais tamanhos estão disponíveis?",
        keywords: ["tamanho", "tamanhos", "medida", "medidas", "veste", "modelagem"],
        answer: "Os tamanhos disponíveis aparecem na página de cada peça. Selecione um deles antes de adicionar o produto ao carrinho."
      },
      {
        id: "produtos",
        question: "Quero informações sobre os produtos",
        keywords: ["produto", "produtos", "camiseta", "camisetas", "peça", "peca", "drop", "coleção", "colecao", "estoque"],
        answer: "Abra a página da peça para ver descrição, valor, tamanhos e disponibilidade. Se ainda ficar alguma dúvida, escreva o nome do produto aqui."
      },
      {
        id: "loja",
        question: "Como funciona a loja?",
        keywords: ["loja", "funciona", "comprar", "compra online", "site", "seguro", "confiável", "confiavel"],
        answer: "Você escolhe a peça, seleciona o tamanho, adiciona ao carrinho e segue para o pagamento configurado pela loja. Se precisar de ajuda em qualquer etapa, continue falando comigo."
      }
    ]
  },
  hero: {
    eyebrow: "Christian streetwear · São Paulo",
    titleTop: "FEW",
    titleBottom: "FIND IT.",
    text: "Uma marca para quem escolhe o caminho estreito sem esconder a própria identidade.",
    primaryCta: "Conhecer o primeiro drop",
    primaryUrl: "#drop",
    secondaryCta: "Mateus 7:14",
    secondaryUrl: "#manifesto"
  },
  manifesto: {
    eyebrow: "The narrow way",
    title: "NÃO É SÓ\nO QUE VOCÊ VESTE.",
    text: "NARROWBORNE nasce da ideia do caminho estreito de Mateus 7:14: uma identidade construída em fé, propósito e escolha. Sem excesso. Sem precisar gritar para ser reconhecida.",
    scripture: "MATTHEW 7:14 · FEW FIND IT."
  },
  drop: {
    eyebrow: "First capsule",
    title: "DROP 01",
    description: "Primeira cápsula NARROWBORNE. Streetwear cristão com modelagem oversized, identidade limpa e propósito."
  },
  products: [
    {
      id: "narrow-714",
      name: "NARROW 714",
      subtitle: "Oversized · Black",
      price: "",
      status: "Em breve",
      image: "",
      description: "Oversized inspirada em Mateus 7:14.",
      sizes: ["P", "M", "G", "GG"],
      active: true,
      tone: "black",
      actionLabel: "Tenho interesse",
      actionType: "whatsapp",
      actionUrl: ""
    },
    {
      id: "made-new-517",
      name: "MADE NEW 517",
      subtitle: "Oversized · Washed ash",
      price: "",
      status: "Em breve",
      image: "",
      description: "Uma peça sobre nova identidade e recomeço.",
      sizes: ["P", "M", "G", "GG"],
      active: true,
      tone: "ash",
      actionLabel: "Tenho interesse",
      actionType: "whatsapp",
      actionUrl: ""
    },
    {
      id: "light-15",
      name: "LIGHT 15",
      subtitle: "Oversized · Bone",
      price: "",
      status: "Em breve",
      image: "",
      description: "Inspirada na luz que brilha nas trevas.",
      sizes: ["P", "M", "G", "GG"],
      active: true,
      tone: "bone",
      actionLabel: "Tenho interesse",
      actionType: "whatsapp",
      actionUrl: ""
    }
  ]
};
