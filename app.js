let todoItemsContainer = document.getElementById("todoItemsContainer");
let addTodoButton = document.getElementById("addTodoButton");


let todoList = [];
let todosCount = 0;

function postTodo(newTodo) {
    const postTodosUrl = "https://todolistapp-backend.onrender.com/todos/"
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(newTodo)
    }

    fetch(postTodosUrl, options)
        .then(response => {
            return response.json()
        })

        .then(jsonData => {
            console.log(jsonData)
        })
}


function onAddTodo() {
    let userInputElement = document.getElementById("todoUserInput");
    let userInputValue = userInputElement.value;
    if (userInputValue === "") {
        alert("Enter Valid Text");
        return;
    }
    todosCount = todosCount + 1;
    let newTodo = {
        todo: userInputValue,
        id: todosCount,
        isChecked: false
    };

    createAndAppendTodo(newTodo);
    postTodo(newTodo)
    userInputElement.value = "";
}

addTodoButton.onclick = function() {
    onAddTodo();
};


function update(todo0bject) {
    const postTodosUrl = "https://todolistapp-backend.onrender.com/todos/" + todo0bject.id

    const todoStatus = {
        isChecked: todo0bject.isChecked
    }
    const options = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(todoStatus)
    }
    fetch(postTodosUrl, options)
        .then(response => {
            return response.json()
        })
        .then(jsonData => {
            console.log(jsonData)
        })

}


function onTodoStatusChange(checkboxId, labelId, todoId) {

    let checkboxElement = document.getElementById(checkboxId);
    let labelElement = document.getElementById(labelId);
    labelElement.classList.toggle("checked");
    let todoObjectIndex = todoList.findIndex(function(eachTodo) {
        let eachTodoId = eachTodo.id;
        if (eachTodoId === todoId) {
            return true;
        } else {
            return false;
        }
    });

    let todoObject = todoList[todoObjectIndex];

    if (todoObject.isChecked === 1) {
        todoObject.isChecked = 0;
    } else {
        todoObject.isChecked = 1;
    }
    update(todoObject);
}

function onDeleteTodo(todoId) {
    let todoElement = document.getElementById(todoId);
    todoItemsContainer.removeChild(todoElement);
    const deleteTodoUrl = "https://todolistapp-backend.onrender.com/todos/" + todoId
    const options = {
        method: "DELETE"
    }
    fetch(deleteTodoUrl, options)
        .then(response => {
            return response.json()
        })
        .then(jsonData => {
            console.log(jsonData)
        })
}

function createAndAppendTodo(todoItem) {
    const {
        id,
        todo,
        isChecked
    } = todoItem;
    let todoId = id;
    let checkboxId = "checkbox" + id;
    let labelId = "label" + id;
    let todoElement = document.createElement("li");
    todoElement.classList.add("todo-item-container", "d-flex", "flex-row");
    todoElement.id = todoId;
    todoItemsContainer.appendChild(todoElement);
    let inputElement = document.createElement("input");
    inputElement.type = "checkbox";
    inputElement.id = checkboxId;
    inputElement.checked = isChecked;

    inputElement.onclick = function() {
        onTodoStatusChange(checkboxId, labelId, todoId);
    };
    inputElement.classList.add("checkbox-input");
    todoElement.appendChild(inputElement);

    let labelContainer = document.createElement("div");
    labelContainer.classList.add("label-container", "d-flex", "flex-row");
    todoElement.appendChild(labelContainer);

    let labelElement = document.createElement("label");
    labelElement.setAttribute("for", checkboxId);
    labelElement.id = labelId;
    labelElement.classList.add("checkbox-label");
    labelElement.textContent = todo;

    if (isChecked === 1) {
        labelElement.classList.add("checked");
    }
    labelContainer.appendChild(labelElement);

    let deleteIconContainer = document.createElement("div");
    deleteIconContainer.classList.add("delete-icon-container");
    labelContainer.appendChild(deleteIconContainer);

    let deleteIcon = document.createElement("i");
    deleteIcon.classList.add("far", "fa-trash-alt", "delete-icon");
    deleteIcon.onclick = function() {
        onDeleteTodo(todoId);
    };
    deleteIconContainer.appendChild(deleteIcon);
}


function getTodoList() {
    const getTodosUrl = "https://todolistapp-backend.onrender.com/todos/"
    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
    }

    fetch(getTodosUrl, options)
        .then(response => {
            return response.json()
        })
        .then(jsonData => {
            console.log(jsonData)
            const todosArray = jsonData.todos
            const formattedTodoList = todosArray.map(eachTodo => {
                return {
                    id: eachTodo.id,
                    todo: eachTodo.todo,
                    isChecked: eachTodo.isChecked
                }
            })
            todoList = formattedTodoList
            for (let todo of todoList) {
                createAndAppendTodo(todo);
                todosCount = todoList.length;
            }
        })
}
getTodoList()