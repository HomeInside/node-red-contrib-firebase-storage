module.exports = function (RED) {
  function UploadFileNode(config) {
    RED.nodes.createNode(this, config);
    this.server = RED.nodes.getNode(config.server);
    this.folder = config.folder;

    var node = this;
    if (node.server) {
      node.status({fill: "green", shape: "dot", text: "connected"});
    } else {
      node.status({fill: "red", shape: "ring", text: "disconnected"});
    }

    node.on("input", function (msg) {
      if (node.server) {
        global.XMLHttpRequest = require("xhr2");
        node.status({fill: "blue", shape: "dot", text: "uploading"});

        var imagesRef = node.server.storageRef.child(node.folder);

        if (msg.attachments.length > 0) {
          //todo: add image metadata
          var file = msg.attachments[0].content;
          var fileName = msg.attachments[0].fileName;
          var fileContentType = msg.attachments[0].contentType;

          var metadata = {
            contentType: fileContentType,
          };

          var uploadRef = imagesRef.child(fileName);
          var uploadTask = uploadRef.put(file, metadata);

          uploadTask.on(
            "state_changed",
            function (snapshot) {
              var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              node.log("Upload is " + progress + "% done");
            },
            function (error) {
              node.status({fill: "red", shape: "ring", text: "upload failed"});
              node.error("Upload failed: " + error.code, msg);
            },
            function () {
              uploadTask.snapshot.ref
                .getDownloadURL()
                .then((downloadURL) => {
                  node.log("Download url:" + downloadURL);
                  msg.downloadUrl = downloadURL;
                  node.status({fill: "green", shape: "dot", text: "connected"});
                  node.send(msg);
                })
                .catch((error) => {
                  // Uh-oh, an error occurred!
                  node.status({fill: "red", shape: "ring", text: "download url failed"});
                  node.error("Uh-oh, an error occurred, while retrieving the download url!", error);
                });
            }
          );
        }
      } else {
        node.status({fill: "red", shape: "ring", text: "disconnected"});
        node.error("Config node not filled with Firebase account data", msg);
      }
    });
  }
  RED.nodes.registerType("upload-to-firebase", UploadFileNode);
};
