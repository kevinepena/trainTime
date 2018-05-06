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

        var now = moment();
        var newRow = $("<tr>");
        var key = childSnapshot.key;
        var childData = childSnapshot.val();
        column = $("<td>");
        column.text(childData.name);
        newRow.append(column);
        column = $("<td>");
        column.text(childData.destination);
        newRow.append(column);
        column = $("<td>");
        column.text(childData.frequency);
        newRow.append(column);
        column = $("<td>");

        var start = moment((childData.firstTrainTime), "HH:mm");
        var end = moment();
        // if (start.isBefore(end)) start.add(1, 'day');
        if (start.isBefore(end)) start.add(childData.frequency, 'minutes');
                if (start.isBefore(end)) start.add(1, 'day');

        column.text(moment(start).format("HH:mm"));
        newRow.append(column);
        column = $("<td>");

        var d = moment.duration(start.diff(end));
        var minutes = (d.minutes() + 1);
        var hour = d.hours();
        minutes = minutes + (hour * 60)
        column.text(minutes);
        newRow.append(column);

        database.ref(key).update({

            minutesAway: minutes});

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
    var column = $("<td>");

    column.text(ftt);
    newRow.append(column);


    var start = moment(ftt, "HH:mm");
    var end = moment();

    // account for crossing over to midnight the next day
    if (start.isBefore(end)) start.add(1, 'day');

    var d = moment.duration(start.diff(end));
    var minutes = (d.minutes() + 1);
    var hour = d.hours();
    minutes = minutes + (hour * 60)
    
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