import React from "react";
import logo from "./logo.svg";
import "./App.css";
import {
  Button,
  Form,
  FormControl,
  Nav,
  Navbar,
  NavDropdown,
} from "react-bootstrap";

function App() {
  return (
    <div className='App'>
      <Navbar bg='light' expand='lg'>
        <Navbar.Brand href='#home'>Corona Navigator</Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='mr-auto'>
            <Form inline>
              <FormControl
                type='text'
                placeholder='Von'
                className='mr-sm-2'
              />
              <FormControl
                type='text'
                placeholder='Nach'
                className='mr-sm-2'
              />
              <Button variant='outline-success'>Route anzeigen</Button>
            </Form>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
}

export default App;
