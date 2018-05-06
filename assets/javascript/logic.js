//   // Initialize Firebase
var config = {
    apiKey: "AIzaSyDZXH7JcHvgXqUOJrC_yO3LQXBwx-SnJz4",
    authDomain: "traintime-8e52e.firebaseapp.com",
    databaseURL: "https://traintime-8e52e.firebaseio.com",
    projectId: "traintime-8e52e",
    storageBucket: "",
    messagingSenderId: "209939284088"
};
firebase.initializeApp(config);

var database = firebase.database();


var query = database.ref().orderByKey();
query.once("value").then(function (snapshot) {
    snapshot.forEach(function (childSnapshot) {

        var newRow = $("<tr>");
        var key = childSnapshot.key;
        var childData = childSnapshot.val();
        console.log(childData);
        var column = $("<td>");
        column.text(childData.name);
        newRow.append(column);
        var column = $("<td>");
        column.text(childData.destination);
        newRow.append(column);
        var column = $("<td>");
        column.text(childData.frequency);
        newRow.append(column);
        var column = $("<td>");
        column.text(childData.firstTrainTime);
        newRow.append(column);
        var column = $("<td>");
        column.text(childData.minutesAway);
        newRow.append(column);

        $("#tableBody").append(newRow);

    });

});



$("#addButton").on("click", function (event) {

    event.preventDefault();

    var newRow = $("<tr>");
    var newColumn;
    var trainObj = {};

    $("form").find("input").each(function (index, input) {
        var key = $(input).attr("name");
        var val = $(input).val();

        if (key === "firstTrain") {
            trainObj[key] = val;
            return;
        } else {
            trainObj[key] = val;
            newColumn = $("<td>");
            newColumn.text(val);
            newRow.append(newColumn);
        }

    });

    var ftt = trainObj.firstTrain;

    console.log(trainObj.name);
    console.log(trainObj.destination);

    var column = $("<td>");
    column.text(ftt);
    newRow.append(column);


    var start = moment(ftt, "HH:mm");
    var end = moment();
    console.log(start)
    console.log(end)

    // account for crossing over to midnight the next day
    if (start.isBefore(end)) start.add(1, 'day');

    var d = moment.duration(start.diff(end));
    console.log(d);

    var minutes = (d.minutes() + 1);
    var hour = d.hours();
    minutes = minutes + (hour * 60)

    console.log(minutes);
    console.log(hour);

    var column = $("<td>");
    column.text(minutes);
    newRow.append(column);

    database.ref().push({
        name: trainObj.name,
        destination: trainObj.destination,
        firstTrainTime: ftt,
        frequency: trainObj.frequency,
        minutesAway: minutes

    });

    $("#tableBody").append(newRow);

});

// function nextArrival (ftt) {
//     ftt = moment().format("HH:mm");
//     var today = moment().format("HH:mm");

//     var ran = moment.duration(ftt.diff(today))
//     console.log(ftt)
// }


