// Conversão do catálogo ExerciseDB (https://oss.exercisedb.dev) para a biblioteca da LOW UNITY JTA.

export type ExerciseDbItem = {
  exerciseId: string;
  name: string;
  gifUrl: string;
  bodyParts: string[];
  equipments: string[];
  targetMuscles: string[];
  secondaryMuscles: string[];
  instructions: string[];
};

/** Categorias de seleção, na ordem exibida para a equipe. */
export const CATEGORIES = [
  "Peito", "Costas", "Ombros", "Bíceps", "Tríceps", "Antebraço", "Trapézio", "Abdômen",
  "Pernas", "Glúteos", "Panturrilha", "Cardio", "Mobilidade", "Pescoço",
] as const;

const MUSCLE_PT: Record<string, string> = {
  pectorals: "Peitoral", "latissimus dorsi": "Dorsal", "upper back": "Costas superiores", rhomboids: "Romboides", back: "Costas",
  "erector spinae": "Lombar", trapezius: "Trapézio", "levator scapulae": "Elevador da escápula", deltoids: "Deltoides",
  "rear deltoids": "Deltoide posterior", "rotator cuff": "Manguito rotador", "serratus anterior": "Serrátil", biceps: "Bíceps",
  brachialis: "Braquial", triceps: "Tríceps", forearms: "Antebraço", "wrist flexors": "Flexores do punho", "wrist extensors": "Extensores do punho",
  "grip muscles": "Pegada", wrists: "Punhos", hands: "Mãos", abdominals: "Abdômen", core: "Core", obliques: "Oblíquos",
  "hip flexors": "Flexores do quadril", quadriceps: "Quadríceps", hamstrings: "Posterior de coxa", glutes: "Glúteos",
  abductors: "Abdutores", adductors: "Adutores", calves: "Panturrilha", soleus: "Sóleo", "tibialis anterior": "Tibial anterior",
  feet: "Pés", ankles: "Tornozelos", "ankle stabilizers": "Estabilizadores do tornozelo", "cardiovascular system": "Cardiovascular",
  sternocleidomastoid: "Pescoço",
};

const MUSCLE_CATEGORY: Record<string, (typeof CATEGORIES)[number]> = {
  pectorals: "Peito", "serratus anterior": "Ombros", "latissimus dorsi": "Costas", "upper back": "Costas", rhomboids: "Costas",
  back: "Costas", "erector spinae": "Costas", trapezius: "Trapézio", "levator scapulae": "Trapézio", deltoids: "Ombros",
  "rear deltoids": "Ombros", "rotator cuff": "Ombros", biceps: "Bíceps", brachialis: "Bíceps", triceps: "Tríceps",
  forearms: "Antebraço", "wrist flexors": "Antebraço", "wrist extensors": "Antebraço", "grip muscles": "Antebraço", wrists: "Antebraço",
  hands: "Antebraço", abdominals: "Abdômen", core: "Abdômen", obliques: "Abdômen", "hip flexors": "Abdômen",
  quadriceps: "Pernas", hamstrings: "Pernas", adductors: "Pernas", glutes: "Glúteos", abductors: "Glúteos",
  calves: "Panturrilha", soleus: "Panturrilha", "tibialis anterior": "Panturrilha", feet: "Panturrilha", ankles: "Panturrilha",
  "ankle stabilizers": "Panturrilha", "cardiovascular system": "Cardio", sternocleidomastoid: "Pescoço",
};

const BODYPART_CATEGORY: Record<string, (typeof CATEGORIES)[number]> = {
  chest: "Peito", back: "Costas", shoulders: "Ombros", "upper arms": "Bíceps", "lower arms": "Antebraço", waist: "Abdômen",
  "upper legs": "Pernas", "lower legs": "Panturrilha", cardio: "Cardio", neck: "Pescoço",
};

const EQUIP_PT: Record<string, string> = {
  bodyweight: "Peso corporal", assisted: "Assistido", cable: "Cabo", barbell: "Barra", "resistance band": "Elástico", dumbbell: "Halter",
  roller: "Rolo", weighted: "Com carga", "smith machine": "Smith", "sled machine": "Leg press", "leverage machine": "Máquina",
  "EZ bar": "Barra W", "stability ball": "Bola suíça", rope: "Corda", "bosu ball": "Bosu", kettlebell: "Kettlebell",
  "suspension trainer": "Suspensão (TRX)", "medicine ball": "Medicine ball", towel: "Toalha", "tennis ball": "Bola de tênis",
  "stationary bike": "Bicicleta", "stepmill machine": "Escada", "trap bar": "Barra hexagonal", "ab wheel": "Roda abdominal",
  "olympic barbell": "Barra olímpica", tire: "Pneu", "upper body ergometer": "Ergômetro de braço", "elliptical machine": "Elíptico",
  hammer: "Marreta", "ski ergometer": "Ergômetro de esqui",
};

export const musclePt = (m?: string | null) => (m ? MUSCLE_PT[m] ?? m : null);
export const equipPt = (e?: string | null) => (e ? EQUIP_PT[e] ?? e : null);

export function categoryFor(x: ExerciseDbItem): (typeof CATEGORIES)[number] {
  if (/stretch|pose\b|mobility/i.test(x.name)) return "Mobilidade";
  const t = x.targetMuscles[0];
  if ((t === "glutes" || t === "abductors") && !/bridge|thrust|kickback|abduct|glute|donkey|hydrant|clam|pull.?through|hip extension/i.test(x.name)) return "Pernas";
  return (t && MUSCLE_CATEGORY[t]) || BODYPART_CATEGORY[x.bodyParts[0]] || "Mobilidade";
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function toExerciseRow(x: ExerciseDbItem) {
  return {
    externalId: x.exerciseId,
    name: cap(x.name.trim()),
    muscleGroup: categoryFor(x),
    targetMuscle: musclePt(x.targetMuscles[0]),
    equipment: equipPt(x.equipments[0]),
    gifUrl: x.gifUrl,
    description: [musclePt(x.targetMuscles[0]), equipPt(x.equipments[0])].filter(Boolean).join(" · ") || null,
    instructions: x.instructions.map((s) => s.replace(/^Step:\s*\d+\s*/i, "").trim()).filter(Boolean).join("\n") || null,
  };
}

/** Exercícios base usados nos treinos, com nome em português (id ExerciseDB → nome). */
export const PT_NAMES: Record<string, string> = {
  EIeI8Vf: "Supino reto com barra",
  ns0SIbU: "Supino inclinado com halteres",
  v3xmPAR: "Crucifixo na máquina",
  j7XMAyn: "Crossover polia alta",
  "9tvVVM9": "Tríceps pulley",
  kont8Ut: "Tríceps francês com halter",
  "9ZGnq1w": "Mergulho entre bancos",
  "0MlxeMn": "Puxada frontal",
  eZyBC3j: "Remada curvada com barra",
  A3P4O0R: "Remada baixa no cabo",
  DT14T9T: "Pulldown com corda",
  "25GPyDY": "Rosca direta com barra",
  "2NpxjC1": "Rosca martelo",
  b6hQYMb: "Rosca Scott na máquina",
  qXTaZnJ: "Agachamento livre",
  "10Z2DXU": "Leg press 45°",
  my33uHU: "Cadeira extensora",
  "17lJ1kr": "Mesa flexora",
  "2Ty4idJ": "Stiff com halteres",
  qKBpF7I: "Elevação pélvica com barra",
  ykUOVze: "Panturrilha em pé na máquina",
  znQUdHY: "Desenvolvimento com halteres",
  DsgkuIt: "Elevação lateral",
  mu5Guxt: "Crucifixo invertido",
  Bn6TXyO: "Abdominal",
  VBAWRPG: "Prancha com carga",
  WhuFnR7: "Elevação de pernas no banco",
  rjiM4L3: "Caminhada na esteira inclinada",
  a8VDgLw: "Bicicleta ergométrica",
  "2LQkNPW": "Alongamento de flexores do quadril",
};
