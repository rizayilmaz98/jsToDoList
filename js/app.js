const form = document.getElementById("form");
const inputTodo = document.getElementById("todo");
const inputEndDate = document.getElementById("endDate");
const todoList = document.getElementById("todoList");
const body = document.querySelector("body");
const button = document.getElementById("button")
form.addEventListener("submit", submitForm);
//Post Get Put Delete Request Class
class Request {
  get(url) {
    return new Promise((resolve, reject) => {
      fetch(url)
        .then((response) => response.json())
        .then((data) => resolve(data))
        .catch((err) => reject(err));
    });
  }
  post(url, data) {
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => response.json())
        .then((data) => resolve(data))
        .catch((err) => reject(err));
    });
  }
  put(id, data) {
    return new Promise((resolve, reject) => {
      fetch(`http://localhost:3000/todo/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => response.json())
        .then((data) => resolve(data))
        .catch((err) => reject(err));
    });
  }
  delete(id) {
    return new Promise((resolve, reject) => {
      fetch(`http://localhost:3000/todo/${id}`, {
        method: "DELETE",
      })
        .then((response) => resolve("Veri Silme Başarılı", response))
        .catch((err) => reject(err));
    });
  }
}
// add class request
const request = new Request();
//get
request
  .get("http://localhost:3000/todo")
  .then((data) =>
    data.forEach((item) => {
      addUI(item);
    })
  )
  .catch((err) => console.log(err));
//post
function submitForm(e) {
  request
    .post("http://localhost:3000/todo", {
      todo: inputTodo.value.trim(),
      endDate: inputEndDate.value.trim(),
      completed: false,
    })
    .then((data) => console.log(data))
    .catch((err) => console.log(err));
  e.preventDefault();
}
//put
function editTodo(id) {
  button.innerHTML = "Update"
  button.classList.add("update-button")
  request
    .get("http://localhost:3000/todo")
    .then((data) =>
      data.forEach((item) => {
        if (id == item.id) {
          inputTodo.value = item.todo;
          inputEndDate.value = item.endDate;
          form.addEventListener("submit", function () {
            deleteTodo(id)
            button.innerHTML="Add"
            request
              .put(id, {
                todo: inputTodo.value.trim(),
                endDate: inputEndDate.value.trim(),
                completed: false,
              })
              .then((data) => {console.log(data)})
              .catch((err) => console.log(err));
          });  
        }
      })
    )
    .catch((err) => console.log(err));
}
//delete
function deleteTodo(id) {
  request
    .delete(id)
    .then((msg) => console.log(msg))
    .catch((err) => console.log(err));
}
//completed
function completedTodo(id) {
  request
  .get("http://localhost:3000/todo")
  .then((data) =>
    data.forEach((item) => {
      if (id == item.id) {
        request
            .put(id, {
              todo:item.todo,
              endDate:item.endDate,
              completed: !item.completed,
            })
            .then((data) => {console.log(data)})
            .catch((err) => console.log(err));
      }
    })
  )
  .catch((err) => console.log(err));
}
function addUI(item) {
  todoList.innerHTML += `
    <li class="list-group-item d-flex justify-content-between">
      <div id="todo-${item.id}" class="col-4 ${item.completed === true ? "line-through" : ""}">
        ${item.todo}
      </div>
      <div class="col-4 text-center ${item.completed === true ? "line-through" : ""}">
        ${item.endDate}
      </div>
      <div class="col-4 text-end">
        <i onClick={editTodo(${item.id})} class="fa-sharp fa-solid fa-pen-to-square color-blue cursor-pointer"></i>
        ${item.completed === true ? `<i onClick={completedTodo(${item.id})} class='fas fa-times color-red cursor-pointer'></i>`: `<i onClick={completedTodo(${item.id})} class='fa-solid fa-check color-green cursor-pointer'></i>`}
        <i onClick={deleteTodo(${item.id})} class="fa-solid fa-trash-can text-danger cursor-pointer"></i>
      </div>
    </li>
    `;
}