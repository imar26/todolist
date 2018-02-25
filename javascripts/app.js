// Pre defined data
// var todoList = [{
//         _id: Math.floor(Math.random() * 100000000),
//         title: 'Cooking',
//         todoItem: 'Cook food for 10 people',
//         author: 'Aadesh',
//         date: '2018-02-12'
//     },
//     {
//         _id: Math.floor(Math.random() * 100000000),
//         title: 'Bathing',
//         todoItem: 'Cook food for 8 people',
//         author: 'Bhumika',
//         date: '2018-02-13'
//     },
//     {
//         _id: Math.floor(Math.random() * 100000000),
//         title: 'Playing',
//         todoItem: 'Cook food for 6 people',
//         author: 'Aadesh',
//         date: '2018-02-14'
//     },
//     {
//         _id: Math.floor(Math.random() * 100000000),
//         title: 'Washing',
//         todoItem: 'Cook food for 4 people',
//         author: 'Bhumika',
//         date: '2018-02-15'
//     },
//     {
//         _id: Math.floor(Math.random() * 100000000),
//         title: 'Drinking',
//         todoItem: 'Cook food for 2 people',
//         author: 'Bhumika',
//         date: '2018-02-16'
//     }
// ];

// Call function to display the pre defined todo list only after the page has completely loaded
window.onload = function () {
    // displayTodoList(todoList);
    init();
};

// Gets data from JSON file using AJAX
function loadJSON(callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'jsonData.json', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send();
}

var todoList;

// First function to be called when the page is loaded
function init() {
    loadJSON(function (response) {
        // Parse JSON string into object
        todoList = JSON.parse(response);
        displayTodoList(todoList);
    });

    // Calculate height
    var windowHeight = window.innerHeight;
    var headerHeight = document.getElementById('header').clientHeight;
    var footerHeight = document.getElementById('footer').clientHeight;

    // Append total height to the window screen
    var totalHeight = windowHeight - headerHeight - footerHeight;
    document.getElementById("mainContent").setAttribute('style', 'min-height: '+totalHeight+'px');
}
// init();

// Function to display todo list
function displayTodoList(todoList) {
    var len = todoList.length;
    var todoListDiv = document.getElementById("todoLists");
    if(len > 0) {
        for (var i = 0; i < len; i++) {
            todoList[i]._id = Math.floor(Math.random() * 100000000);

            var divElement = document.createElement("div");

            var h3Element = document.createElement("h3");
            var title = document.createTextNode(todoList[i].title);
            h3Element.appendChild(title);
            divElement.appendChild(h3Element);

            var pElement = document.createElement("p");
            var todoItem = document.createTextNode(todoList[i].todoItem);
            pElement.appendChild(todoItem);
            divElement.appendChild(pElement);

            var iElement = document.createElement("i");
            var author = document.createTextNode("Created By: " + todoList[i].author);
            iElement.appendChild(author);
            divElement.appendChild(iElement);

            var uElement = document.createElement("i");
            var date = document.createTextNode("Date: " + formatDate(todoList[i].date));

            uElement.appendChild(date);
            divElement.appendChild(uElement);

            var editElement = document.createElement("button");
            editElement.setAttribute("class", "editBtn fa");
            editElement.setAttribute("onclick", "updateTodoItem(" + todoList[i]._id + ")");
            var editText = document.createTextNode("Edit");
            editElement.appendChild(editText);
            divElement.appendChild(editElement);

            var deleteElement = document.createElement("button");
            deleteElement.setAttribute("class", "deleteBtn fa");
            deleteElement.setAttribute("onclick", "deleteTodoItem(" + todoList[i]._id + ")");
            var deleteText = document.createTextNode("Delete");
            deleteElement.appendChild(deleteText);
            divElement.appendChild(deleteElement);

            todoListDiv.appendChild(divElement);
        }
    } else {
        var errorElement = document.createElement("h4");
        errorElement.setAttribute("class", "error");
        var errorMessage = document.createTextNode("No todo items available.");
        errorElement.appendChild(errorMessage);
        todoListDiv.appendChild(errorElement);
    }
}

// Function called when the user submits the form
function saveTodoList(e) {
    // Avoid refreshing the page
    e.preventDefault();


    // To call add todo function
    if (clicked == 'Add') {
        addTodoList();
    // To call update todo function
    } else if (clicked == 'Update') {
        var todoId = document.getElementById("todoId").value;
        if (todoId != '') {
            updateTodoList(todoId);
        } else {
            var errorElement = document.createElement("h4");
            errorElement.setAttribute("class", "error");
            var errorMessage = document.createTextNode("Sorry, todo item cannot be updated because todoId does not exist.");
            errorElement.appendChild(errorMessage);
            var updateBtn = document.getElementById("updateBtn");
            updateBtn.parentNode.insertBefore(errorElement, updateBtn.nextSibling);
            setTimeout(function () {
                errorElement.style.display = "none";
            }, 3500);
        }
    }
}

// Function to add todo list
function addTodoList() {
    var title = document.getElementById("title").value;
    var todoItem = document.getElementById("todoItem").value;
    var author = document.getElementById("author").value;
    var date = document.getElementById("date").value;
    var todoId = Math.floor(Math.random() * 100000000);
    var titleTemp = title.replace(/\s/g, "");
    var todoItemTemp = todoItem.replace(/\s/g, "");
    if (titleTemp == "" || todoItemTemp == "") {
        var errorElement = document.createElement("h4");
        var errorMessage = document.createTextNode("Please fill out the required fields in the form!");
        errorElement.setAttribute("class", "error");
        errorElement.appendChild(errorMessage);
        var updateBtn = document.getElementById("updateBtn");
        updateBtn.parentNode.insertBefore(errorElement, updateBtn.nextSibling);
        setTimeout(function () {
            errorElement.style.display = "none";
        }, 3500);

    } else if(checkObject() == false) {
        var errorElement = document.createElement("h4");
        var errorMessage = document.createTextNode("Todo Item Already Exits!");
        errorElement.setAttribute("class", "error");
        errorElement.appendChild(errorMessage);
        var updateBtn = document.getElementById("updateBtn");
        updateBtn.parentNode.insertBefore(errorElement, updateBtn.nextSibling);
        setTimeout(function () {
            errorElement.style.display = "none";
        }, 3500);
    } else {
        var newTodoObject = {
            _id: todoId,
            title: title.replace(/\s+/g, " ").trim(),
            todoItem: todoItem.replace(/\s+/g, " ").trim(),
            author: author,
            date: date
        };

        todoList.push(newTodoObject);

        var successElement = document.createElement("h4");
        var successMessage = document.createTextNode("Congratulations, the todo list has been successfully added.");
        successElement.setAttribute("class", "success");
        successElement.appendChild(successMessage);
        var updateBtn = document.getElementById("updateBtn");
        updateBtn.parentNode.insertBefore(successElement, updateBtn.nextSibling);
        setTimeout(function () {
            successElement.style.display = "none";
        }, 3500);

        // document.getElementById("title").value = "";
        // document.getElementById("todoItem").value = "";
        // document.getElementById("author").value = "Aadesh";
        // document.getElementById("date").value = "";

        document.getElementById("todoListForm").reset();

        var todoListDiv = document.getElementById("todoLists");
        while (todoListDiv.hasChildNodes()) {
            todoListDiv.removeChild(todoListDiv.firstChild);
        }

        displayTodoList(todoList);
    }
}

// Format the date that is displayed on the front end
function formatDate(date) {
    // var d = new Date(date);
    //console.log(Object.values(date));
    var split = date.toString().split("-");
    var month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var m = month[split[1] - 1];
    var dateFormat = m + " " + split[2] + ", " + split[0];
    return dateFormat;
}

// Check whether the same data already exists
function checkObject() {
    var title = document.getElementById("title").value.toLowerCase();
    var todoItem = document.getElementById("todoItem").value.toLowerCase();
    var author = document.getElementById("author").value;
    var date = document.getElementById("date").value;
    var len = todoList.length;
    var flag = true;
    for(var i = 0; i < len; i++){
        if(todoList[i].title.toLowerCase() == title.trim() && todoList[i].todoItem.toLowerCase() == todoItem.trim() && todoList[i].author == author && todoList[i].date == date){
            flag = false;            
        }          
    }
    return flag;  
}

// Update todo list
function updateTodoList(todoId) {
    var title = document.getElementById("title").value;
    var todoItem = document.getElementById("todoItem").value;
    var author = document.getElementById("author").value;
    var date = document.getElementById("date").value;
    var titleTemp = title.replace(/\s/g, "");
    var todoItemTemp = todoItem.replace(/\s/g, "");
    if (titleTemp == "" || todoItemTemp == "") {
        var errorElement = document.createElement("h4");
        var errorMessage = document.createTextNode("Please fill out the required fields in the form!!");
        errorElement.setAttribute("class", "error");
        errorElement.appendChild(errorMessage);
        var updateBtn = document.getElementById("updateBtn");
        updateBtn.parentNode.insertBefore(errorElement, updateBtn.nextSibling);
        setTimeout(function () {
            errorElement.style.display = "none";
        }, 3500);
        
    } else if(checkObject() == false) {
        var errorElement = document.createElement("h4");
        var errorMessage = document.createTextNode("Todo Item Already Exits!");
        errorElement.setAttribute("class", "error");
        errorElement.appendChild(errorMessage);
        var updateBtn = document.getElementById("updateBtn");
        updateBtn.parentNode.insertBefore(errorElement, updateBtn.nextSibling);
        setTimeout(function () {
            errorElement.style.display = "none";
        }, 3500);
    } else {
        var len = todoList.length;

        for (var i = 0; i < len; i++) {
            if (todoList[i]._id == todoId) {
                todoList[i].title = title.replace(/\s+/g, " ").trim();
                todoList[i].todoItem = todoItem.replace(/\s+/g, " ").trim();
                todoList[i].author = author;
                todoList[i].date = date;

                var successElement = document.createElement("h4");
                var successMessage = document.createTextNode("Congratulations, the todo list has been successfully updated.");
                successElement.setAttribute("class", "success");
                successElement.appendChild(successMessage);
                var updateBtn = document.getElementById("updateBtn");
                updateBtn.parentNode.insertBefore(successElement, updateBtn.nextSibling);
                setTimeout(function () {
                    successElement.style.display = "none";
                }, 3500);

                // document.getElementById("title").value = "";
                // document.getElementById("todoItem").value = "";
                // document.getElementById("author").value = "Aadesh";
                // document.getElementById("date").value = "";

                document.getElementById("todoListForm").reset();                
                document.getElementById("todoId").value = "";

                var todoListDiv = document.getElementById("todoLists");
                while (todoListDiv.hasChildNodes()) {
                    todoListDiv.removeChild(todoListDiv.firstChild);
                }

                displayTodoList(todoList);
            }
        }
    }
}

// Auto populate data in the form for update
function updateTodoItem(todoId) {
    var len = todoList.length;

    for (var i = 0; i < len; i++) {
        if (todoList[i]._id == todoId) {
            document.getElementById("todoId").value = todoList[i]._id;
            document.getElementById("title").value = todoList[i].title;
            document.getElementById("todoItem").value = todoList[i].todoItem;
            document.getElementById("author").value = todoList[i].author;
            document.getElementById("date").value = todoList[i].date;
        }
    }
}

// Delete todo item
function deleteTodoItem(todoId) {
    var len = todoList.length;

    for (var i = 0; i < len; i++) {
        if (todoList[i]._id == todoId) {
            todoList.splice(i, 1);

            var todoListDiv = document.getElementById("todoLists");
            while (todoListDiv.hasChildNodes()) {
                todoListDiv.removeChild(todoListDiv.firstChild);
            }

            displayTodoList(todoList);

            return true;
        }
    }
}
