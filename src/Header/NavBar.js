import React from 'react';
import { Nav, Navbar } from "react-bootstrap";
import "./Header.css";

function NavBar() {

  return (
    <div className="row m-0">
    <div className="col-12">
      <Navbar expand="lg" className="">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="nav">
            <Nav.Link className="nav-links" href="#home">
              Home
            </Nav.Link>
            <Nav.Link className="nav-links" href="#link">
              All Books
            </Nav.Link>
            <Nav.Link className="nav-links" href="#link">
              Category
            </Nav.Link>
            <Nav.Link className="nav-links" href="#link">
              Writer
            </Nav.Link>
            <Nav.Link className="nav-links" href="#link">
              Publisher
            </Nav.Link>
            <Nav.Link className="nav-links" href="#link">
              PDF Books
            </Nav.Link>
            <Nav.Link className="nav-links" href="#link">
              Blogs
            </Nav.Link>
            <Nav.Link className="nav-links" href="#link">
              Contact
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  </div>
)
}

export default NavBar;