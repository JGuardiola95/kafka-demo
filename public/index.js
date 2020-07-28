$(document).ready(function () {
  var count = 10;
  var data = {
    labels: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    datasets: [{
      fillColor: "rgba(220, 220, 220, 0.5) ",
      strokeColor: "rgba(220, 220, 220, 1) ",
      pointColor: "rgba(220, 220, 220, 1) ",
      pointStrokeColor: "#fff",
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }]
  }
  var updateData = function (oldVal, newVal) {
    var labels = oldVal["labels"]
    var dataSetInitial = oldVal["datasets"][0]["data"]
    labels.shift()
    count++
    labels.push(count.toString())
    var newData = Math.floor(newVal)
    dataSetInitial.push(newData)
    dataSetInitial.shift()
  }
  var ctx = document.getElementById("myChart").getContext("2d")
  var chart = new Chart(ctx, {
    type: 'line',
    data: data
  })

  function webSocketInvoke() {

    if ("WebSocket" in window) {
      // var ws = new WebSocket("ws://localhost:3000/", "echo-protocol")
      const HOST = location.origin.replace(/^http/, 'ws');
      let ws = new WebSocket(`${HOST}`, 'echo-protocol');
      console.log("HOST PORT", HOST)
      console.log("WEB SOCKET", ws)
      ws.onopen = function () {
        console.log("Connection created")
      };

      ws.onmessage = function (evt) {
        let receivedMsg = JSON.parse(evt.data)
        if ((receivedMsg.content && typeof receivedMsg.content === 'number' && receivedMsg.content <= 20) || typeof receivedMsg === 'number' && receivedMsg <= 20) {
          console.log("UPODATEING EVENT", receivedMsg)
          updateData(data, evt.data)
          chart = new Chart(ctx, {
            type: 'line',
            data: data
          })
        } else if (typeof receivedMsg.content === 'string') {
          console.log("RECEIVED MSG", receivedMsg)
          alertify.success(receivedMsg.content);
        }

      }

      ws.onclose = function () {
        console.log("Connection closed")
      }
    } else {
      alert("WebSocket NOT supported by your Browser!")
    }
  }
  webSocketInvoke();
});