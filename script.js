// Base de datos de pruebas por ODS
const questions = [
  {
    ods: "3 – Salud y bienestar",
    text: "Vuestra empresa lanza una app de salud. ¿Qué opción es más sostenible?",
    answers: [
      "A) Recopilar todos los datos médicos sin consentimiento para venderlos a terceros.",
      "B) Diseñar la app con privacidad por defecto, consentimiento informado y acceso gratuito a servicios básicos.",
      "C) Limitar el uso de la app solo a usuarios de altos ingresos.",
      "D) No garantizar la seguridad de los datos para reducir costes."
    ],
    correct: 1,
    explanation: "La opción B respeta el derecho a la salud, la privacidad y el acceso equitativo, alineándose con el ODS 3."
  },
  {
    ods: "8 – Trabajo decente",
    text: "¿Cómo organizaríais el equipo de desarrollo para cumplir el ODS 8?",
    answers: [
      "A) Contratar a todo el mundo como autónomos sin cotizar, con jornadas de 12 horas.",
      "B) Ofrecer contratos estables, horarios razonables, formación continua y equilibrio vida‑trabajo.",
      "C) Pagar solo a quienes trabajan más horas, sin vacaciones.",
      "D) No ofrecer formación para ahorrar costes."
    ],
    correct: 1,
    explanation: "La opción B fomenta empleo decente, formación y condiciones laborales justas (ODS 8)."
  },
  {
    ods: "14 – Vida submarina",
    text: "Vuestra startup diseña sensores para monitorear la salud de los océanos. ¿Qué decisión es más sostenible?",
    answers: [
      "A) Fabricar sensores con plásticos no reciclables y baterías de larga vida útil.",
      "B) Usar materiales reciclables, diseño modular y plan de recogida de dispositivos usados.",
      "C) Lanzar sensores al mar sin control para que se pierdan.",
      "D) No preocuparse por el impacto ambiental del hardware."
    ],
    correct: 1,
    explanation: "La opción B minimiza la contaminación y protege los ecosistemas marinos (ODS 14)."
  },
  {
    ods: "15 – Vida terrestre",
    text: "¿Cómo diseñaríais un data center para respetar el ODS 15?",
    answers: [
      "A) Construirlo en una zona protegida sin permisos.",
      "B) Ubicarlo en una zona industrial ya degradada, usando energías renovables y minimizando impacto sobre la biodiversidad.",
      "C) No hacer estudios de impacto ambiental.",
      "D) Usar solo energía fósil para abaratar costes."
    ],
    correct: 1,
    explanation: "La opción B reduce el impacto sobre ecosistemas terrestres y promueve energía limpia (ODS 15)."
  }
];

let teamCode = "";
let playerName = "";
let currentQuestionIndex = 0;
let score = 0;
let startTime = 0;

// Leer el equipo de la URL (ej. ?team=Fila1)
function getTeamFromUrl() {
  const params = new URLSearchParams(window.location.search);
  let team = params.get("team");
  if (!team) {
    team = prompt("Introduce el código de equipo (Fila1, Fila2, Fila3, Fila4):");
  }
  return team ? team.trim().toUpperCase() : "";
}

function joinTeam() {
  teamCode = getTeamFromUrl();
  playerName = document.getElementById("playerName").value.trim() || "Anónimo";

  if (!teamCode) {
    alert("No se ha podido determinar el equipo.");
    return;
  }

  document.getElementById("login").style.display = "none";
  document.getElementById("game").style.display = "block";

  startTime = Date.now();
  showQuestion();
}

function showQuestion() {
  const q = questions[currentQuestionIndex];
  document.getElementById("title").textContent = `ODS ${q.ods}`;
  document.getElementById("question").textContent = q.text;
  const answersDiv = document.getElementById("answers");
  answersDiv.innerHTML = "";
  document.getElementById("feedback").textContent = "";
  document.getElementById("nextBtn").style.display = "none";

  // Mezclamos las respuestas y guardamos el índice correcto original
  const shuffled = [...q.answers].map((value, index) => ({ value, index }));
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Guardamos cuál es la correcta en el orden mezclado
  let correctInShuffled = -1;
  shuffled.forEach((item, idx) => {
    if (item.index === q.correct) {
      correctInShuffled = idx;
    }
  });

  // Guardamos en el elemento del DOM
  answersDiv.dataset.correct = correctInShuffled;
  answersDiv.dataset.explanation = q.explanation;

  shuffled.forEach((item, idx) => {
    const btn = document.createElement("button");
    btn.textContent = item.value;
    btn.onclick = () => checkAnswer(idx);
    answersDiv.appendChild(btn);
  });
}

function checkAnswer(selectedIdx) {
  const answersDiv = document.getElementById("answers");
  const correctIdx = parseInt(answersDiv.dataset.correct, 10);
  const explanation = answersDiv.dataset.explanation;

  const feedback = document.getElementById("feedback");
  if (selectedIdx === correctIdx) {
    feedback.textContent = "✅ ¡Correcto! Has obtenido una pista para escapar.";
    feedback.style.color = "green";
    score++;
  } else {
    feedback.textContent = "⚠️ Incorrecto. " + explanation;
    feedback.style.color = "orange";
  }
  document.getElementById("nextBtn").style.display = "inline-block";
}

function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    const endTime = Date.now();
    const time = Math.round((endTime - startTime) / 1000);
    document.getElementById("question").textContent =
      `¡Enhorabuena! Has escapado del ODS Escape Room.`;
    document.getElementById("answers").innerHTML = "";
    document.getElementById("feedback").textContent =
      `Puntuación: ${score} de ${questions.length} | Tiempo: ${time} segundos`;
    document.getElementById("nextBtn").style.display = "none";
    document.getElementById("resetBtn").style.display = "inline-block";
  }
}

function resetGame() {
  currentQuestionIndex = 0;
  score = 0;
  startTime = Date.now();
  document.getElementById("question").textContent = "";
  document.getElementById("answers").innerHTML = "";
  document.getElementById("feedback").textContent = "";
  document.getElementById("nextBtn").style.display = "none";
  document.getElementById("resetBtn").style.display = "none";
  showQuestion();
}
