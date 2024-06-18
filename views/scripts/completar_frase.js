var isEditing = false;
var savedSentences = {
  "sentence1": "La Manzana es una fruta muy dulce y con muchas pepas.",
  "sentence2": "La capital de Francia es Paris",
  "sentence3": "El Juego que se juega con balón es el Fútbol"
};

let oracions = {};

function initializeScorm() {
  var result = SCORM_Init();
  if (result) {
    // Recuperar el estado anterior si existe
    var completionStatus = SCORM_GetValue("cmi.completion_status");
    if (completionStatus !== "completed") {
      loadState();
    }
  }
}

function terminateScorm() {
  // Guardar el estado actual
  saveState();
  SCORM_SetValue("cmi.completion_status", "completed");
  SCORM_Commit();
  SCORM_Finish();
}

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.textContent);
}

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  var placeholder = ev.target;

  if (!placeholder.classList.contains('placeholder')) {
    return;
  }

  placeholder.textContent = data;

  if (isEditing) {
    var draggableElement = document.getElementById(data);
    draggableElement.style.display = 'inline-block';
  }
}

function addPlaceholder(sentenceId) {
  var sentence = document.getElementById(sentenceId);
  var textNode1 = document.createTextNode('  ');
  var textNode2 = document.createTextNode('    ');
  var placeholder1 = document.createElement('span');
  var placeholder2 = document.createElement('span');

  placeholder1.classList.add('placeholder');
  placeholder1.setAttribute('ondrop', 'drop(event)');
  placeholder1.setAttribute('ondragover', 'allowDrop(event)');
  placeholder1.textContent = '______________';

  sentence.appendChild(textNode1);
  sentence.appendChild(placeholder1);
  sentence.appendChild(textNode2);
}

function toggleEditMode() {
  var editButton = document.getElementById('editButton');
  var saveButton = document.getElementById('saveButton');
  var verifyButton = document.getElementById('verifyButton');
  var addButtons = document.querySelectorAll('[id^="addBtn"]');

  if (editButton.style.display !== 'none') {
    editButton.style.display = 'none';
    saveButton.style.display = 'block';
    verifyButton.style.display = 'none';
    addButtons.forEach(function (btn) {
      btn.style.display = 'block';
    });
    isEditing = true;

    document.querySelectorAll('p[id^="sentence"]').forEach(function (sentence) {
      sentence.contentEditable = true;
      var placeholders = sentence.querySelectorAll('.placeholder');
      placeholders.forEach(function (placeholder) {
        if (placeholder.textContent !== '______________') {
          var currentOption = placeholder.textContent;
          var options = document.querySelectorAll('.option');
          for (var i = 0; i < options.length; i++) {
            if (options[i].textContent === currentOption) {
              options[i].style.display = 'inline-block';
              break;
            }
          }
          placeholder.textContent = '______________';
        }
      });
    });
    document.querySelectorAll('.option').forEach(function (option) {
      option.contentEditable = true;
      option.style.display = 'inline-block';
    });
    document.querySelectorAll('#GenOpciones').forEach(function (option) {
      option.style.display = 'inline-block';
    });

    document.querySelectorAll('#scoreButton').forEach(function (option) {
      option.style.display = 'none';
    });

  } else {
    saveButton.style.display = 'none';
    editButton.style.display = 'block';
    verifyButton.style.display = 'block';
    addButtons.forEach(function (btn) {
      btn.style.display = 'none';
    });
    isEditing = false;

    document.querySelectorAll('p[id^="sentence"]').forEach(function (sentence) {
      sentence.contentEditable = false;
    });
    document.querySelectorAll('.option').forEach(function (option) {
      option.contentEditable = false;
    });
  }
}

function saveChanges() {
  if (isEditing) {
    var allFilled = true;

    var sentences = document.querySelectorAll('[id^="sentence"]');
    sentences.forEach(function (sentence) {
      var placeholders = sentence.querySelectorAll('.placeholder');
      placeholders.forEach(function (placeholder) {
        if (placeholder.textContent === '______________') {
          allFilled = false;
        }
      });
    });

    if (!allFilled) {
      resultado.style.color = "red";
      mostrarMensajeEnDiv("Debes rellenar todos los espacios arrastrando la respuesta correcta antes de guardar.");
      return;
    }

    sentences.forEach(function (sentence) {
      savedSentences[sentence.id] = sentence.textContent.trim();
      //console.log(savedSentences[sentence.id]);
    });

    oracions = { ...savedSentences };



    document.querySelectorAll('.option').forEach(function (option) {
      if (option.style.display !== 'none') {
        option.style.display = 'none';
      }
    });

    document.querySelectorAll('.options').forEach(function (options) {
      options.querySelectorAll('.option').forEach(function (option) {
        option.style.display = 'inline-block';
      });
    });

    toggleEditMode();

    sentences.forEach(function (sentence) {
      var placeholders = sentence.querySelectorAll('.placeholder');
      placeholders.forEach(function (placeholder) {
        if (placeholder.textContent !== '______________') {
          placeholder.textContent = '______________'
        }
      });
    });
    document.querySelectorAll('#GenOpciones').forEach(function (option) {
      option.style.display = 'none';
    });
    document.querySelectorAll('#scoreButton').forEach(function (option) {
      option.style.display = 'inline-block';
    });
  } else {
    resultado.style.color = "red";
    mostrarMensajeEnDiv("Debes entrar en modo edición primero.");
  }
}

function verifySentences() {
  var currentSentences = document.querySelectorAll('[id^="sentence"]');
  var correctCount = 0;
  currentSentences.forEach(function (sentence) {
    if (sentence.textContent.trim() === savedSentences[sentence.id]) {
      correctCount++;
    }
  });
  resultado.style.color = "green";
  mostrarMensajeEnDiv("Número de oraciones correctas: " + correctCount);
}

function mostrarMensajeEnDiv(mensaje) {
  var resultadoDiv = document.getElementById("resultado");
  resultadoDiv.textContent = mensaje;

  setTimeout(function () {
    resultadoDiv.textContent = '';
  }, 2000);
}

// Nueva función para calcular la calificación
function calculateScore() {
  var currentSentences = document.querySelectorAll('[id^="sentence"]');
  var totalSentences = currentSentences.length;
  var correctCount = 0;

  currentSentences.forEach(function (sentence) {
    var sentenceId = sentence.id;
    var placeholders = sentence.querySelectorAll('.placeholder');
    var sentenceText = sentence.textContent.trim();

    if (checkSentence(sentenceId, sentenceText)) {
      correctCount++;
    }
  });

  var score = (correctCount / totalSentences) * 100;
  displayScore(score);
}

function checkSentence(sentenceId, sentenceText) {
  var correctSentence = savedSentences[sentenceId];
  return sentenceText === correctSentence;
}

function displayScore(score) {
  var scoreDiv = document.getElementById("calificacion");
  scoreDiv.textContent = "Calificación: " + score.toFixed(2) + "%";
  scoreDiv.style.color = "black";  // Aplicar estilo directamente
}

// Guardar el estado actual de la prueba en SCORM
function saveState() {
  var currentSentences = document.querySelectorAll('[id^="sentence"]');
  currentSentences.forEach(function (sentence) {
    var sentenceId = sentence.id;
    var sentenceText = sentence.textContent.trim();
    SCORM_SetValue("cmi.suspend_data." + sentenceId, sentenceText);
  });

  var options = document.querySelectorAll('.option');
  options.forEach(function (option) {
    var optionId = option.id;
    var optionVisible = option.style.display !== 'none';
    SCORM_SetValue("cmi.suspend_data." + optionId, optionVisible);
  });

  SCORM_Commit();
}

// Cargar el estado guardado de la prueba desde SCORM
function loadState() {
  var currentSentences = document.querySelectorAll('[id^="sentence"]');
  currentSentences.forEach(function (sentence) {
    var sentenceId = sentence.id;
    var savedText = SCORM_GetValue("cmi.suspend_data." + sentenceId);
    if (savedText) {
      sentence.innerHTML = savedText;
    }
  });

  var options = document.querySelectorAll('.option');
  options.forEach(function (option) {
    var optionId = option.id;
    var optionVisible = SCORM_GetValue("cmi.suspend_data." + optionId);
    if (optionVisible === "false") {
      option.style.display = 'none';
    } else {
      option.style.display = 'inline-block';
    }
  });
}

function generateOptions() {
  // Encuentra el contenedor padre del botón que fue clicado
  const button = event.target;
  const container = button.closest('.container');

  // Encuentra el div con la clase 'options' dentro de este contenedor
  const optionsDiv = container.querySelector('.options');

  // Define nuevas opciones (puedes modificar estas opciones según tus necesidades)
  const newOptions = [
    { id: 'Opción1', text: 'Opción' },
  ];

  // Añade las nuevas opciones al div de opciones
  newOptions.forEach(option => {
    const span = document.createElement('span');
    span.classList.add('option');
    span.setAttribute('draggable', 'true');
    span.setAttribute('ondragstart', 'drag(event)');
    span.id = option.id;
    span.textContent = option.text;
    span.setAttribute('contenteditable', 'true');
    optionsDiv.appendChild(span);

  });

}

// Inicializar SCORM cuando la página se carga
window.onload = function () {
  initializeScorm();
};

// Finalizar SCORM cuando la página se descarga
window.onunload = function () {
  terminateScorm();
};

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('editButton').style.display = 'display';
  document.getElementById('createFilesButton').style.display = 'inline-block';
  document.getElementById('zip-button').style.display = 'display';
});


document.getElementById('createFilesButton').addEventListener('click', async () => {
  try {
    const htmlContent = document.documentElement.outerHTML;
    const cssContent = await getCSSContent();
    const jsContent = await getJavaScriptContent();

    const response = await fetch('/save-files', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ htmlContent, cssContent, jsContent })
    });

    if (response.ok) {
      console.log('Archivos guardados exitosamente');
    } else {
      console.error('Error al guardar archivos:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Error al procesar solicitud:', error);
  }
});


async function getCSSContent() {
  let styles = '';
  const cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
  const fetchPromises = [];

  cssLinks.forEach(link => {
    if (link.href.includes('styles/completar_frase.css')) {
      fetchPromises.push(
        fetch(link.href)
          .then(response => response.text())
          .then(cssContent => {
            styles += cssContent + '\n';
          })
          .catch(error => {
            console.error('Error fetching CSS:', error);
            reject(error); // Rechazar la Promesa en caso de error
          })
      );
    }
  });

  await Promise.all(fetchPromises);

  return styles;
}

// Updated getJavaScriptContent function
async function getJavaScriptContent() {
  let scripts = '';
  const scriptTags = document.querySelectorAll('script[src="scripts/completar_frase.js"]');
  const fetchPromises = [];

  scriptTags.forEach(script => {
    fetchPromises.push(
      fetch(script.src)
        .then(response => response.text())
        .then(jsContent => {
          scripts += jsContent + '\n';
        })
        .catch(error => {
          console.error('Error fetching JavaScript:', error);
          reject(error); // Rechazar la Promesa en caso de error
        })
    );
  });

  try {
    await Promise.all(fetchPromises);

    if (Object.keys(oracions).length > 0) {

      const regex = new RegExp(`var\\s+savedSentences\\s*=\\s*\\{[^}]*\\};`, 'g');
      scripts = scripts.replace(regex, '');

      scripts += `var savedSentences = ${JSON.stringify(oracions)};\n`;
    }

      const originalCode = `document.getElementById('editButton').style.display = 'display';`;
      const nuevoCode = `document.getElementById('editButton').style.display = 'none';`;
      scripts = scripts.replace(originalCode, nuevoCode);

      const originalCo = `document.getElementById('createFilesButton').style.display = 'inline-block';`;
    const nuevoCo = `document.getElementById('createFilesButton').style.display = 'none';`;

    scripts = scripts.replace(originalCo, nuevoCo);

    const originalCod = `document.getElementById('zip-button').style.display = 'display';`;
    const nuevoCod = `document.getElementById('zip-button').style.display = 'none';`;
    scripts = scripts.replace(originalCod, nuevoCod);
    

  } catch (error) {
    console.error('Error al cargar archivos JavaScript:', error);
    throw error; // Propagar el error para manejo superior
  }

  return scripts;
}


function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape special characters
}