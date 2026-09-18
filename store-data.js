window.NB_STORE_DATA = {
  brand: {
    name: "NARROWBORNE",
    domain: "narrowborne.com.br",
    instagram: "",
    whatsapp: "",
    email: ""
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
      id: "graca-sobre-graca",
      name: "GRAÇA SOBRE GRAÇA",
      subtitle: "Oversized · Black",
      price: "R$ 149,90",
      status: "Disponível em breve",
      image: "assets/products/graca-sobre-graca.png",
      description: "Graça sobre graça. Peça NARROWBORNE de identidade cristã e estética streetwear.",
      sizes: ["P", "M", "G", "GG"],
      active: true,
      tone: "black",
      actionLabel: "Comprar agora",
      actionType: "none",
      actionUrl: ""
    },
    {
      id: "jesus-salva-bro",
      name: "JESUS SALVA BRO",
      subtitle: "Oversized · Black",
      price: "R$ 149,90",
      status: "Disponível em breve",
      image: "assets/products/jesus-salva-bro.png",
      description: "Jesus salva, bro. Uma peça direta, urbana e centrada na mensagem.",
      sizes: ["P", "M", "G", "GG"],
      active: true,
      tone: "black",
      actionLabel: "Comprar agora",
      actionType: "none",
      actionUrl: ""
    },
    {
      id: "nao-por-vista",
      name: "NÃO POR VISTA",
      subtitle: "Oversized · Black",
      price: "R$ 149,90",
      status: "Disponível em breve",
      image: "assets/products/nao-por-vista.png",
      description: "Não por vista. Uma peça inspirada em caminhar por fé, não apenas pelo que se vê.",
      sizes: ["P", "M", "G", "GG"],
      active: true,
      tone: "black",
      actionLabel: "Comprar agora",
      actionType: "none",
      actionUrl: ""
    }
  ]
};

// Dados publicados vêm do Supabase. O bloco acima é apenas um fallback caso a API fique indisponível.
(() => {
  const STORE_API = 'https://nseqwtiwsabglzqqwibb.supabase.co/functions/v1/public-store';
  fetch(STORE_API, { headers: { 'Accept': 'application/json' }, cache: 'no-store' })
    .then(async (response) => {
      if (!response.ok) throw new Error('Falha ao carregar a loja.');
      return response.json();
    })
    .then((data) => {
      if (!data || !Array.isArray(data.products)) return;
      window.NB_STORE_DATA = data;
      window.dispatchEvent(new CustomEvent('nb-store-ready', { detail: data }));
    })
    .catch((error) => console.warn('NARROWBORNE: usando dados locais de segurança.', error));
})();
