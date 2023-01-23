import React from 'react'

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

import 'bootstrap/dist/css/bootstrap.min.css';

import { menuItems, showcaseItems } from './content/MenuItems';



export const Menu: React.FunctionComponent = () => {
    return (
        <div>
            <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
                <Container>
                <Navbar.Brand href="/">IG</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            {menuItems.map((item, index) => {
                                return (
                                    <Nav.Link key={index.toString()} href={item.path}>{item.title}</Nav.Link>
                                )
                            })}

                            <NavDropdown title="Experience" id="basic-nav-dropdown">
                                {showcaseItems.map((item, index) => {
                                        return (
                                            <NavDropdown.Item key={index} href={item.path}>{item.title}</NavDropdown.Item>
                                        )
                                })}
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
   )
}

export default Menu;