export type IconKey =
  | "evaluation" | "planning" | "tracking" | "progress"
  | "team" | "individual" | "control" | "adjust"
  | "analysis";

export const site = {
  brand: { pre: "LOW", mid: "UNITY", post: "JTA" },

  contact: {
    whatsapp: "",
    whatsappMessage: "Olá, equipe LOW UNITY JTA! Quero começar minha consultoria de treino online.",
    instagram: "",
    email: "",
  },

  seo: {
    title: "LOW UNITY JTA · Consultoria de Treino Online",
    description:
      "Três personal trainers, um plano feito só para você. Consultoria de treino online com avaliação, planejamento individualizado, acompanhamento e ajustes contínuos.",
  },

  nav: [
    { label: "Método", href: "#metodo" },
    { label: "Diferenciais", href: "#diferenciais" },
    { label: "Equipe", href: "#equipe" },
    { label: "Resultados", href: "#resultados" },
    { label: "Planos", href: "#planos" },
    { label: "Dúvidas", href: "#faq" },
  ],

  hero: {
    image: "",
    eyebrow: "Consultoria de treino online",
    title: "Evolução real exige acompanhamento real.",
    accent: "ACOMPANHAMENTO",
    description: "Três personal trainers. Um plano feito só para você. Ajustes constantes até o resultado aparecer.",
    primary: "Quero começar",
    secondary: { label: "Conhecer o método", href: "#metodo" },
    facts: [
      { value: "03", label: "Personal trainers" },
      { value: "01", label: "Equipe" },
      { value: "100%", label: "Individualizado" },
    ],
  },

  problem: {
    eyebrow: "O problema",
    title: ["Treinar", "sozinho", "trava a evolução."],
    paragraphs: [
      "Planilha genérica não conhece sua rotina, seu histórico nem suas limitações. Ela é a mesma para todo mundo e, por isso, não funciona de verdade para ninguém.",
      "Sem alguém olhando de perto, você repete os mesmos erros, estaciona nas mesmas cargas e não sabe se está progredindo ou só se cansando.",
    ],
    pains: ["Planilhas genéricas", "Treino sem acompanhamento", "Progresso sem medida"],
    solution: {
      eyebrow: "A solução",
      title: "Acompanhamento de quem entende.",
      items: [
        { icon: "individual" as IconKey, title: "Acompanhamento individualizado", text: "Treino pensado para o seu corpo e para a sua rotina." },
        { icon: "analysis" as IconKey, title: "Análise de desempenho", text: "Cargas, execução e evolução avaliadas pela equipe." },
        { icon: "adjust" as IconKey, title: "Ajustes contínuos", text: "O plano muda sempre que você evolui." },
      ],
    },
  },

  method: {
    eyebrow: "Método",
    title: "4 passos. Nenhum atalho.",
    steps: [
      { icon: "evaluation" as IconKey, title: "Avaliação", text: "Entendemos sua rotina, histórico, limitações e objetivo. Ponto de partida real." },
      { icon: "planning" as IconKey, title: "Planejamento do treino", text: "Treino montado para você. Volume, intensidade e frequência sob medida." },
      { icon: "tracking" as IconKey, title: "Acompanhamento e ajustes", text: "Feedback constante. O plano muda quando você evolui." },
      { icon: "progress" as IconKey, title: "Evolução mensurável", text: "Cargas, medidas e fotos registradas. Progresso que se vê em números." },
    ],
  },

  differentials: {
    eyebrow: "Diferenciais",
    title: "Por que a Low Unity.",
    items: [
      { icon: "team" as IconKey, title: "3 treinadores, 1 equipe", text: "Três personal trainers analisando seu progresso juntos." },
      { icon: "individual" as IconKey, title: "100% individualizado", text: "Nada de planilha pronta. Cada treino é feito para um aluno." },
      { icon: "control" as IconKey, title: "Controle total", text: "Acompanhamento da execução, evolução e desempenho." },
      { icon: "adjust" as IconKey, title: "Ajustes contínuos", text: "O planejamento evolui junto com seus resultados." },
    ],
  },

  team: {
    eyebrow: "Equipe",
    title: "Um time. Um objetivo: o seu.",
    members: [
      { name: "Treinador 1", specialty: "Hipertrofia e força", cref: "CREF 000000-G/UF", photo: "" },
      { name: "Treinador 2", specialty: "Emagrecimento e condicionamento", cref: "CREF 000000-G/UF", photo: "" },
      { name: "Treinador 3", specialty: "Performance e mobilidade", cref: "CREF 000000-G/UF", photo: "" },
    ],
  },

  marquee: {
    prefix: "Treino para",
    words: ["Hipertrofia", "Força", "Emagrecimento", "Condicionamento", "Performance", "Mobilidade"],
  },

  results: {
    eyebrow: "Resultados",
    title: "Evolução que se mede.",
    comparisons: [
      { before: "", after: "", caption: "Espaço reservado para resultado real de aluno" },
    ],
    testimonials: [
      { text: "Espaço reservado para depoimento real de aluno.", name: "Nome do aluno", detail: "Objetivo · tempo de consultoria" },
      { text: "Espaço reservado para depoimento real de aluno.", name: "Nome do aluno", detail: "Objetivo · tempo de consultoria" },
      { text: "Espaço reservado para depoimento real de aluno.", name: "Nome do aluno", detail: "Objetivo · tempo de consultoria" },
    ],
  },

  plans: {
    eyebrow: "Planos",
    title: "Escolha seu nível de acompanhamento.",
    currency: "R$",
    period: "/mês",
    items: [
      {
        name: "Essencial",
        price: "000",
        featured: false,
        benefits: ["Avaliação inicial", "Treino individualizado", "Ajustes mensais"],
        cta: "Quero o Essencial",
      },
      {
        name: "Performance",
        price: "000",
        featured: false,
        benefits: ["Tudo do Essencial", "Ajustes quinzenais", "Suporte pelo WhatsApp"],
        cta: "Quero o Performance",
      },
      {
        name: "Elite",
        price: "000",
        featured: true,
        badge: "Mais completo",
        benefits: ["Tudo do Performance", "Ajustes semanais", "Análise de vídeo da execução", "Chamada mensal com a equipe"],
        cta: "Quero o Elite",
      },
    ],
  },

  faq: {
    eyebrow: "Dúvidas",
    title: "Perguntas frequentes.",
    items: [
      {
        q: "Como funciona a consultoria online?",
        a: "Você começa com uma avaliação completa da sua rotina, histórico e objetivo. A partir dela, a equipe monta o seu treino e acompanha a execução e a evolução à distância.",
      },
      {
        q: "Quem vai me acompanhar?",
        a: "Os três personal trainers trabalham como uma equipe só. Todos analisam o seu progresso juntos, então você conta com três olhares sobre o seu treino.",
      },
      {
        q: "Com que frequência o treino é ajustado?",
        a: "Depende do plano escolhido. Além dos ajustes programados, o planejamento muda sempre que o seu desempenho mostrar que é hora de evoluir.",
      },
      {
        q: "Sou iniciante. A consultoria serve para mim?",
        a: "Sim. O treino é montado a partir do seu nível atual, com progressão segura e orientação de execução desde o primeiro dia.",
      },
      {
        q: "Preciso treinar em academia?",
        a: "Na avaliação, você conta onde treina e quais equipamentos tem. O planejamento é feito em cima da sua realidade.",
      },
      {
        q: "Como faço para contratar?",
        a: "Clique em qualquer botão “Quero começar” e fale com a equipe pelo WhatsApp. A gente explica os planos e inicia a sua avaliação.",
      },
    ],
  },

  finalCta: {
    title: "Disciplina começa com a primeira mensagem.",
    description: "Fale com a equipe. Seu plano começa hoje.",
    button: "Quero começar",
  },

  footer: { copyright: "© 2026 LOW UNITY JTA" },
};

export function whatsappHref(message: string = site.contact.whatsappMessage) {
  const number = site.contact.whatsapp.replace(/\D/g, "");
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
