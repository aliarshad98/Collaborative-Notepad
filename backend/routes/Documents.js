const router = require('express').Router();
let Document = require('../models/Document.model');

router.route('/').get((req, res) => {
    Document.find()
        .then(documents => res.json(documents))
        .catch(err => res.status(400).json('Error: '+ err));
});

router.route('/addDocument').post((req, res) => {

    //const Content = req.body.Content;
    const Owner = req.body.Owner;
    const Title = req.body.Title;
    const Password = req.body.Password;
    const CreatedTime = new Date();
    const LastSaveTime = new Date();
    //const Styles = req.body.styles;

    const NewDocument = new Document({Owner,Title,Password,CreatedTime,LastSaveTime});

    NewDocument.save()
        .then((document) => res.json(document))
        .catch(err => res.status(400).json('Error: '+ err));
});

router.route('/:owner').get((req,res) => {
    Document.find({Owner: req.params.owner})
        .then(document => res.json(document))
        .catch(err => res.status(400).json('Error: ' + err));
});

// router.route('/updatedocument/:id').put((req,res) => {

//     const content = req.body.Content;
//     const owner = req.body.Owner;
//     const title = req.body.Title;
//     const password = req.body.Password;
//     const createdTime = req.body.CreatedTime;
//     const lastSaveTime = req.body.LastSaveTime;
//     const styles = req.body.Styles;

//     Document.findByIdAndUpdate({_id: req.params.id}, {Content: content, Owner: owner, Title: title, Password: password, CreatedTime: createdTime, LastSaveTime: lastSaveTime, Styles: styles}, {new: true})
//         .then((document) => res.json(document))
//         .catch(err => res.status(400).json('Error: ' + err));
// })

router.route('/updatedocument').post((req,res) => {

    // const content = req.body.Content;
    // const owner = req.body.Owner;
    // const title = req.body.Title;
    // const password = req.body.Password;
    // const createdTime = req.body.CreatedTime;
    // const lastSaveTime = req.body.LastSaveTime;
    // const styles = req.body.Styles;

    const contentUpdate = {
        editorState: req.body.editor,
        saveTime: new Date(),
        title: req.body.title,
        alignment: req.body.alignment,
        styles: req.body.styles,
      };
    
    Document.findById(req.body.id)
      .then((document) => {
          let newContent = [...document.Content];
          newContent.push(contentUpdate);
          Document.findByIdAndUpdate(req.body.id, {Content: newContent, Title: contentUpdate.title, LastSaveTime: contentUpdate.saveTime}, {new: true})
            .then((document) => res.json(document))
            .catch(err => res.status(400).json('Error: ' + err));
      })
});

router.route('/collaborate').post((req,res) => {
    
    Document.findById(req.body.id)
      .then((document) => {
          let newCollab = [...document.CollaboratorList];
          newCollab.push(req.body.userid);
          if (document.Password === req.body.password)
          {
              Document.findByIdAndUpdate(req.body.id, {CollaboratorList: newCollab}, {new: true})
                .then((document) => res.json(document))
                .catch(err => res.status(400).json('Error: ' + err));
          }
          else
          {
              res.json('Passwords donot match!!');
          }
      })
      .catch((err) => res.status(400).json('Error: ' + err));
});

router.route('/collabdocs/:id').get((req, res) => {
    Document.find()
        .then((documents) => {
            let collab = documents.filter(doc => {
                if (doc.CollaboratorList.indexOf(req.params.id) > -1) {
                    //console.log(collab);
                    return true;
                }
                return false;
            })
            res.json(collab)})
        .catch(err => res.status(400).json('Error: '+ err));
});

router.route('/deletedoc/:id').post((req, res) => {
    Document.findByIdAndDelete(req.params.id)
        .then((response) => {
            res.json('Document Deleted!!');
        })
        .catch((err) => {
            res.status(400).json('Error: '+ err)
        });
});

module.exports = router;