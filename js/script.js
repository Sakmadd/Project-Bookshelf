
const AllBooks = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';


function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted
  };
}

function findBook(bookId) {
  for (const oneBook of AllBooks) {
    if (oneBook.id === bookId) {
      return oneBook;
    }
  }
  return
}

function findBookIndex(bookId) {
  for (const bookIndex in AllBooks) {
    if (AllBooks[bookIndex].id === bookId) {
      return bookIndex;
    }
  }
  return -1;
}

function isStorageExist() {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(AllBooks);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      AllBooks.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}


function addBook() {
  const textTitle = document.getElementById('inputBookTitle').value;
  const textAuthor = document.getElementById('inputBookWriter').value;
  const yearInput = document.getElementById('inputBookRelease').value;
  const textYear = parseFloat(yearInput);
  const isComplete = document.getElementById('inputBookIsComplete').checked;

  const generatedID = generateId();
  const bookObject = generateBookObject(generatedID, textTitle, textAuthor, textYear, isComplete);
  AllBooks.push(bookObject);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function makeBook(bookObject) {

  const {id, title, author, year, isCompleted} = bookObject;

  const textTitle = document.createElement('h3');
  textTitle.innerText = `Judul : ${title}`;

  const textAuthor = document.createElement('p');
  textAuthor.innerText = `Penulis : ${author}`;

  const textYear = document.createElement('p');
  textYear.innerText = `Tahun : ${year}`;
  


  const textContainer = document.createElement('div');
  textContainer.classList.add('text');
  textContainer.append(textTitle,textAuthor, textYear);

  const article = document.createElement('article');
  article.classList.add('book_item')
  article.append(textContainer);
  article.setAttribute('id', `book-${id}`);

  if (isCompleted) {

    const undoButton = document.createElement('button');
    undoButton.classList.add('undo-button');
    undoButton.addEventListener('click', function () {
      if (confirm("Ingin Kembalikan Buku Ke Rak Yang Belum Dibaca?")) {
        undoBookFromCompleted(id);
        alert("Buku Kembali Ke Rak Yang Belum Dibaca!");
      } else {
      }
    });

    const trashButton = document.createElement('button');
    trashButton.classList.add('trash-button');
    trashButton.addEventListener('click', function () {
      if (confirm("Ingin Menghapus Buku Dari Rak Yang Sudah Dibaca?")) {
        removeBookFromCompleted(id);
        alert("Buku Terhapus Dari Rak Yang Sudah Dibaca!");
      } else {
      }
    });

    const actionContainer = document.createElement('div');
    actionContainer.classList.add('action');
    actionContainer.append(undoButton,trashButton);

    article.append(actionContainer);
  } else {

    const checkButton = document.createElement('button');
    checkButton.classList.add('check-button');
    checkButton.addEventListener('click', function () {
      if (confirm("Ingin Tambahkan Buku Ke Rak Yang Sudah Dibaca?")) {
        addBookToCompleted(id);
        alert("Buku Ditambahkan Ke Rak Yang Sudah Dibaca!");
      } else {
      }
    });

    const trashButton = document.createElement('button');
    trashButton.classList.add('trash-button');
    trashButton.addEventListener('click', function () {
      if (confirm("Ingin Menghapus Buku Dari Rak Belum yang Dibaca?")) {
        removeBookFromCompleted(id);
        alert("Buku Terhapus Dari Rak yang Belum Dibaca!");
      } else {
      }
    });

    const actionContainer = document.createElement('div');
    actionContainer.classList.add('action');
    actionContainer.append(checkButton,trashButton);

    article.append(actionContainer);
  }

  return article;
}

document.getElementById("search-button").addEventListener("click", function () {
  const inputValue = document.getElementById("bookTitle").value;
  const listBooks = document.querySelectorAll(".book_item");


  for (let i = 0; i < listBooks.length; i++) {
    if (!inputValue || listBooks[i].textContent.toLowerCase().indexOf(inputValue) > -1) {
      listBooks[i].classList.remove("hide");
    } else {
      listBooks[i].classList.add("hide");
    }
  }
});

function addBookToCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) 
      return;
  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeBookFromCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) 
      return;

  AllBooks.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoBookFromCompleted(bookId) {

  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document.addEventListener('DOMContentLoaded', function () {

  const submitForm = document.getElementById('inputBook');
  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
    alert("Buku Berhasil Dimasukan!");
    event.target.reset();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }

});

document.addEventListener(SAVED_EVENT, () => {
  console.log('Data berhasil di simpan.');
});

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBookList = document.getElementById('incompleteBookshelfList');
  const CompletedBookList = document.getElementById('completeBookshelfList');

  uncompletedBookList.innerHTML = '';
  CompletedBookList.innerHTML = '';

  for (const bookItem of AllBooks) {
    const todoElement = makeBook(bookItem);
    if (bookItem.isCompleted) {
      CompletedBookList.append(todoElement);
    } else {
      uncompletedBookList.append(todoElement);
    }
  }
});
