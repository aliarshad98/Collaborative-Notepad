# Collaborative-Notepad
A simple MERN Stack application allowing multiple users for real-time collaborative editing like Google Docs. The Editor will support multiple users real-time changing. A change made by one user will be automatically visible to other user in the editor.
# Functionalities
- Login/Registration
- Create your own document with a password.
- Collaborate with other user document by entering the id and password of the document.
- Real-time collaborative editing for multiple users. A change made by one user is visible to other user instantly.
- Editor contains multiple functions like Undo, Italic, Bold, Underline, change font, change color, change to upper and lower case, change to list and aligining the text (Center, Right, Left).
- Users can also download the document in pdf form.
# Pre-requisites
- Create MongoDB collection (users, documents) on MongoDB Atlas.
- Structure of the collection can be seen in backend -> models.
- Add MongoDB Atlas Collection URI in backend -> .env file.
- Paste URI as 'ATLAS_URI: **Copy and then Paste the link here**'.
- Open the code folder in Visual Studio Code.
# Run App
- To run the app, type 'npm start' in the terminal.
