var completedCount = 0;
var highCount = 0;
var lowCount = 0;
var mediumCount = 0;
var myPieChart = null;

window.onload = function(){
    
    const addButtons = document.querySelectorAll(".addNew");
    for (i=0; i < addButtons.length; i++){
        let addButton = addButtons[i];
        addButton.addEventListener("click", addNewCard);
    }

    const completeTaskButtons = document.querySelectorAll(".complete-task");
    for (i=0; i < completeTaskButtons.length; i++){
        let completeTaskButton = completeTaskButtons[i];
        completeTaskButton.addEventListener("click", completeTask);
    }

    const deleteTaskButtons = document.querySelectorAll(".delete-task");
    for (i=0; i < deleteTaskButtons.length; i++){
        let deleteTaskButton = deleteTaskButtons[i];
        deleteTaskButton.addEventListener("click", deleteTask);
    }

    const priorityButtons = document.querySelectorAll(".card-body ul button");
    for (i=0; i < priorityButtons.length; i++){
        let priorityButton = priorityButtons[i];
        priorityButton.addEventListener("click", changePriority);
    }
    completedCount = getCompletedQuantityCount();
    highCount = getToDoPriorityCount("High");
    lowCount = getToDoPriorityCount("Low");
    mediumCount = getToDoPriorityCount("Medium");
    ceateChart();
    //prepareChartData();
    console.log(1);
    console.log(addButtons.length);
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

function prepareChartData(){
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
                '#FF4500',
                '#FFFF00',
                '#00CED1',
                '#9ACD32'
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
            '#FF4500',
            '#FFFF00',
            '#00CED1',
            '#9ACD32'
        ],
        borderWidth: .5
    }];
    myPieChart.update();
}

function addNewCard(e){
    let priority = "Low";
    if(e.currentTarget.classList.contains("text-warning")){
        priority = "Medium";
    }  
    else if(e.currentTarget.classList.contains("text-danger")){
        priority = "High";
    }
    let inputNewTask = document.querySelector("#inputNewTask");
    createCard(inputNewTask.value, priority);
    inputNewTask.value = "";
}

function createCard(content, priority){
    //alert("Clicked");
    
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
    let navButton = document.createElement("button");
    navButton.setAttribute("type", "button");
    navButton.classList.add("btn");
    navButton.classList.add("btn-outline-danger");
    if(priority == "High")
        navButton.classList.add("active");
    navButton.textContent = "High";
    navButton.addEventListener("click", changePriority);
    navItem.appendChild(navButton);
    navButton = document.createElement("button");
    navButton.setAttribute("type", "button");
    navButton.classList.add("btn");
    navButton.classList.add("btn-outline-warning");
    if(priority == "Medium")
        navButton.classList.add("active");
    navButton.textContent = "Medium";
    navButton.addEventListener("click", changePriority);
    navItem.appendChild(navButton);
    navButton = document.createElement("button");
    navButton.setAttribute("type", "button");
    navButton.classList.add("btn");
    navButton.classList.add("btn-outline-success");
    if(priority == "Low")
        navButton.classList.add("active");
    navButton.textContent = "Low";
    navButton.addEventListener("click", changePriority);
    navItem.appendChild(navButton);
    navPill.appendChild(navItem);
    cardBody.appendChild(navPill);
    let taskContent = document.createElement("p");
    taskContent.classList.add("card-text");
    taskContent.textContent = content;
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
    actionButton.addEventListener("click", completeTask);
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
    actionButton.addEventListener("click", deleteTask);
    cardBody.appendChild(actionButton).after(" ");;
    card.appendChild(cardBody);
    columnDiv.appendChild(card);
    row.appendChild(columnDiv);
    prepareChartData();
    console.log(row);
}

//Add events for complete buttons
function completeTask(e){
    let taskContent = e.currentTarget.parentNode.querySelector("p.card-text").textContent;
    
    let completdTaskList = document.querySelector("#bottomSection .completedTaskList");
    let completedListItem = document.createElement("li");
    completedListItem.classList.add("list-group-item");
    let taskListItemContent = document.createElement("p");
    taskListItemContent.textContent = taskContent;
    completedListItem.appendChild(taskListItemContent);
    let undoButton = document.createElement("button");
    undoButton.setAttribute("type", "button");
    undoButton.classList.add("btn");
    undoButton.classList.add("btn-info");
    let undoIcon = document.createElement("i");
    undoIcon.classList.add("fas");
    undoIcon.classList.add("fa-undo-alt");
    undoButton.appendChild(undoIcon);
    undoButton.addEventListener("click", restoreCompletedTask);
    completedListItem.appendChild(undoButton);
    completdTaskList.appendChild(completedListItem);
    deleteTask(e);
    console.log(taskContent.textContent);
}

function deleteTask(e){
    e.currentTarget.parentNode.parentNode.parentNode.parentNode.removeChild(e.currentTarget.parentNode.parentNode.parentNode);
    prepareChartData();
}

function restoreCompletedTask(e){
    let taskContent = e.currentTarget.parentNode.querySelector("p").textContent;
    e.currentTarget.parentNode.parentNode.removeChild(e.currentTarget.parentNode);
    createCard(taskContent, "Low");
}

function changePriority(e){
    let activeButton = e.currentTarget.parentNode.parentNode.querySelector("button.active");
    activeButton.classList.remove("active");
    e.currentTarget.classList.add("active");
    prepareChartData();
}