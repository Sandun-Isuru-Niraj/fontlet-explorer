import React from 'react';


//const app = window.require('electron');

//const app = windows.electron.app;

const sudo = window.require('sudo-prompt');
const os = window.require("os");
const addFont = "C:\\Users\\Sachintha\\Desktop\\new\\fontcase-explorer\\src\\lib\\addFont.bat";

// used to get the userData path according to os
const remote = window.require('electron').remote;
const app = remote.app;



const fonts = [
  {
    id: 1,
    name: "Abhaya Libre",
    version: "1.0.1",
    publisher: "mooniak",
    url: "url goes here"
  },
  {
    id: 2,
    name: "Malithi Web",
    version: "1.0.2",
    publisher: "Pushpananda Ekanayake",
    url: "url goes here"
  }
];

//Todo write function to download font to local

function installFont(url) {
  // Detect O/S
  console.log(os.type(), os.platform());

  

  // Directory/File paths
  const fontFilePath = "/Users/jarvis/Dev/apps/fontcase-apps/fontcase-explorer/_tmp/Athena.ttf";
  const localFontsDirPath = "~/Library/Fonts/";

  // used to get the userData path according to os
  console.log(3333,app.getPath('userData') )


  // TODO:
  // Here, based on the O/S do run the terminal commands in `sudo.exec(______)`

  if(os.type() === "Windows_NT"){
    console.log("windows font installer started");
    const fileNameOrfolder  = "..\\..\\_tmp\\Roboto-Black.ttf"

    function windowsFontInstaller(){
        console.log("its working")
        var spawn = window.require('child_process').spawn,
        ls    = spawn('cmd.exe', ['/c', addFont,fileNameOrfolder]);

        ls.stdout.on('data', function (data) {
        console.log('stdout: ' + data);
        });

        ls.stderr.on('data', function (data) {
        console.log('stderr: ' + data);
        });

        ls.on('exit', function (code) {
        console.log('child process exited with code ' + code);
        });

    }

    windowsFontInstaller();

    
  }else{

 // for unix   
    
  const options = {
    name: 'fontcase'
  };
  sudo.exec(`cp ${fontFilePath} ${localFontsDirPath}`, options,
    function(error, stdout, stderr) {
      if (error) throw error;
      console.log('stdout: ' + stdout);
    }
  );

  }

  

}

const FontItem = ({ id, name, version, publisher, url}) => (
  <li key={id}>
    <div>
        <p>{name} | v{version}</p>
        <p>{publisher}</p>
      
        <button onClick={() => installFont(url)}>Install</button>
    </div>
  </li>
);

const Gallery = () => (
  <div>
    <ul>
      {fonts.map(FontItem)}
    </ul>
  </div>
);

export default Gallery;
