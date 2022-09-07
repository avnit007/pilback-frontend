import "./App.css";
import { Container, Navbar } from "react-bootstrap";
import { Navigate, Route, Routes } from "react-router-dom";
import CoreData from "./components/CoreData";
import NodeData from "./components/NodeData";
import SensorData from "./components/SensorData";
import PayloadData from "./components/PayloadData";

function App() {
  return (
    <div className="App">
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand>Pilback</Navbar.Brand>
        </Container>
      </Navbar>
      <Routes>
        <Route path="/" exact element={<Navigate to='/sites' />} />
        <Route path="/sites" exact element={<CoreData />} />
        <Route path="/:site/nodes" exact element={<NodeData />} />
        <Route path="/:node/sensors" exact element={<SensorData />} />
        <Route path="/:sensor/payloads" exact element={<PayloadData />} />
      </Routes>
    </div>
  );
}

export default App;
