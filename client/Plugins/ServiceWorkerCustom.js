self.addEventListener("message", function(event) {
    event.source.postMessage("Responding to " + event.data);
});
