var completedCount = 0;
var highCount = 0;
var lowCount = 0;
var mediumCount = 0;
var myPieChart = null;
var localStorage = window.localStorage;

class Task{
    constructor(priority, status, content){
        this.priority = priority;
        this.status = status;
        this.content = content;
    }
}

window.onload = function(){
    
    const addButtons = document.querySelectorAll(".addNew");
    for (i=0; i < addButtons.length; i++){
        let addButton = addButtons[i];
        addButton.addEventListener("click", addNewCard);
    }

 
    let newTaskList = JSON.parse(localStorage.getItem("newTaskList"));
    
    console.log("print new task list inside onload");
    console.log(newTaskList);
    if(!newTaskList)
    {
        newTaskList = [];
        localStorage.setItem("newTaskList", JSON.stringify(newTaskList));
    }
    else{
        let newTaskCount = newTaskList.length;
        for(i=0; i < newTaskCount; i++){
            console.log("Inside loop" + newTaskList.length)
            console.log(i);
            createCard(newTaskList[i]);
        }
    }

    let completedTaskList = JSON.parse(localStorage.getItem("completedTaskList"));
    if(!completedTaskList)
    {
        completedTaskList = [];
        localStorage.setItem("completedTaskList", JSON.stringify(completedTaskList));
    }
    else{
        for(i=0; i < completedTaskList.length; i++){
            createCompletedListItem(completedTaskList[i]);
        }
    }

    completedCount = getCompletedQuantityCount();
    highCount = getToDoPriorityCount("High");
    lowCount = getToDoPriorityCount("Low");
    mediumCount = getToDoPriorityCount("Medium");
    ceateChart();
}



function addNewCard(e){
    let inputNewTask = document.querySelector("#inputNewTask");
    if(!inputNewTask.value){
        alert("Please enter a task");
        return;
    }
    let priority = "Low";
    if(e.currentTarget.classList.contains("text-warning")){
        priority = "Medium";
    }  
    else if(e.currentTarget.classList.contains("text-danger")){
        priority = "High";
    }
    
    let task = new Task(priority, "New", inputNewTask.value)
    console.log(task);
    createCard(task);
    let newTaskList = JSON.parse(localStorage.getItem("newTaskList"));
    newTaskList.push(task);
    localStorage.setItem("newTaskList", JSON.stringify(newTaskList));
    inputNewTask.value = "";
    updateChartData();
}
//Recheck
function createCard(task){
    //alert("Clicked");
    let newTaskList = JSON.parse(localStorage.getItem("newTaskList"));
    console.log("print new task list");
    console.log(newTaskList);
    let row = document.querySelector("#topSection .row");
    let columnDiv = document.createElement("div");
    columnDiv.classList.add("col-sm-4");
    let card = document.createElement("div");
    card.classList.add("card");
    let cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    let navPill = document.createElement("ul");
    navPill.classList.add("nav");
    navPill.classList.add("nav-pills");
    let navItem = document.createElement("li");
    navItem.classList.add("nav-item");
    let navButtonHigh = document.createElement("button");
    navButtonHigh.setAttribute("type", "button");
    navButtonHigh.classList.add("btn");
    navButtonHigh.classList.add("btn-outline-danger");
    if(task.priority == "High")
        navButtonHigh.classList.add("active");
    navButtonHigh.textContent = "High";
    navButtonHigh.addEventListener("click", function(){
        changePriority(navButtonHigh, task, "High");
    });
    navItem.appendChild(navButtonHigh);
    let navButtonMedium = document.createElement("button");
    navButtonMedium.setAttribute("type", "button");
    navButtonMedium.classList.add("btn");
    navButtonMedium.classList.add("btn-outline-warning");
    if(task.priority == "Medium")
        navButtonMedium.classList.add("active");
    navButtonMedium.textContent = "Medium";
    navButtonMedium.addEventListener("click", function(){
        changePriority(navButtonMedium, task, "Medium");
    });
    navItem.appendChild(navButtonMedium);
    let navButtonLow = document.createElement("button");
    navButtonLow.setAttribute("type", "button");
    navButtonLow.classList.add("btn");
    navButtonLow.classList.add("btn-outline-success");
    if(task.priority == "Low")
        navButtonLow.classList.add("active");
    navButtonLow.textContent = "Low";
    navButtonLow.addEventListener("click", function(){
        changePriority(navButtonLow, task, "Low");
    });
    navItem.appendChild(navButtonLow);
    navPill.appendChild(navItem);
    cardBody.appendChild(navPill);
    let taskContent = document.createElement("p");
    taskContent.classList.add("card-text");
    taskContent.textContent = task.content;
    cardBody.appendChild(taskContent);
    let actionButton = document.createElement("button");
    actionButton.setAttribute("type", "button");
    actionButton.classList.add("btn");
    actionButton.classList.add("btn-info");
    actionButton.classList.add("complete-task");
    let actionIcon = document.createElement("i");
    actionIcon.classList.add("fas");
    actionIcon.classList.add("fa-check-circle");
    actionButton.appendChild(actionIcon);
    actionButton.addEventListener("click", function(){
        
        console.log("In anonymous funtion");
        console.log(newTaskList);
        console.log(task);

        deleteTask(columnDiv, task);
        createCompletedListItem(task);
        
        let completedTaskList = JSON.parse(localStorage.getItem("completedTaskList"));
        task.status = "Completed";
        completedTaskList.push(task);
        localStorage.setItem("completedTaskList", JSON.stringify(completedTaskList));
        updateChartData();
        console.log(task);
    });
    cardBody.appendChild(actionButton).after(" ");
    actionButton = document.createElement("button");
    actionButton.setAttribute("type", "button");
    actionButton.classList.add("btn");
    actionButton.classList.add("btn-info");
    actionButton.classList.add("delete-task");
    actionIcon = document.createElement("i");
    actionIcon.classList.add("fas");
    actionIcon.classList.add("fa-trash-alt");
    actionButton.appendChild(actionIcon);
    actionButton.addEventListener("click", function(){
        deleteTask(columnDiv, task);
        updateChartData();
    });
    cardBody.appendChild(actionButton).after(" ");;
    card.appendChild(cardBody);
    columnDiv.appendChild(card);
    row.appendChild(columnDiv);
    
    
    //prepareChartData();
}

function createCompletedListItem(task){
    
    
    let completdTaskList = document.querySelector("#bottomSection .completedTaskList");
    let completedListItem = document.createElement("li");
    completedListItem.classList.add("list-group-item");
    let taskListItemContent = document.createElement("p");
    taskListItemContent.textContent = task.content;
    completedListItem.appendChild(taskListItemContent);
    let undoButton = document.createElement("button");
    undoButton.setAttribute("type", "button");
    undoButton.classList.add("btn");
    undoButton.classList.add("btn-info");
    let undoIcon = document.createElement("i");
    undoIcon.classList.add("fas");
    undoIcon.classList.add("fa-undo-alt");
    undoButton.appendChild(undoIcon);
    undoButton.addEventListener("click", function(){
        restoreCompletedTask(completedListItem, task);
        updateChartData();
    });
    completedListItem.appendChild(undoButton);
    completdTaskList.appendChild(completedListItem);
}




function deleteTask(nodeToDelete, taskToDelete){
    nodeToDelete.parentNode.removeChild(nodeToDelete);
    let newTaskList = JSON.parse(localStorage.getItem("newTaskList"));
    let indexToDelete = newTaskList.findIndex(function(task){
        return task.priority === taskToDelete.priority && task.status === taskToDelete.status && task.content === taskToDelete.content;
    });
    newTaskList.splice(indexToDelete, 1);
    localStorage.setItem("newTaskList", JSON.stringify(newTaskList));
}

function changePriority(selectedPriorityNode, task, priorityToSet){
    let activeButton = selectedPriorityNode.parentNode.parentNode.querySelector("button.active");
    activeButton.classList.remove("active");
    selectedPriorityNode.classList.add("active");
    let newTaskList = JSON.parse(localStorage.getItem("newTaskList"));
    let index = newTaskList.findIndex(function(taskInArray){
        return task.priority === taskInArray.priority && task.status === taskInArray.status && task.content === taskInArray.content;
    });
    console.log(index);
    
    task.priority = priorityToSet;
    newTaskList[index].priority = priorityToSet;
    localStorage.setItem("newTaskList", JSON.stringify(newTaskList));
    updateChartData();      
}

function restoreCompletedTask(listItemToRestore, task){
    console.log(task);
    listItemToRestore.parentNode.removeChild(listItemToRestore);
    createCard(task);
    let completedTaskList = JSON.parse(localStorage.getItem("completedTaskList"));
    let indexToDelete = completedTaskList.findIndex(function(taskInArray){
        return task.priority === taskInArray.priority && task.status === taskInArray.status && task.content === taskInArray.content;
    });
    completedTaskList.splice(indexToDelete, 1);
    localStorage.setItem("completedTaskList", JSON.stringify(completedTaskList));

    let newTaskList = JSON.parse(localStorage.getItem("newTaskList"));
    task.status = "New";
    newTaskList.push(task);
    localStorage.setItem("newTaskList", JSON.stringify(newTaskList));
    console.log(task);
}


function getToDoPriorityCount(priority){
    let priorityClass = "";
    if(priority == "High"){
        priorityClass = ".btn-outline-danger";
    }
    else if(priority == "Medium"){
        priorityClass = ".btn-outline-warning";
    }
    else if(priority == "Low"){
        priorityClass = ".btn-outline-success";
    }

    priorityClass += ".active";
    return document.querySelectorAll(priorityClass).length;
}

function getCompletedQuantityCount(){
    return document.querySelectorAll("ul.completedTaskList li").length - 1;
}

function updateChartData(){
    completedCount = getCompletedQuantityCount();
    highCount = getToDoPriorityCount("High");
    lowCount = getToDoPriorityCount("Low");
    mediumCount = getToDoPriorityCount("Medium");
    refreshData();
}

function ceateChart(){
    let ctx = document.getElementById('myChart');
    let data = {
        datasets: [{
            data: [highCount, mediumCount, completedCount, lowCount],
            backgroundColor: [
                '#dc3545',
                '#ffc107',
                '#00CED1',
                '#28a745'
            ],
            borderWidth: .5
        }],
    
        
        labels: [
            'High',
            'Medium',
            'Done',
            'Low'
        ]
    };
    myPieChart = new Chart(ctx, {
        type: 'pie',
        data: data,
        options: Chart.defaults.pie
    });
}

function refreshData() {
    console.log(completedCount);
    myPieChart.data.datasets = [];
    myPieChart.data.datasets = [{
        data: [highCount, mediumCount, completedCount, lowCount],
        backgroundColor: [
            '#dc3545',
            '#ffc107',
            '#00CED1',
            '#28a745'
        ],
        borderWidth: .5
    }];
    myPieChart.update();
}