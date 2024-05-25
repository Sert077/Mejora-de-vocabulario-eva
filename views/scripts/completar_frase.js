var isEditing = false;
    var savedSentences = {
      "sentence1": "La Manzana es una fruta muy dulce y con muchas pepas.",
      "sentence2": "La capital de Francia es Paris",
      "sentence3": "El Juego que se juega con balón es el Fútbol"
    };

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
          mostrarMensajeEnDiv("Debes rellenar todos los espacios con la respuesta correcta antes de guardar.");
          return;
        }

        sentences.forEach(function (sentence) {
          savedSentences[sentence.id] = sentence.textContent.trim();
        });

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