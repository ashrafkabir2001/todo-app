import { $taskInput, $taskContainer, $addButton, $errorMessage} from "./element.js";
import { sanitizeInput, showErrorMessage} from "./utility.js";

let tasks = [];

const addTaskHandler = () => {
    const taskTitle = sanitizeInput($taskInput.value);
    
    if (!taskTitle) {
        showErrorMessage("Task Title must be provided");
        return;
    }
    $errorMessage.hidden = true;

    const task = createTask(taskTitle);

    tasks.unshift(task);

    const $taskElement = createTaskElement(task);

    $taskContainer.prepend($taskElement);
};

const createTask = (taskTitle) => {
    return {
        id: Date.now(),
        title: taskTitle,
        createdAt: new Date().toLocaleDateString()
    };
};

const deleteTaskHandler = (event) => {
    const $taskElement = event.target.parentElement;
    
    const taskId = parseInt($taskElement.id);

    $taskElement.remove();

    tasks = tasks.filter((task) => task.id !== taskId);
};

const updateTaskEditHandler = (task, $taskDetails, $inputField, $editButton, $updateButton, $cancelButton) => {
    const taskTitle = sanitizeInput($inputField.value);
    
    if (!taskTitle) {
        showErrorMessage("Task Title must be provided for edit");
        return;
    }
    task.title = taskTitle;
    $errorMessage.hidden = true;

    $taskDetails.innerHTML = `${task.title}, ${task.createdAt} `;

    toggleElements($taskDetails, $inputField, $editButton, $updateButton, $cancelButton);
}

const toggleElements = ($taskDetails, $inputField, $editButton, $updateButton, $cancelButton) => {
    $taskDetails.hidden = !$taskDetails.hidden;
    $editButton.hidden = !$editButton.hidden;
    $inputField.hidden = !$inputField.hidden;
    $updateButton.hidden = !$updateButton.hidden;
    $cancelButton.hidden = !$cancelButton.hidden;
}

const createTaskElement = (task) => {
    const $taskElement = document.createElement("li");
    const $inputField = document.createElement("input");
    const $taskDetails = document.createElement("span");
    const $deleteButton = document.createElement("button");
    const $editButton = document.createElement("button");
    const $updateButton = document.createElement("button");
    const $cancelButton = document.createElement("button");

    $taskElement.id = task.id;
    
    $taskDetails.innerHTML = `${task.title}, ${task.createdAt} `;
    
    $inputField.value = `${task.title}`;
    $inputField.hidden = true;
    
    $deleteButton.innerText = "Delete";
    $deleteButton.addEventListener("click", (event) => deleteTaskHandler(event));
    
    $editButton.innerHTML = "Edit";
    $editButton.addEventListener("click", () => toggleElements($taskDetails, $inputField, $editButton, $updateButton, $cancelButton));
    
    $updateButton.innerHTML = "Update";
    $updateButton.addEventListener("click", () => updateTaskEditHandler(task, $taskDetails, $inputField, $editButton, $updateButton, $cancelButton));
    $updateButton.hidden = true;
    
    $cancelButton.innerHTML = "Cancel";
    $cancelButton.addEventListener("click", () => {
        $inputField.value = task.title;
        toggleElements($taskDetails, $inputField, $editButton, $updateButton, $cancelButton);
    });
    $cancelButton.hidden = true;

    $taskElement.appendChild($taskDetails);
    $taskElement.appendChild($inputField);
    $taskElement.appendChild($deleteButton);
    $taskElement.appendChild($editButton);
    $taskElement.appendChild($updateButton);
    $taskElement.appendChild($cancelButton);

    return $taskElement;
};

$addButton.addEventListener("click", addTaskHandler);