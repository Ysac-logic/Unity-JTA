// Gera prisma/data/exercise-names-pt.json (exerciseId -> nome em português) a partir do catálogo ExerciseDB.
// Uso: node prisma/translate-names.mjs   (depois: npm run exercises:import)
import { readFileSync, writeFileSync } from "node:fs";

const catalog = JSON.parse(readFileSync(new URL("./data/exercisedb.json", import.meta.url), "utf8"));

// E = equipamento ("com halteres"), N = substantivo principal [pt, gênero, forma como qualificador?],
// M = músculo/parte do corpo ("de tríceps"), A = adjetivo "masc/fem", P = expressão fixa, X = ignorar
const D = {};
const add = (type, rows) => { for (const [k, ...v] of rows) D[k] = [type, ...v]; };

add("E", [
  ["dumbbell", "com halteres"], ["dumbbells", "com halteres"], ["barbell", "com barra"], ["olympic barbell", "com barra olímpica"],
  ["ez bar", "com barra W"], ["ez barbell", "com barra W"], ["ez-bar", "com barra W"], ["cable", "no cabo"], ["band", "com elástico"],
  ["resistance band", "com elástico"], ["smith", "no smith"], ["machine", "na máquina"], ["lever", "na máquina"], ["leverage", "na máquina"],
  ["kettlebell", "com kettlebell"], ["weighted", "com peso"], ["medicine ball", "com medicine ball"], ["stability ball", "na bola suíça"],
  ["bosu ball", "no bosu"], ["bosu", "no bosu"], ["ball", "com bola"], ["sled", "no sled"], ["suspended", "na suspensão"], ["suspension", "na suspensão"],
  ["rope", "com corda"], ["ropes", "com cordas"], ["roller", "com rolo"], ["towel", "com toalha"], ["trap bar", "com barra hexagonal"],
  ["wheel", "com roda"], ["ab wheel", "com roda abdominal"], ["bodyweight", "com peso corporal"], ["body weight", "com peso corporal"],
  ["landmine", "no landmine"], ["chair", "na cadeira"], ["tire", "com pneu"], ["stepmill", "no stepmill"], ["elliptical machine", "no elíptico"],
  ["elliptical", "no elíptico"], ["treadmill", "na esteira"], ["straps", "com straps"], ["strap", "com strap"], ["pad", "com apoio"],
  ["platform", "na plataforma"], ["box", "na caixa"], ["wall", "na parede"], ["trainer", "no TRX"], ["handle", "com pegador"],
  ["attachment", "com acessório"], ["rack", "no rack"], ["ring", "nas argolas"], ["board", "na prancha"], ["bar", "com barra"], ["bars", "nas barras"],
  ["benches", "nos bancos"], ["stirrups", "nos estribos"], ["skin", "com apoio"],
]);

add("M", [
  ["triceps", "de tríceps"], ["biceps", "de bíceps"], ["calf", "de panturrilha"], ["calves", "de panturrilha"], ["chest", "de peito"],
  ["shoulder", "de ombro"], ["hip", "de quadril"], ["back", "de costas"], ["leg", "de pernas"], ["legs", "de pernas"], ["glute", "de glúteo"],
  ["glutes", "de glúteos"], ["gluteus", "de glúteo"], ["wrist", "de punho"], ["neck", "de pescoço"], ["hamstring", "de posterior de coxa"],
  ["hamstrings", "de posterior de coxa"], ["lat", "de dorsal"], ["delt", "de deltoide"], ["deltoid", "de deltoide"], ["quad", "de quadríceps"],
  ["quads", "de quadríceps"], ["knee", "de joelho"], ["knees", "de joelhos"], ["arm", "de braço"], ["arms", "de braços"], ["abs", "de abdômen"],
  ["abdominal", "de abdômen"], ["forearm", "de antebraço"], ["pec", "de peitoral"], ["pectoralis", "de peitoral"], ["trapezius", "de trapézio"],
  ["ankle", "de tornozelo"], ["ankles", "de tornozelos"], ["groin", "de virilha"], ["finger", "de dedos"], ["oblique", "de oblíquos"],
  ["adductor", "de adutores"], ["abductor", "de abdutores"], ["peroneals", "de fibulares"], ["piriformis", "de piriforme"], ["feet", "de pés"],
  ["foot", "de pé"], ["hand", "de mão"], ["hands", "de mãos"], ["head", "de cabeça"], ["elbow", "de cotovelo"], ["scapula", "de escápula"],
  ["spine", "de coluna"], ["flexor", "de flexores"], ["rectus", "de reto"], ["femoris", "femoral"], ["major", "maior"],
]);

add("N", [
  ["bench press", "supino", "m"], ["chest press", "supino", "m"], ["shoulder press", "desenvolvimento", "m"], ["overhead press", "desenvolvimento", "m"],
  ["military press", "desenvolvimento militar", "m"], ["arnold press", "desenvolvimento Arnold", "m"], ["leg press", "leg press", "m"],
  ["press", "press", "m"], ["presses", "press", "m"], ["curl", "rosca", "f"], ["curls", "rosca", "f"], ["hammer curl", "rosca martelo", "f"],
  ["preacher curl", "rosca scott", "f"], ["concentration curl", "rosca concentrada", "f"], ["zottman curl", "rosca Zottman", "f"],
  ["spider curl", "rosca spider", "f"], ["leg curl", "flexão de pernas", "f"], ["wrist curl", "rosca de punho", "f"], ["curl up", "abdominal curl", "m"],
  ["raise", "elevação", "f"], ["raises", "elevação", "f"], ["row", "remada", "f"], ["pulldown", "puxada", "f"], ["pull down", "puxada", "f"], ["pushdown", "tríceps pulley", "m"],
  ["squat", "agachamento", "m"], ["squats", "agachamento", "m"], ["extension", "extensão", "f"], ["fly", "crucifixo", "m"], ["flyes", "crucifixo", "m"],
  ["flye", "crucifixo", "m"], ["flys", "crucifixo", "m"], ["push up", "flexão de braços", "f"], ["pull up", "barra fixa", "f"], ["chin up", "barra fixa supinada", "f"],
  ["dip", "mergulho", "m"], ["dips", "mergulho", "m"], ["lunge", "afundo", "m"], ["lunges", "afundo", "m"], ["crunch", "abdominal", "m"], ["crunches", "abdominal", "m"],
  ["sit up", "abdominal", "m"], ["stretch", "alongamento", "m"], ["twist", "rotação", "f"], ["twists", "rotação", "f"], ["kickback", "coice", "m"],
  ["kickbacks", "coice", "m"], ["kick", "chute", "m"], ["kicks", "chutes", "m"], ["shrug", "encolhimento", "m"], ["deadlift", "levantamento terra", "m"],
  ["plank", "prancha", "f"], ["bridge", "ponte", "f"], ["jump", "salto", "m", "com salto"], ["jumps", "saltos", "m"], ["walk", "caminhada", "f"],
  ["carry", "transporte", "m"], ["pullover", "pullover", "m"], ["crossover", "crossover", "m"], ["crossovers", "crossover", "m"], ["cross", "cruzado", "m"],
  ["burpee", "burpee", "m"], ["thruster", "thruster", "m"], ["snatch", "arranco", "m"], ["clean", "levantamento", "m"], ["jerk", "arremesso", "m"],
  ["swing", "balanço", "m"], ["rollout", "rollout", "m"], ["slam", "arremesso no chão", "m"], ["throw", "arremesso", "m"], ["hang", "suspensão", "f"],
  ["hyperextension", "hiperextensão", "f"], ["good morning", "bom dia", "m"], ["pass", "passagem", "f"], ["rotation", "rotação", "f"],
  ["flexion", "flexão", "f"], ["abduction", "abdução", "f"], ["adduction", "adução", "f"], ["pronation", "pronação", "f"], ["supination", "supinação", "f"],
  ["tilt", "inclinação pélvica", "f"], ["circles", "círculos", "m"], ["circle", "círculo", "m"], ["reach", "alcance", "m"], ["balance", "equilíbrio", "m"],
  ["lift", "levantamento", "m"], ["pose", "postura", "f"], ["march", "marcha", "f"], ["run", "corrida", "f"], ["sprint", "sprint", "m"], ["sprints", "sprint", "m"],
  ["bend", "inclinação", "f"], ["bends", "inclinação", "f"], ["crawl", "rastejada", "f"], ["climb", "escalada", "f"], ["climber", "escalador", "m"],
  ["squeeze", "contração", "f"], ["retraction", "retração", "f"], ["drag", "arrastada", "f"], ["step up", "subida no banco", "f"], ["step", "degrau", "m"],
  ["hold", "isometria", "f"], ["support", "apoio", "m"], ["slide", "deslize", "m"], ["flutter", "batida de pernas", "f"], ["clap", "palmas", "f"],
  ["hug", "abraço", "m"], ["fallout", "fallout", "m"], ["pullups", "barra fixa", "f"], ["ups", "elevação", "f"], ["tap", "toque", "m"], ["touch", "toque", "m"],
  ["touchers", "toque", "m"], ["spell caster", "spell caster", "m"], ["cycle", "pedalada", "f"], ["bike", "bicicleta", "f"], ["drive", "impulsão", "f"],
  ["hops", "saltitos", "m"], ["flip", "giro", "m"], ["thrusts", "estocadas", "f"], ["swimmer", "nadador", "m"], ["carry", "transporte", "m"],
  ["catch", "recepção", "f"], ["release", "soltura", "f"], ["wipers", "limpador de para-brisa", "m"], ["raised", "elevação", "f"], ["lean", "inclinação", "f"],
  ["pulley", "polia", "f"], ["motion", "movimento", "m"], ["pyramid", "pirâmide", "f"], ["sequence", "sequência", "f"], ["position", "posição", "f"],
  ["pull", "puxada", "f"], ["push", "empurrada", "f"], ["sit", "sentar", "m"], ["bug", "inseto morto", "m"], ["crusher", "esmagador", "m"], ["skullcrusher", "tríceps testa", "m"],
  ["dog", "cachorro", "m"], ["cobra", "cobra", "f"], ["superman", "superman", "m"], ["skater", "patinador", "m"], ["scissor", "tesoura", "f"],
  ["windmill", "moinho de vento", "m"], ["stabilization", "estabilização", "f"], ["release", "soltura", "f"],
]);

add("A", [
  ["incline", "inclinado/inclinada"], ["decline", "declinado/declinada"], ["flat", "reto/reta"], ["seated", "sentado/sentada"], ["standing", "em pé"],
  ["lying", "deitado/deitada"], ["kneeling", "ajoelhado/ajoelhada"], ["single", "unilateral"], ["one", "unilateral"], ["alternate", "alternado/alternada"],
  ["alternating", "alternado/alternada"], ["reverse", "inverso/inversa"], ["reversed", "inverso/inversa"], ["wide", "aberto/aberta"], ["narrow", "fechado/fechada"],
  ["close", "fechado/fechada"], ["bent", "curvado/curvada"], ["front", "frontal"], ["rear", "posterior"], ["lateral", "lateral"], ["side", "lateral"],
  ["high", "alto/alta"], ["low", "baixo/baixa"], ["stiff", "stiff"], ["sumo", "sumô"], ["romanian", "romeno/romena"], ["split", "split"], ["hack", "hack"],
  ["goblet", "goblet"], ["sissy", "sissy"], ["pistol", "pistol"], ["straight", "reto/reta"], ["overhead", "acima da cabeça"], ["assisted", "assistido/assistida"],
  ["inverse", "inverso/inversa"], ["inverted", "invertido/invertida"], ["prone", "em decúbito ventral"], ["supine", "em decúbito dorsal"],
  ["hanging", "suspenso/suspensa"], ["twisting", "com rotação"], ["twisted", "com rotação"], ["rotational", "rotacional"], ["full", "completo/completa"],
  ["half", "parcial"], ["modified", "modificado/modificada"], ["extended", "estendido/estendida"], ["parallel", "paralelo/paralela"], ["neutral", "neutro/neutra"],
  ["vertical", "vertical"], ["horizontal", "horizontal"], ["diagonal", "diagonal"], ["double", "duplo/dupla"], ["both", "bilateral"], ["russian", "russo/russa"],
  ["external", "externo/externa"], ["internal", "interno/interna"], ["posterior", "posterior"], ["inner", "interno/interna"], ["outer", "externo/externa"],
  ["upper", "superior"], ["lower", "inferior"], ["middle", "médio/média"], ["deep", "profundo/profunda"], ["dynamic", "dinâmico/dinâmica"], ["isometric", "isométrico/isométrica"],
  ["negative", "negativo/negativa"], ["quick", "rápido/rápida"], ["fixed", "fixo/fixa"], ["forward", "para frente"], ["backward", "para trás"], ["circular", "circular"],
  ["flexor", "flexor"], ["elevated", "elevado/elevada"], ["raised", "elevado/elevada"], ["advanced", "avançado/avançada"], ["intermediate", "intermediário/intermediária"],
  ["supported", "apoiado/apoiada"], ["unilateral", "unilateral"], ["contralateral", "contralateral"], ["cambered", "curvada"], ["angled", "angulado/angulada"],
  ["outstretched", "com braços estendidos"], ["clasped", "com mãos unidas"], ["squatting", "agachado/agachada"], ["walking", "andando"], ["swinging", "com balanço"],
  ["round", "arredondado/arredondada"], ["short", "curto/curta"], ["big", "grande"], ["multiple", "múltiplo/múltipla"], ["left", "esquerdo/esquerda"],
  ["reclining", "reclinado/reclinada"], ["mixed", "misto/mista"], ["gripless", "sem pegada"], ["plyo", "pliométrico/pliométrica"], ["pov", "pov"],
  ["self", "autoassistido"], ["slow", "lento/lenta"], ["tall", "alto/alta"], ["wheel", "com roda"],
]);

add("P", [
  ["wide grip", "com pegada aberta"], ["close grip", "com pegada fechada"], ["neutral grip", "com pegada neutra"], ["reverse grip", "com pegada invertida"],
  ["underhand", "com pegada supinada"], ["overhand", "com pegada pronada"], ["palm", "palmas"], ["palms", "palmas"], ["grip", "pegada"], ["hands", "mãos"],
  ["behind head", "atrás da cabeça"], ["behind neck", "atrás da nuca"], ["behind back", "atrás das costas"], ["behind", "atrás"],
  ["on floor", "no chão"], ["floor", "no chão"], ["on bench", "no banco"], ["bench", "no banco"], ["on knees", "de joelhos"], ["knees", "de joelhos"],
  ["from", "a partir de"], ["into", "para"], ["off", "fora"], ["around", "ao redor"], ["across", "cruzado"], ["through", "através"], ["against", "contra"],
  ["above", "acima"], ["under", "sob"], ["outside", "por fora"], ["inside", "por dentro"], ["apart", "afastado"], ["out", "para fora"], ["down", "para baixo"],
  ["over", "sobre"], ["between", "entre"], ["toe", "na ponta dos pés"], ["toes", "na ponta dos pés"], ["heel", "calcanhar"], ["stance", "com base"], ["style", "estilo"],
  ["degrees", "graus"], ["45", "45°"], ["45°", "45°"], ["90", "90°"], ["180", "180°"], ["360", "360°"], ["to", "até"], ["pro", "pro"], ["v", "em V"], ["t", "em T"], ["y", "em Y"],
  ["l", "em L"], ["w", "em W"], ["jm", "JM"], ["pike", "pike"], ["tuck", "grupado"], ["straddle", "afastado"], ["planche", "planche"], ["archer", "arqueiro"],
  ["frog", "sapo"], ["tate", "Tate"], ["svend", "Svend"], ["gironda", "Gironda"], ["bradford", "Bradford"], ["rocky", "Rocky"], ["scott", "Scott"],
  ["otis", "Otis"], ["jefferson", "Jefferson"], ["zercher", "Zercher"], ["thibaudeau", "Thibaudeau"], ["pendlay", "Pendlay"], ["pallof", "Pallof"],
  ["janda", "Janda"], ["cuban", "cubano"], ["kipping", "kipping"], ["stalder", "stalder"], ["maltese", "maltês"], ["korean", "coreano"],
  ["turkish", "turco"], ["hindu", "hindu"], ["cossack", "cossaco"], ["curtsey", "reverência"], ["monster", "monstro"], ["spider", "aranha"],
  ["bear", "urso"], ["cat", "gato"], ["crab", "caranguejo"], ["stork", "cegonha"], ["mountain", "montanha"], ["iron", "ferro"], ["bowling", "boliche"],
  ["gorilla", "gorila"], ["frankenstein", "Frankenstein"], ["london", "Londres"], ["world", "mundo"], ["greatest", "maior"], ["captains", "do capitão"], ["farmers", "do fazendeiro"],
  ["waiter", "garçom"], ["prisoner", "prisioneiro"], ["figure", "figura"], ["four", "quatro"], ["fours", "quatro apoios"], ["all", "todos"], ["three", "três"], ["two", "duas"],
  ["3", "3"], ["4", "4"], ["8", "8"], ["a", ""], ["the", ""], ["of", ""], ["in", ""], ["on", ""], ["with", ""], ["and", ""], ["up", ""], ["exercise", ""], ["reps", "repetições"],
  ["left", "esquerda"], ["right", "direita"], ["can", "lata"], ["get", ""], ["half", "meia"], ["point", "ponto"], ["range", "amplitude"], ["response", "resposta"],
  ["butt", "glúteos"], ["wind", "vento"], ["draw", "puxada"], ["quarter", "um quarto"], ["pin", "pino"], ["semi", "semi"], ["staircase", "escada"], ["plus", "mais"],
  ["potty", "sentado no vaso"], ["cocoons", "casulo"], ["cobra", "cobra"], ["sphinx", "esfinge"], ["bicycle", "bicicleta"], ["rocking", "balanço"], ["yoga", "ioga"],
  ["trap", "hexagonal"], ["skier", "esquiador"], ["boxing", "boxe"], ["star", "estrela"], ["judo", "judô"], ["cage", "gaiola"], ["power", "potência"], ["speed", "velocidade"],
  ["depth", "profundidade"], ["lean", "inclinação"], ["hug", "abraço"], ["inchworm", "inchworm"], ["slingers", "slingers"], ["hyper", "hiper"], ["battling", "ondulação"], ["knife", "canivete"],
  ["jackknife", "canivete"], ["dead", "morto"], ["cocoons", "casulo"], ["drop", "queda"], ["modified", "modificado"], ["spell", "spell"], ["caster", "caster"], ["hyght", "Hyght"],
  ["sz", "SZ"], ["seesaw", "gangorra"], ["windshield", "para-brisa"], ["saw", "serra"], ["lat", "dorsal"], ["delt", "deltoide"],
]);

// Ajustes e expressões compostas (sobrescrevem entradas anteriores).
for (const k of ["preacher curl", "hammer curl", "concentration curl", "zottman curl", "cross"]) delete D[k];
add("E", [
  ["exercise ball", "na bola suíça"], ["tennis ball", "com bola de tênis"], ["stationary bike", "na bicicleta ergométrica"], ["ski ergometer", "no ergômetro de esqui"],
  ["upper body ergometer", "no ergômetro de braço"], ["ergometer", "no ergômetro"], ["stepbox", "na caixa"], ["dip cage", "na gaiola de mergulho"],
  ["equipment", ""], ["sledge hammer", "com marreta"],
]);
add("A", [
  ["preacher", "scott"], ["hammer", "martelo"], ["concentration", "concentrada/concentrada"], ["zottman", "Zottman"], ["single arm", "unilateral"], ["one arm", "unilateral"],
  ["single leg", "unilateral"], ["one leg", "unilateral"], ["single legged", "unilateral"], ["prsingle leg", "unilateral"], ["bent over", "curvado/curvada"],
  ["pronate", "pronado/pronada"], ["pronated", "pronado/pronada"], ["supinated", "supinado/supinada"], ["impossible", "impossível"], ["astride", "afastado/afastada"],
  ["diamond", "diamante"], ["rotary", "rotativo/rotativa"], ["scapular", "escapular"], ["renegade", "renegade"], ["twin handle", "com pegador duplo"],
  ["cross body", "cruzado/cruzada"], ["cross", "cruzado/cruzada"], ["left", "esquerdo/esquerda"], ["upright", "alto/alta"],
]);
add("M", [["squad", "de quadríceps"], ["ab", "de abdômen"], ["ham", "de posterior de coxa"], ["tibialis", "de tibial"]]);
add("N", [
  ["upright row", "remada alta", "f"], ["french press", "tríceps francês", "m"], ["jack jump", "polichinelo", "m"], ["jumping jack", "polichinelo", "m"],
  ["jack", "polichinelo", "m"], ["jack knife", "abdominal canivete", "m"], ["jackknife", "abdominal canivete", "m"], ["donkey calf raise", "elevação de panturrilha no burro", "f"],
  ["donkey kick", "coice de burro", "m"], ["muscle up", "muscle-up", "m"], ["face press", "supino testa", "m"], ["skull press", "supino testa", "m"],
  ["glute ham raise", "elevação glúteo-posterior", "f"], ["ski step", "passo de esqui", "m"], ["pelvic tilt", "inclinação pélvica", "f"], ["tilt", "inclinação", "f"],
  ["mountain climber", "escalador", "m"], ["body saw", "serrote corporal", "m"], ["wrist rollerer", "rolo de punho", "m"], ["upward facing dog", "cachorro olhando para cima", "m"],
  ["hook", "gancho", "m"], ["flag", "bandeira", "f"], ["elevator", "elevador", "m"], ["handstand", "parada de mão", "f"], ["rotate", "rotação", "f"], ["butterfly", "borboleta", "f"],
  ["gripper", "gripper", "m"], ["lifting", "levantamento", "m"], ["sledge hammer", "marreta", "f"], ["v sit", "abdominal em V", "m"], ["calf", "panturrilha", "f"], ["face pull", "puxada na face", "f"],
  ["hammer press", "supino martelo", "m"], ["bottoms up", "bottoms-up", "m"], ["bottoms", "bottoms-up", "m"], ["run", "corrida", "f"], ["muscle", "músculo", "m"],
]);
delete D["calf"]; add("M", [["calf", "de panturrilha"]]);
delete D["hammer press"]; delete D["muscle"]; delete D["tilt"];
add("P", [
  ["bent knee", "com joelho flexionado"], ["bent arm", "com braço flexionado"], ["bent leg", "com perna flexionada"], ["over bench", "sobre o banco"], ["palms in", "palmas para dentro"],
  ["palms out", "palmas para fora"], ["hammer grip", "com pegada martelo"], ["pronate grip", "com pegada pronada"], ["back and forth", "para frente e para trás"], ["anti gravity", "antigravidade"],
  ["side to side", "lado a lado"], ["chin", "queixo"], ["face", "rosto"], ["clock", "relógio"], ["stride", "de passada"], ["runners", "de corredor"], ["sternum", "esterno"],
  ["closer", "closer"], ["angle", "ângulo"], ["kayak", "caiaque"], ["ground", "chão"], ["depressor", "depressores"], ["retractor", "retratores"], ["facing", ""], ["upward", "para cima"],
  ["ski", "esqui"], ["guillotine", "guilhotina"], ["rotational", "rotacional"], ["lower body", "do corpo inferior"], ["body", "corpo"], ["off ground", "fora do chão"],
  ["on the wall", "na parede"], ["gravity", "gravidade"], ["pov", ""], ["back pov", "visão por trás"], ["with arm blaster", "com arm blaster"], ["blaster", "blaster"],
  ["legged", "unilateral"], ["forth", ""],
]);

delete D["trainer"];
add("E", [["smith machine", "no smith"], ["cross trainer", "no elíptico"], ["suspension trainer", "no TRX"], ["rope attachment", "com corda"], ["v bar", "com barra V"], ["sz bar", "com barra SZ"]]);
add("N", [["chin ups", "barra fixa supinada", "f"], ["jackknife sit up", "abdominal canivete", "m"], ["jack knife sit up", "abdominal canivete", "m"], ["push press", "push press", "m"], ["lunge with jump", "afundo com salto", "m"]]);
add("P", [["skull", "testa"], ["palms up", "palmas para cima"], ["palms down", "palmas para baixo"], ["over a bench", "sobre o banco"], ["grip", "com pegada"], ["hands against wall", "com as mãos na parede"]]);

// Ordem importa: frases mais longas primeiro (feito abaixo por tamanho).
const keys = Object.keys(D).sort((a, b) => b.split(" ").length - a.split(" ").length);

const norm = (s) => s.toLowerCase().replace(/[(),:.']/g, " ").replace(/[-/]/g, " ").replace(/\s+/g, " ").trim();
const unknown = new Map();

function tokensOf(text) {
  const words = norm(text).split(" ").filter(Boolean);
  const out = [];
  for (let i = 0; i < words.length; ) {
    let hit = null;
    for (const k of keys) {
      const n = k.split(" ").length;
      if (n <= words.length - i && words.slice(i, i + n).join(" ") === k.replace(/-/g, " ")) { hit = [k, n]; break; }
    }
    if (hit) { out.push({ k: hit[0], spec: D[hit[0]] }); i += hit[1]; }
    else { unknown.set(words[i], (unknown.get(words[i]) ?? 0) + 1); out.push({ k: words[i], spec: ["U", words[i]] }); i++; }
  }
  return out;
}

const gender = (a, g) => { const [m, f] = a.split("/"); return g === "f" && f ? f : m; };

function translatePart(text) {
  const toks = tokensOf(text);
  const nouns = toks.filter((t) => t.spec[0] === "N");
  const head = nouns[nouns.length - 1];
  const g = head?.spec[2] ?? "m";
  let headPt = head?.spec[1];
  const has = (k) => toks.some((t) => t.k === k);
  if (head && head.k === "press" && (has("incline") || has("decline") || has("flat") || has("bench"))) headPt = "supino";
  if (head && head.k === "curl" && has("preacher")) headPt = "rosca scott";
  if (head && head.k === "curl" && has("hammer")) headPt = "rosca martelo";
  const parts = [], adjs = [], equip = [], quals = [];
  for (const t of toks) {
    const [type, pt, , mod] = t.spec;
    if (t === head) continue;
    if (type === "E") { if (!equip.includes(pt)) equip.push(pt); }
    else if (type === "A") adjs.push(gender(pt, g));
    else if (type === "M") { if (!(headPt ?? "").includes(pt.replace(/^de /, "")) && !quals.includes(pt)) quals.push(pt); }
    else if (type === "N") parts.push(mod ?? `com ${pt}`);
    else if (type === "P" || type === "U") { if (pt) parts.push(pt); }
  }
  const body = headPt ? [headPt, ...quals, ...adjs, ...parts] : [...quals, ...adjs, ...parts];
  const joined = [...body, ...equip].join(" ").replace(/\s+/g, " ").trim();
  return joined;
}

export function translateName(name) {
  const m = name.match(/^(.*?)\s*\((.*)\)\s*(.*)$/);
  let out;
  if (m) {
    const main = translatePart(`${m[1]} ${m[3]}`);
    const inner = translatePart(m[2]);
    out = inner ? `${main} (${inner})` : main;
  } else out = translatePart(name);
  return out.charAt(0).toUpperCase() + out.slice(1);
}

if (process.argv[1] && process.argv[1].endsWith("translate-names.mjs")) {
  const res = {};
  for (const x of catalog) res[x.exerciseId] = translateName(x.name);
  writeFileSync(new URL("./data/exercise-names-pt.json", import.meta.url), JSON.stringify(res, null, 1) + "\n");
  console.log(`${catalog.length} nomes traduzidos.`);
  const u = [...unknown.entries()].sort((a, b) => b[1] - a[1]);
  console.log(`Palavras não traduzidas: ${u.length}`, u.map(([w, n]) => `${w}:${n}`).join(" "));
}
