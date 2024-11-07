// import { ChangeEventHandler, useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
// import { buildPdf } from './pdf-builder';
import { Form } from './form';
import './app.scss'

function App() {

  // const [labelText, setLabelText] = useState<string>("");

  // const downloadPdf = () => {
  //   buildPdf(labelText);
  // };

  // const updateLabel: ChangeEventHandler<HTMLInputElement> = (event) => {
  //   console.log(event.target.value);
  //   setLabelText(event.target.value);
  // }

  return (
    <>
      <Form />
    </>
  )
}

export default App
