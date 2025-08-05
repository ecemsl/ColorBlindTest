import { Navbar, Nav, Container } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import NavItem from 'react-bootstrap/NavItem';
import { NavLink } from 'react-router-dom';
import NavDropdown from 'react-bootstrap/NavDropdown';

function NavbarComponent() {

    return (
        <Navbar bg="dark" data-bs-theme="dark" expand="lg">
            <Container>
                <Navbar.Brand href="/" className="d-flex align-items-center">
                    <img
                        src="/logo.svg"
                        alt="Home"
                        style={{ height: '100px', width: 'auto' }}
                        className="me-2"
                    />
                    <span style={{ fontFamily: 'Roboto Condensed' }}>ColorBlindTest</span>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={NavLink} to="/taketest"  style={{ fontSize: '1.2rem', fontFamily: 'Roboto Condensed' }}>Test</Nav.Link>
                        <Nav.Link as={NavLink} to="/questions" style={{ fontSize: '1.2rem', fontFamily: 'Roboto Condensed' }}>Questions</Nav.Link>
                        <Nav.Link as={NavLink} to="/results" style={{ fontSize: '1.2rem', fontFamily: 'Roboto Condensed' }}>Results</Nav.Link>
                        {/*
                        <Dropdown as={NavItem}>
                            <Dropdown.Toggle as={NavLink} style={{ fontSize: '1.2rem', fontFamily: 'Roboto Condensed' }} >
                                More
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item href="/whatis">What is Color Blindness?</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        */}
                        <NavDropdown style={{ fontSize: '1.2rem', fontFamily: 'Roboto Condensed' }} title="More" id="basic-nav-dropdown">
                            <NavDropdown.Item style={{ fontSize: '1.2rem', fontFamily: 'Roboto Condensed' }} as={NavLink} to="/whatis">What is Color Blindness?</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default NavbarComponent;