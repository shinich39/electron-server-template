const { invoke, send, receive } = utils;

receive("ping", function(event, data) {
  console.log("receive:", data);
  send("ping", "pong");
});

receive("pong", function(event, data) {
  console.log("receive:", data);
});

invoke("ping-pong", "ping")
  .then(function(data) {
    console.log("invoke:", data);
  });