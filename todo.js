// Değişkenler

let todoItems = []
const todoInput = document.querySelector('.todo-input')
const completedTodosDiv = document.querySelector('.completed-todos')
const uncompletedTodosDiv = document.querySelector('.uncompleted-todos')
const audio = new Audio('sound.mp3')


// İlk açılışta yapılacaklar listesini alma
window.onload = () => {
    let storageTodoItems = localStorage.getItem('todoItems')
    if(storageTodoItems != null) {
        todoItems = JSON.parse(storageTodoItems)
    }

    render()

}

// veri girme
todoInput.onkeyup = (e) => {
    let value = e.target.value.replace(/^\s+/, "");
    if(value && e.keyCode === 13){ // Enter
        addTodo(value)

        todoInput.value = ''
        todoInput.focus()
    
    }
};


// Yapılacak iş ekleme
function addTodo(text){
    todoItems.push({
        id: Date.now(),
        text,
        completed: false
    })

    saveAndRender()
}

// Yapılacak iş kaldırma
function removeTodo(id) {
    todoItems = todoItems.filter(todo => todo.id !== Number(id))
    saveAndRender()
}

// Tamamlandı olarak işaretleme
function markAsCompleted(id) {
    todoItems = todoItems.filter(todo => {
        if (todo.id === Number(id)) {
        todo.completed = true
        }

        return todo
    })

    audio.play();

    saveAndRender()
}

// Tamamlanmadı olarak işaretleme
function markAsUncompleted(id) {
    todoItems = todoItems.filter(todo => {
        if (todo.id === Number(id)) {
        todo.completed = false
        }

        return todo
    })

    saveAndRender()
}

// Yerel depolamaya kaydet
function save(){
    localStorage.setItem('todoItems', JSON.stringify(todoItems))
}

// İşleme
function render() {
    let unCompletedTodos = todoItems.filter(item => !item.completed)
    let completedTodos = todoItems.filter(item => item.completed)

    completedTodosDiv.innerHTML = ''
    uncompletedTodosDiv.innerHTML = ''

    if(unCompletedTodos.length > 0){
        unCompletedTodos.forEach(todo => {
            uncompletedTodosDiv.append(createTodoElement(todo))
        })
    } else {
        uncompletedTodosDiv.innerHTML = `<div class='empty'>Tamamlanmamış görev yok</div>`
    }

    if(completedTodos.length > 0) {
        completedTodosDiv.innerHTML = `<div class='completed-title'>Tamamlanmış (${completedTodos.length} / ${todoItems.length})</div>`

        completedTodos.forEach(todo => {
        completedTodosDiv.append(createTodoElement(todo))
        })
        
    }

}

// Kaydetme ve İşleme
function saveAndRender() {
    save()
    render()

}
// Yapılacaklar listesi öğesi oluşturma
function createTodoElement(todo) {
    // Tüm liste kapsayıcısını oluşturma
    const todoDiv = document.createElement('div')
    todoDiv.setAttribute('data-id', todo.id)
    todoDiv.className = 'todo-item'

    // Tüm metin öğesini oluşturma
    const todoTexSpan = document.createElement('span')
    todoTexSpan.innerHTML = todo.text


    // Liste için onay kutusu

    const todoInputCheckbox = document.createElement('input')
        todoInputCheckbox.type = 'checkbox'
        todoInputCheckbox.checked = todo.completed
        todoInputCheckbox.onclick = (e) => {
            let id = e.target.closest('.todo-item').dataset.id
            e.target.checked ? markAsCompleted(id) : markAsUncompleted(id)
    }


  // Listeden silme butonu
  const todoRemoveBtn = document.createElement('a')
  todoRemoveBtn.href = '#'
  todoRemoveBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-x" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                       </svg>`

  todoRemoveBtn.onclick = (e) => {
  let id = e.target.closest('.todo-item').dataset.id
  removeTodo(id)
  }
  
  todoTexSpan.prepend(todoInputCheckbox)
  todoDiv.appendChild(todoTexSpan)
  todoDiv.appendChild(todoRemoveBtn)

  return todoDiv
    


}
