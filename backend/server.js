const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established Successfully");
})

const DocumentRouter = require('./routes/Documents');
const UserRouter = require('./routes/Users');

app.use('/documents', DocumentRouter);
app.use('/users', UserRouter);


let collaborating = [];
io.on('connection', (socket) => {
    console.log('Connected!!');

    socket.on('Join', (data) => {
        socket.join(data.docId);
        let docOpen = false;
        collaborating.forEach((doc) => {
            if (doc.docId === data.docId) 
            {
                docOpen = true;
                if (doc.currentCollabs) 
                    doc.currentCollabs.push(data.user); 
                else 
                {
                  doc.currentCollabs = [doc.user];
                }
                console.log('User joined room: ');
                console.log(doc.currentCollabs);
                //console.log()
            }
        })
        if (docOpen === false) 
        {
            collaborating.push({ docId: data.docId, currentCollabs: [data.user] });
            //console.log(collaborating.length);
        }
    });

    socket.on('Leave', (data) => {
        socket.leave(data.docId);
        collaborating.forEach((doc) => {
          if (doc.docId === data.docId) {
            doc.currentCollabs.forEach((user, index) => {
              if (user.username === data.user.username) {
                doc.currentCollabs.splice(index, 1);
              }
            });
            //console.log('User left room: ');
            //console.log(doc.currentCollabs);
          }
        });
    });
    
    socket.on('CurrentUsers', (data) => {
        let collabs = null;
        collaborating.forEach((doc) => {
          if (doc.docId === data.docId) {
            collabs = doc.currentCollabs;
          }
        });
        socket.emit('CurrentUsers', collabs);
    });

    socket.on('Change', (data) => {
        socket.broadcast.to(data.docId).emit('Change', { editor: data.editor, styles: data.styles });
      });
});


http.listen(port);
console.log(`Server is running on port: ${port}`);

// app.listen(port, () => {
//     console.log(`Server is running on port: ${port}`);
// });