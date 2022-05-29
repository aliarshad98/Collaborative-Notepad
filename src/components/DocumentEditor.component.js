import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Docs from "./docs.png";
import 'font-awesome/css/font-awesome.min.css';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
//import Login from './Login.component';
import {Editor, EditorState, RichUtils, convertToRaw, convertFromRaw} from 'draft-js';
import 'draft-js/dist/Draft.css';
import { CompactPicker } from 'react-color';
import axios from 'axios';
import io from 'socket.io-client';
import { Document, Packer, Paragraph, TextRun, AlignmentType} from 'docx';
//import officegen from 'officegen';
import filesaver from 'file-saver';
import {Message} from 'semantic-ui-react';
import FrontPage from './FrontPage.component';

const socket = io('http://localhost:5000');

const UPPERCASE = {
    textTransform: 'uppercase',
  };
  
  const LOWERCASE = {
    textTransform: 'lowercase',
  };

//   const CENTER = {
//       CODE: {
//         textAlign: 'center',
//       }
//   };

//   const myBlockTypes = DefaultDraftBlockRenderMap.merge(new Map({
//     center: {
//       wrapper: <div className={'center-align'} />,
//     },
//     right: {
//       wrapper: <div className={'right-align'} />,
//     },
//     left: {
//       wrapper: <div className={'left-align'} />,
//     },
//     justify: {
//       wrapper: <div className={'justify-align'} />,
//     },
//   }));

  const fontSizes = [
    { text: '4', value: 4 },
    { text: '8', value: 8 },
    { text: '10', value: 10 },
    { text: '12', value: 12 },
    { text: '14', value: 14 },
    { text: '16', value: 16 },
    { text: '20', value: 20 },
    { text: '24', value: 24 },
    { text: '30', value: 30 },
    { text: '36', value: 36 },
    { text: '42', value: 42 },
    { text: '50', value: 50 },
    { text: '64', value: 64 },
    { text: '72', value: 72 },
    { text: '90', value: 90 },
  ];

//   const TextAlignment = {
//     'center': {
//         fontFamily: '\'Georgia\', serif',
//     }
// };

class DocumentEditor extends React.Component {
    constructor(props)
    {
        super(props);
        this.state = {
            editorState: EditorState.createEmpty(),
            inlineStyles: {UPPERCASE, LOWERCASE},
            user: this.props.getUser(),
            doc: this.props.getDocument(),
            fontsize: 16,
            align: 'left',
            title: 'Untitled',
            password: '',
            lastsavetime: '',
            sharemodal: false,
            currentusers: [],
        }
        this.showShareModal = this.showShareModal.bind(this);
        //this.dontshowShareModal = this.dontshowShareModal(this);
        //this.getCurrentUsers();
        //this.onChange = (editorState) => this.setState({editorState});
    }

    componentDidMount()
    {
        this.setState({title: this.state.doc.Title, password: this.state.doc.Password, lastsavetime: this.state.doc.LastSaveTime});
        if (this.state.doc.Content.length > 0)
        {
            let lastEditVal = this.state.doc.Content.length - 1;
            const RawData = JSON.parse(this.state.doc.Content[lastEditVal].editorState);
            this.setState({editorState: EditorState.createWithContent(convertFromRaw(RawData))});
            if (this.state.doc.Content[lastEditVal].styles) {
                this.setState({ inlineStyles: this.state.doc.Content[lastEditVal].styles });
            }
            this.setState({align: this.state.doc.Content[lastEditVal].alignment});
            this.setState({title: this.state.doc.Title, password: this.state.doc.Password, lastsavetime: this.state.doc.LastSaveTime});
        }

        socket.on('connect', () => {console.log('AA connect!!')});
        socket.on('disconnect', () => {console.log('AA disconnect!!')});
        socket.emit('Join', { docId: this.state.doc._id, user: this.state.user });
        socket.on('CurrentUsers', (data) => {
            //console.log(data);
            let collabs = data.map((user) => {
            return { text: user.EmailAddress, value: user.EmailAddress, disabled: true };
            });
            this.setState({ currentusers: collabs }, () => console.log('Users: ', this.state.currentusers));
        });

        socket.on('Change', (editorState) => {
            const rawCont = JSON.parse(editorState.editor);
            this.setState({ editorState: EditorState.createWithContent(convertFromRaw(rawCont)),
            inlineStyles: editorState.styles, align: editorState.alignment });
        });
    }

    componentWillUnmount()
    {
        socket.emit('Leave', { docId: this.state.doc._id, user: this.state.user });
    }

    onChange(editorState) {
        const rawData = JSON.stringify(convertToRaw(editorState.getCurrentContent()));
        this.setState({
          editorState,
        }, () => {
          socket.emit('Change', { editor: rawData, docId: this.state.doc._id, styles: this.state.inlineStyles });
        });
    }

    getCurrentUsers()
    {
        socket.emit('CurrentUsers', { docId: this.state.doc._id });
    }

    // updatefontcolor(e)
    // {
    //     e.preventDefault();
    //     if (this.state.fontcolor === 'black')
    //         this.setState({fontcolor: 'red'});
    //     else
    //         this.setState({fontcolor: 'black'});
    // }

    _onBoldClick() {
        this.onChange(RichUtils.toggleInlineStyle(
          this.state.editorState,
          'BOLD'
        ));
      }
    _onItalicClick() {
        this.onChange(RichUtils.toggleInlineStyle(
          this.state.editorState,
          'ITALIC'
        ));
      }
    _onUnderlineClick() {
        this.onChange(RichUtils.toggleInlineStyle(
          this.state.editorState,
          'UNDERLINE'
        ));
      }
    _onUndoClick() {
        this.onChange(EditorState.undo(this.state.editorState));
    }

    _onTextAlign(val) {
        //console.log(align);
        //this.onChange(RichUtils.toggleBlockType(this.state.editorState, 'center'));
        this.setState({align: val});
    }

    _onOrderedListClick() {
        this.onChange(RichUtils.toggleBlockType(this.state.editorState, 'ordered-list-item'));
    }

    _onUpperClick() {
        this.onChange(RichUtils.toggleInlineStyle(
          this.state.editorState,
          'UPPERCASE'
        ));
      }

    _onLowerClick() {
        this.onChange(RichUtils.toggleInlineStyle(
          this.state.editorState,
          'LOWERCASE'
        ));
    }

    _onTimesClick() {
        this.onChange(RichUtils.toggleInlineStyle(
          this.state.editorState,
          'CODE'
        ));
    }

    _onArialClick() {
        this.onChange(RichUtils.toggleInlineStyle(
          this.state.editorState,
          'ARIAL'
        ));
    }

    changeFont(val) {
        //console.log('Fontsize is ', val.value);
        const newInlineStyles = Object.assign(
          {},
          this.state.inlineStyles,
          { [val.value]: { fontSize: `${val.value}px` } },
        );
        this.setState({
          inlineStyles: newInlineStyles,
          //editorState: RichUtils.toggleInlineStyle(this.state.editorState, val.value),
          fontsize: val.value,
        });
        this.onChange(RichUtils.toggleInlineStyle(
            this.state.editorState,
            val.value
        ));
    }

    changecolor(c)
    {
        //console.log(c);
        const newInlineStyles = Object.assign(
            {},
            this.state.inlineStyles,
            { [c.hex]: { color: c.hex } },
          );
          this.setState({
            inlineStyles: newInlineStyles,
          });
        this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, c.hex));
    }

    titleChange(e)
    {
        this.setState({title: e.target.value});
    }

    showShareModal()
    {
        this.setState ({sharemodal: !this.state.sharemodal});
    }

    // dontshowShareModal()
    // {
    //     this.setState ({sharemodal: false});
    // }

    savedoc(e)
    {
        e.preventDefault();
        // if (!this.state.newDoc)
        // {
        //     const RawData = JSON.stringify( convertToRaw(this.state.editorState.getCurrentContent()));
        //     //console.log(RawData);
        //     const newdoc = {
        //         Content: RawData,
        //         Owner: this.state.user._id,
        //         Title: this.state.title,
        //         Password: this.state.password,
        //         Styles: this.state.inlineStyles
        //     }
        //     axios.post('http://localhost:5000/documents/addDocument', newdoc)
        //         .then ((response) => {
        //             console.log(response.data);
        //             this.setState({doc: response.data});
        //             this.setState({inlineStyles: this.state.doc.Styles, title: this.state.doc.Title, password: this.state.doc.Password, lastsavetime: this.state.doc.LastSaveTime, newDoc: false});
        //         })
        //         .catch ((err) => {
        //             console.log(err);
        //         })
        // }
        //else
        //{
            // const RawData = JSON.stringify( convertToRaw(this.state.editorState.getCurrentContent()));
            // //console.log(RawData);
            // const newdoc = {
            //     Content: RawData,
            //     Owner: this.state.user._id,
            //     Title: this.state.title,
            //     Password: this.state.password,
            //     CreatedTime: this.state.doc.CreatedTime,
            //     LastSaveTime: this.state.doc.LastSaveTime,
            //     Styles: this.state.inlineStyles
            // }
            // axios.put('http://localhost:5000/documents/updatedocument/' + this.state.doc._id, newdoc)
            //     .then ((response) => {
            //         //console.log(response.data);
            //         this.setState({doc: response.data});
            //         //console.log(this.state.doc);
            //     })
            //     .catch ((err) => {
            //         console.log(err);
            //     })

            const RawData = JSON.stringify( convertToRaw(this.state.editorState.getCurrentContent()));
            //console.log(RawData);
            const newdoc = {
                title: this.state.title,
                id: this.state.doc._id,
                editor: RawData,
                alignment: this.state.align,
                styles: this.state.inlineStyles,
            }
            axios.post('http://localhost:5000/documents/updatedocument', newdoc)
                .then ((response) => {
                    console.log(response.data);
                    this.setState({doc: response.data});
                    this.setState({title: this.state.doc.Title, lastsavetime: this.state.doc.LastSaveTime});
                    //console.log(this.state.doc);
                })
                .catch ((err) => {
                    console.log(err);
                })
    }

    saveDate() {
        let theDate = new Date(this.state.lastsavetime);
        let options = { weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
        };
        return theDate.toLocaleString('en-US', options);
    }
    
    downloaddoc(e)
    {
        e.preventDefault();
        const doc = new Document();
        
        if (this.state.doc.Content.length > 0)
        {
            let lastEditVal = this.state.doc.Content.length - 1;
            const data = ( this.state.doc.Content[lastEditVal]);
            //console.log(data.alignment);
            const data1 = JSON.parse(data.editorState);
            console.log(data1);

            let aa;
            let b = false;
            let u = false;
            let i = false;
            let c = '';
            let f = 0;

            data1.blocks[0].inlineStyleRanges.forEach(e => {
                if (e.style === 'BOLD')
                {
                    b = true;
                }
                else if (e.style === 'UNDERLINE')
                {
                    u = true;
                }
                else if (e.style === 'ITALIC')
                {
                    i = true;
                }
                else if (e.style > 0 && e.style <= 90)
                {
                    f = e.style;
                }
                else
                {
                    c = e.style;
                }
            })

            if (data.alignment === 'left')
            {
                aa = AlignmentType.LEFT;
            }
            else if (data.alignment === 'right')
            {
                aa = AlignmentType.RIGHT;
            }
            else if (data.alignment === 'center')
            {
                aa = AlignmentType.CENTER;
            }
            else if (data.alignment === 'justify')
            {
                aa = AlignmentType.JUSTIFIED;
            }

            while(c.charAt(0) === '#')
            {
                c = c.substr(1);
            }

            c = `"${c}"`;

            console.log(aa);
            console.log(b);
            console.log(u);
            console.log(i);
            console.log(c);
            console.log(f);

            // Documents contain sections, you can have multiple sections per document, go here to learn more about sections
            // This simple example will only contain one section
            doc.addSection({
                properties: {},
                children: [
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: data1.blocks[0].text,
                                alignment: aa,
                                color: c,
                                bold: b,
                                italics: i,
                                underline: u,
                                size: f*2,
                                //underline: `${data.blocks[0].inlineStyleRanges[4].style}`,
                            }),
                            // new TextRun({
                            //     text: "\tGithub is the best",
                            //     bold: true,
                            // }),
                        ],
                    }),
                ],
            });
        }
        else
        {
            doc.addSection({
                properties: {},
                children: [
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: '',
                            }),
                        ],
                    }),
                ],
            });
        }
        Packer.toBlob(doc).then((buffer) => {
            // fs("My Document.docx", buffer);
            console.log(buffer);
            filesaver.saveAs(buffer, "ABC.docx");
            
        });
        
    }

    deleteDoc()
    {
        axios.post('http://localhost:5000/documents/deletedoc/' + this.state.doc._id)
            .then((response) => {
                if (response.data)
                {
                    this.props.redirect(FrontPage);
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }

    render()
    {
        return(<div className= {'container'}>
            <nav className= {'navbar navbar-default'}>
                <ul className= {'nav nav-pills'}>
                <li><button className= {'fa fa-arrow-left'} type= {'submit'} onClick= {()=> this.props.redirect(FrontPage)}></button></li>
                    <img src={Docs} alt="Logo" style={{height: '100px'}}></img>
                    <div>
                        <br></br>
                        <input type="text" className= {'form-control'} value= {this.state.title} onChange= {e => this.titleChange(e)} style= {{outline: '0px'}}></input>
                        <br></br>
                        <label>
                            Last Saved on {this.saveDate()}
                        </label>
                    </div>
                </ul>
                <ul className= {'nav navbar-nav navbar-right'}>
                    <ul className= {'nav nav-pills'}>
                        <li>
                            {/* <button className= {'fa fa-users'} type= {'submit'} onClick= {this.getCurrentUsers()}> */}
                                <DropdownButton className= {'fa fa-users'} onClick= {() => this.getCurrentUsers()}>
                                    {/* <Dropdown.Toggle id="dropdown-basic">

                                    </Dropdown.Toggle> */}
                                    {/* <Dropdown.Menu> */}
                                    {this.state.currentusers.map(item => (
                                        <Dropdown.Item key={item.value} href="#/action-1" >{item.value}</Dropdown.Item>
                                    ))}
                                    {/* </Dropdown.Menu> */}
                                </DropdownButton>
                            {/* </button> */}
                        </li>
                        &nbsp;
                        <li>
                            <button className= {'fa fa-share'} type= {'submit'} onClick= {this.showShareModal}>
                                { this.state.sharemodal ?
                                    <Message>
                                        <Message.Header>
                                            Share Details
                                        </Message.Header>
                                        <p>
                                            ID: {this.state.doc._id}
                                            Password: {() => this.showPass()}
                                        </p>
                                    </Message>

                                : null}
                            </button>
                        </li>
                        &nbsp;
                        <li><button className= {'fa fa-sign-out'} type= {'submit'} onClick= {()=> this.props.reset()}></button></li>
                    </ul>
                </ul>
            </nav>
            <ul className= {'nav nav-tabs'}>
                <Dropdown>
                        <Dropdown.Toggle id="dropdown-basic" as= {"a"} href = "#a">
                            File
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item href="#/action-1" onClick={(e) => this.savedoc(e)}>Save</Dropdown.Item>
                            <Dropdown.Item href="#/action-2" onClick={() => this.deleteDoc()}>Delete</Dropdown.Item>
                        </Dropdown.Menu>
                </Dropdown>
                &nbsp;&nbsp;
                <Dropdown>
                        <Dropdown.Toggle id="dropdown-basic" as= {"a"} href = "#a">
                            Export
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item href="#/action-1" onClick= {(e) => this.downloaddoc(e)}>Download</Dropdown.Item>
                        </Dropdown.Menu>
                </Dropdown>
                &nbsp;&nbsp;
                <Dropdown>
                        <Dropdown.Toggle id="dropdown-basic" as= {"a"} href = "#a">
                            Help
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item href="#/action-1">Docs Help</Dropdown.Item>
                            <Dropdown.Item href="#/action-2">Report Problem</Dropdown.Item>
                        </Dropdown.Menu>
                </Dropdown>
            </ul>
            <br></br>
            <ul className= {'nav nav-pills'}>
                &nbsp;
                <li>
                    <button className= {'fa fa-undo'} style= {{backgroundColor: 'lightgrey'}} onMouseDown= {this._onUndoClick.bind(this)}></button>
                </li>
                &nbsp;&nbsp;
                <Dropdown>
                    <Dropdown.Toggle id="dropdown-basic" as= {"a"} href = "#a">
                        {this.state.fontsize}
                    </Dropdown.Toggle>

                    <Dropdown.Menu option>
                        {fontSizes.map(item => (
                            <Dropdown.Item key={item.text} href="#/action-1" onClick= {() => this.changeFont(item)}>{item.value}</Dropdown.Item>
                        ))}
                        {/* <Dropdown.Item href="#/action-1">14</Dropdown.Item>
                        <Dropdown.Item href="#/action-2">16</Dropdown.Item>
                        <Dropdown.Item href="#/action-3">18</Dropdown.Item> */}
                    </Dropdown.Menu>
                </Dropdown>
                &nbsp;&nbsp;
                
                {/* <Dropdown>
                    <Dropdown.Toggle id="dropdown-basic" as= {"a"} href = "#a">
                        {this.state.fontfamily}
                    </Dropdown.Toggle>

                    <Dropdown.Menu option>
                        {/* {Impact.map(item => ( */}
                            {/* <Dropdown.Item href="#/action-1" onMouseDown= {this._onArialClick.bind(this)}>Arial</Dropdown.Item>
                            <Dropdown.Item href="#/action-2" onMouseDown= {this._onTimesClick.bind(this)}>Times New Roman</Dropdown.Item> */}
                        {/* ))} */}
                        {/* <Dropdown.Item href="#/action-1">Times New Roman</Dropdown.Item>
                        <Dropdown.Item href="#/action-2">Calibiri</Dropdown.Item>
                        <Dropdown.Item href="#/action-3">Verdana</Dropdown.Item> */}
                    {/* </Dropdown.Menu>
                </Dropdown> */}

                &nbsp;&nbsp;
                <li>
                    <button className={'fa fa-bold'} style= {{backgroundColor: 'lightgrey'}} onMouseDown= {this._onBoldClick.bind(this)}></button>
                </li>
                &nbsp;
                <li>
                    <button className={'fa fa-italic'} style= {{backgroundColor: 'lightgrey'}} onMouseDown= {this._onItalicClick.bind(this)}></button>
                </li>
                &nbsp;
                <li>
                    <button className={'fa fa-underline'} style= {{backgroundColor: 'lightgrey'}} onMouseDown= {this._onUnderlineClick.bind(this)}></button>
                </li>
                &nbsp;
                <li>
                    {/* <button className= {'fa fa-font'} style= {{backgroundColor: 'lightgrey'}}></button> */}
                    <Dropdown className= {'fa fa-font'}>
                        <Dropdown.Toggle id="dropdown-basic" as= {"a"} href = "#a">
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item>
                                <CompactPicker onChangeComplete={(c) => this.changecolor(c)}>
                                </CompactPicker>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </li>
                &nbsp;
                <li>
                    <button className= {'fa fa-chevron-up'} style= {{backgroundColor: 'lightgrey'}} onMouseDown= {this._onUpperClick.bind(this)}></button>
                </li>
                &nbsp;
                <li>
                    <button className= {'fa fa-chevron-down'} style= {{backgroundColor: 'lightgrey'}} onMouseDown= {this._onLowerClick.bind(this)}></button>
                </li>
                &nbsp;
                <li>
                    <button className= {'fa fa-align-left'} style= {{backgroundColor: 'lightgrey'}} onClick= {() => this._onTextAlign('left')}></button>
                </li>
                &nbsp;
                <li>
                    <button className= {'fa fa-align-center'} style= {{backgroundColor: 'lightgrey'}} onClick= {() => this._onTextAlign('center')}></button>
                </li>
                &nbsp;
                <li>
                    <button className= {'fa fa-align-right'} style= {{backgroundColor: 'lightgrey'}} onClick= {() => this._onTextAlign('right')}></button>
                </li>
                &nbsp;
                <li>
                    <button className= {'fa fa-align-justify'} style= {{backgroundColor: 'lightgrey'}} onClick= {() => this._onTextAlign('justify')}></button>
                </li>
                &nbsp;
                <li>
                    <button className= {'fa fa-list'} style= {{backgroundColor: 'lightgrey'}} onMouseDown= {this._onOrderedListClick.bind(this)}></button>
                </li>
            </ul>
            <br></br>
            <div className= {'container'}>
                {/* <textarea className= {'form-control'} rows= "20" style= {{text: this.state.fontcolor}}>
                </textarea> */}
                <Editor
                editorState= {this.state.editorState}
                customStyleMap={this.state.inlineStyles} 
                onChange={e => this.onChange(e)}
                //blockRenderMap={myBlockTypes}
                textAlignment={this.state.align}
                placeholder={'Write Something!!'}
                spellCheck= {true}
                />
                
            </div>
            
            {/* <Modal show= {this.state.sharemodal} onHide= {this.state.sharemodal}>
                <Modal.Header closeButton>
                    <Modal.Title>Share with others</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className= {'form-group row'}>
                                <label className= {'col-sm-2 col-form-label'}>Email</label>
                                <div className= {'col-sm-10'}>
                                    <input className= {'form-control form-control-sm'} type = {'email'}></input>
                                </div>
                    </div>
                </Modal.Body>
                    <Modal.Footer>
                        <button onClick={this.dontshowShareModal}>
                            Close
                        </button>
                        <button className= {'btn btn-primary'}>
                            Collaborate
                        </button>
                    </Modal.Footer>
            </Modal> */}
        </div>);
    }
}

export default DocumentEditor;