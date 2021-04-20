import React from "react";
import "./App.scss";
import { Button, Form, FormControl, Nav, Navbar } from "react-bootstrap";

function App() {
  return (
    <div className='App'>
      <div className='nav-header'>
        <Navbar className="nav-header">
          <Navbar.Brand className="light" href='#home'>Corona Navigator</Navbar.Brand>
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
                <Button variant='outline-light'>Route anzeigen</Button>
              </Form>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    </div>
  );
}

export default App;
