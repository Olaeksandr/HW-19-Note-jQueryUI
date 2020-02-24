const LOCALSTORAGE_KEY = 'notes';

const DELETE_NOTE_CLASS = 'delete-note';
const EDIT_NOTE_CONTROL_CLASS = 'edit-note-control';

const noteTemplate = document.getElementById('noteTemplate').innerHTML;
const fieldElement = document.getElementById('field');

let notesList = [];
let dialog;

let currentPos = {
    top: 0,
    left: 0
};

$('#clearAllBtn').on('click', onClearAllBtnClick);
$('#field').on('click', onFieldElementClick);
$('#field').on('focusout', onFieldElementFocusout);
$('#field').on('focusin', onFieldElementFocusIn);
$('#addNoteBtn').on('click', onAddNoteBtnClick);

init();

function initDialog() {
  dialog = $( "#dialog-form" ).dialog({
    autoOpen: false,
    height: 400,
    width: 350,
    modal: true,
    buttons: {
      "Create a Note": createNote,
      Cancel: function() {
        dialog.dialog( "close" );
      }
    },
    close: function() {
        $(noteInput).val('');
    }
  });  
}


function onAddNoteBtnClick() {
    dialog.dialog('open');
}

function onClearAllBtnClick() {
    clearAll();
}

function onFieldElementClick(e) {
    switch (true) {
        case e.target.classList.contains(DELETE_NOTE_CLASS):
            deleteNote(e.target.parentElement.dataset.noteIndex);
            break;
    }
}

function onFieldElementFocusIn(e) {
    draggableNote(e);
    saveState();
}


function onFieldElementFocusout(e) {
    const element = e.target;

    switch (true) {
        case e.target.classList.contains(EDIT_NOTE_CONTROL_CLASS):
            updateNote(
                element.parentElement.dataset.noteIndex,
                element.name,
                element.value
            );
            break;
    }

    saveState();

}

function init() {
    initDialog();
    restoreState();
    renderList();
}

function getNoteElement(id) {
    return fieldElement.querySelector(`[data-note-index="${id}"]`);
}

function createNote() {

    const note = {
        id: Date.now(),
        description: $(noteInput).val(),
        top: $('.draggable').css('top'),
        left: $('.draggable').css('left')
    };

    notesList.push(note);

    saveState();
    renderNote(note);
    dialog.dialog( "close" );

}

function updateNote(id, name, value) {
    const note = notesList.find(el => el.id == id);

    note[name] = value;
    saveState();
}

function deleteNote(id) {
    notesList = notesList.filter(el => el.id != id);
    saveState();

    deleteNoteElement(id);
}

function deleteNoteElement(id) {
    const element = getNoteElement(id);

    element && element.remove();
}

function clearAll() {
    notesList = [];
    fieldElement.innerHTML = '';
    saveState();
}

function renderList() {
    notesList.forEach(renderNote);
}

function renderNote(note) {
    fieldElement.insertAdjacentHTML('beforeEnd', getNoteHtml(note));
    }

function getNoteHtml(note) {
    return noteTemplate
        .replace('{{id}}', note.id)
        .replace('{{description}}', note.description);
}

function saveState() {
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(notesList));
}

function restoreState() {
    notesList = localStorage.getItem(LOCALSTORAGE_KEY);
    notesList = notesList ? JSON.parse(notesList) : [];
}

function draggableNote() {
    $( function() {
        $( '.draggable' ).draggable({
          drag: function(event, ui) {
            currentPos = $(this).position();
          },
        });
    });
}