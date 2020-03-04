import React, {useRef, useState, useEffect} from 'react';
import './App.css';
import parse from './parse'
import { parseNumbers, parseBooleans } from 'xml2js/lib/processors'
import { UnControlled as CodeMirror } from 'react-codemirror2'
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
require('codemirror/mode/xml/xml');
require('codemirror/mode/javascript/javascript');
const xml2js = require('xml2js');

function App() {
  const [xml, setXml] = useState('')
  const [parsedXml, setParsedXml] = useState('')
  const [xunitXml, setXunitXml] = useState('')
  useDebouncedEffect(parseXml, 1000, [xml])
  
  async function parseXml(){
    try{
      const options = {
        mergeAttrs: true,
        explicitArray: false,
        valueProcessors: [parseBooleans, parseNumbers],
        attrValueProcessors: [parseBooleans, parseNumbers]
      }
      const temp = await xml2js.parseStringPromise(xml, options)
      setParsedXml(JSON.stringify(temp, null, 1))
    }
    catch(err){
      setParsedXml(err)
    }

    try{
      const temp2 = await parse(xml)
      console.log('parsed')
      setXunitXml(JSON.stringify(temp2, null, 1))
    }
    catch(err){
      console.error(err)
      setXunitXml(err)
    }
  }

  return (
    <div className="App">
      <CodeMirror  
        value={xml} 
        onChange={(e, data, value)=>setXml(value)}
        options={{
          mode: 'xml',
          theme: 'material',
          lineNumbers: true,
          tabSize:1
        }}
      />
      <CodeMirror 
        value={parsedXml}
        options={{
          mode: 'javascript',
          theme: 'material',
          lineNumbers: true,
          tabSize: 1
        }}
      />
      {/* <CodeMirror 
        value={xunitXml} 
        options={{
          mode: 'javascript',
          theme: 'material',
          lineNumbers: true,
          tabSize: 1
        }}
      /> */}
    </div>
  );
}

export function useDebouncedEffect(callback, delay, deps = []) {
  const firstUpdate = useRef(true);
  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    const handler = setTimeout(() => {
      callback();
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  },
    [delay, ...deps],
  );
}

export default App;
