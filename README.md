node-red-contrib-firebase-storage
========================
[Node-RED](http://nodered.org) nodes allowing to interact with Firebase storage.
Upload node - allows to upload files to Firebase Storage Bucket

Install
-------
Install from [npm](http://npmjs.org)
```
npm install node-red-contrib-firebase-storage
```

Usage
-----
**Firebase Upload**
Node allows uploading files to Google Firebase File Storage.
Input param is `msg.attachments` - array of file description objects to be stored in Firebase bucket.
Each attachment should contain at least ```fileName``` , ```content``` and ```contentType``` properties.
Node output contains `msg.downloadUrl` - download URL for uploaded file.

**Firebase Download**
Node allows resolving file name to download URL.
Input param is `msg.fileName` - download file name. Node output contains `msg.downloadUrl` - download URL for file.

**Firebase configuration properties**

- *Firebase Project* - ```projectId``` from Firebase config file.
- *API Key* - ```apiKey``` from Firebase config file.
- *storageBucket* - ```storageBucket``` from Firebase config file, eg. "my-project.appspot.com".

Configure
-----

**step 1: edit node**

set a name for the folder inside the Firebase Storage Bucket

![](https://i.imgur.com/35YlYWT.png)



**step 2: defines project properties**

![](https://i.imgur.com/QTfa3nr.png)


**step 3: finish**

make sure the folder inside the bucket exists

![](https://i.imgur.com/CtJ1QPb.png)



Flow example
-----

![](https://i.imgur.com/LUOSwE6.png)

```json
[{"id":"1b5f65d2.6c8a1a","type":"tab","label":"Flow 2","disabled":false,"info":""},{"id":"eb3f8553.cc2de8","type":"jimp-image","z":"1b5f65d2.6c8a1a","name":"","data":"payload","dataType":"msg","ret":"buf","parameter1":"","parameter1Type":"msg","parameter2":"","parameter2Type":"msg","parameter3":"","parameter3Type":"msg","parameter4":"","parameter4Type":"msg","parameter5":"","parameter5Type":"msg","parameter6":"","parameter6Type":"msg","parameter7":"","parameter7Type":"msg","parameter8":"","parameter8Type":"msg","sendProperty":"payload","sendPropertyType":"msg","parameterCount":0,"jimpFunction":"none","selectedJimpFunction":{"name":"none","fn":"none","description":"Just loads the image.","parameters":[]},"x":270,"y":100,"wires":[["9aeb7f13.e0a2"]]},{"id":"919f2646.a57b38","type":"inject","z":"1b5f65d2.6c8a1a","name":"send image","props":[{"p":"payload"}],"repeat":"","crontab":"","once":false,"onceDelay":"","topic":"","payload":"https://cdn.pixabay.com/photo/2019/05/10/09/55/demonstration-4193109_960_720.jpg","payloadType":"str","x":130,"y":100,"wires":[["eb3f8553.cc2de8"]]},{"id":"9aeb7f13.e0a2","type":"function","z":"1b5f65d2.6c8a1a","name":"fn send_file","func":"var millis = Date.now();\n\nvar imagenName = \"image_\" + millis + \".jpg\";\n\n\nmsg.attachments = [{\n    content: msg.payload, \n    fileName: imagenName,\n    contentType: msg.imageInfo.MIME\n}];\n\nreturn msg;\n","outputs":1,"noerr":0,"initialize":"","finalize":"","x":410,"y":140,"wires":[["121bd5a8.457ada"]]},{"id":"964dcb83.1b1ea8","type":"debug","z":"1b5f65d2.6c8a1a","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"true","targetType":"full","statusVal":"","statusType":"auto","x":850,"y":180,"wires":[]},{"id":"5852c2aa.908dcc","type":"download-from-firebase","z":"1b5f65d2.6c8a1a","server":"15ac4a55.8ac376","name":"","folder":"","x":650,"y":260,"wires":[["964dcb83.1b1ea8"]]},{"id":"99e2bcb0.61c27","type":"inject","z":"1b5f65d2.6c8a1a","name":"download image","props":[{"p":"fileName","v":"Faqs/image_1622047253159.jpg","vt":"str"}],"repeat":"","crontab":"","once":false,"onceDelay":"","topic":"","x":400,"y":260,"wires":[["5852c2aa.908dcc"]]},{"id":"121bd5a8.457ada","type":"upload-to-firebase","z":"1b5f65d2.6c8a1a","server":"dca26e1c.262cb","name":"","folder":"Faqs","x":610,"y":140,"wires":[["964dcb83.1b1ea8"]]},{"id":"15ac4a55.8ac376","type":"config-firebase","apikey":"awesome-api-key","authdomain":"awesome-project.firebaseapp.com","bucket":"awesome-project.appspot.com","project":"awesome-project"},{"id":"dca26e1c.262cb","type":"config-firebase","apikey":"awesome-api-key","authdomain":"myproyect.firebaseapp.com","bucket":"awesome-project.appspot.com","project":"awesome-project"}]
```

notice:
-----

this example uses the [image-tools node](https://flows.nodered.org/node/node-red-contrib-image-tools)

