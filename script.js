// Base de datos de preguntas por ODS
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
let role = "";
let currentQuestionIndex = 0;

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

  // Recuperamos la lista de jugadores de este equipo
  const key = `team_${teamCode}`;
  let teamData = JSON.parse(localStorage.getItem(key)) || {
    players: [],
    impostorIndex: -1
  };

  // Añadimos al jugador si no está ya
  if (!teamData.players.includes(playerName)) {
    teamData.players.push(playerName);
  }

  // Si es el primer jugador, elegimos saboteador al azar
  if (teamData.impostorIndex === -1 && teamData.players.length > 0) {
    teamData.impostorIndex = Math.floor(Math.random() * teamData.players.length);
  }

  // Guardamos de nuevo
  localStorage.setItem(key, JSON.stringify(teamData));

  // Determinamos el rol de este jugador
  const impostorName = teamData.players[teamData.impostorIndex];
  role = playerName === impostorName ? "saboteador" : "tripulante";

  document.getElementById("login").style.display = "none";
  document.getElementById("game").style.display = "block";

  const roleInfo = document.getElementById("roleInfo");
  roleInfo.textContent = `Rol: ${role === "tripulante" ? "Tripulante" : "Saboteador"}`;
  roleInfo.className = role;

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

  q.answers.forEach((ans, idx) => {
    const btn = document.createElement("button");
    btn.textContent = ans;
    btn.onclick = () => checkAnswer(idx, q.correct, q.explanation);
    answersDiv.appendChild(btn);
  });
}

function checkAnswer(selectedIdx, correctIdx, explanation) {
  const feedback = document.getElementById("feedback");
  if (role === "tripulante") {
    if (selectedIdx === correctIdx) {
      feedback.textContent = "✅ ¡Correcto! Esta decisión contribuye a los ODS.";
      feedback.style.color = "green";
    } else {
      feedback.textContent = "⚠️ Incorrecto. " + explanation;
      feedback.style.color = "orange";
    }
  } else {
    if (selectedIdx === correctIdx) {
      feedback.textContent = "⚠️ Como saboteador, has elegido una opción sostenible. No estás cumpliendo tu misión.";
      feedback.style.color = "orange";
    } else {
      feedback.textContent = "🟢 Has elegido una opción poco sostenible. ¡Perfecto para tu rol de saboteador!";
      feedback.style.color = "red";
    }
  }
  document.getElementById("nextBtn").style.display = "inline-block";
}

function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    document.getElementById("question").textContent =
      `Fin de la misión para el equipo ${teamCode}.`;
    document.getElementById("answers").innerHTML = "";
    document.getElementById("feedback").textContent =
      `Habéis completado todas las decisiones. Ahora debéis discutir en grupo quién era el saboteador y por qué.`;
    document.getElementById("nextBtn").style.display = "none";
  }
}
