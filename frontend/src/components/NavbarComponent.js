import { Navbar, Nav, Container } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import NavItem from 'react-bootstrap/NavItem';
import NavLink from 'react-bootstrap/NavLink';

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
                    <span>ColorBlindTest</span>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/taketest" style={{ fontSize: '1.2rem' }}>Test</Nav.Link>
                        <Nav.Link href="/questions" style={{ fontSize: '1.2rem' }}>Questions</Nav.Link>
                        <Nav.Link href="/results" style={{ fontSize: '1.2rem' }}>Results</Nav.Link>
                        <Dropdown as={NavItem}>
                            <Dropdown.Toggle as={NavLink} style={{ fontSize: '1.2rem' }} >
                                More
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item href="/typesof">Types of Color Blindness</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default NavbarComponent;