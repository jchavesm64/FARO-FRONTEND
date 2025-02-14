"use client"

import { useState } from "react"
import { Container, Row, Col, Table, Button } from "react-bootstrap"
import { ChevronRight, ChevronLeft } from "react-bootstrap-icons"

export function ServiceSelectCheckOut() {
  const [listaIzquierda, setListaIzquierda] = useState([
    { id: 1, nombre: "Item 1", valor: "Valor 1" },
    { id: 2, nombre: "Item 2", valor: "Valor 2" },
    { id: 3, nombre: "Item 3", valor: "Valor 3" },
  ])
  const [listaDerecha, setListaDerecha] = useState([])
  const [seleccionIzquierda, setSeleccionIzquierda] = useState([])
  const [seleccionDerecha, setSeleccionDerecha] = useState([])

  const moverDerecha = () => {
    const itemsAMover = listaIzquierda.filter((item) => seleccionIzquierda.includes(item.id))
    setListaDerecha([...listaDerecha, ...itemsAMover])
    setListaIzquierda(listaIzquierda.filter((item) => !seleccionIzquierda.includes(item.id)))
    setSeleccionIzquierda([])
  }

  const moverIzquierda = () => {
    const itemsAMover = listaDerecha.filter((item) => seleccionDerecha.includes(item.id))
    setListaIzquierda([...listaIzquierda, ...itemsAMover])
    setListaDerecha(listaDerecha.filter((item) => !seleccionDerecha.includes(item.id)))
    setSeleccionDerecha([])
  }

  const toggleSeleccion = (id, lista) => {
    if (lista === "izquierda") {
      setSeleccionIzquierda((prev) => (prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]))
    } else {
      setSeleccionDerecha((prev) => (prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]))
    }
  }

  const ListaItems = ({ items, seleccion, onToggle, lado }) => (
    <Table hover>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Valor</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr
            key={item.id}
            className={seleccion.includes(item.id) ? "table-primary" : ""}
            onClick={() => onToggle(item.id)}
            style={{ cursor: "pointer" }}
          >
            <td>{item.nombre}</td>
            <td>{item.valor}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  )

  return (
    <Container className="mt-4">
      <h1 className="text-center mb-4">Transferencia de Items</h1>

      <Row className="justify-content-center">
        <Col md={5} className="mb-3 mb-md-0">
          <h2 className="h4 mb-3">Lista Izquierda</h2>
          <ListaItems
            items={listaIzquierda}
            seleccion={seleccionIzquierda}
            onToggle={(id) => toggleSeleccion(id, "izquierda")}
            lado="izquierda"
          />
        </Col>

        <Col md={2} className="d-flex flex-md-column justify-content-center align-items-center mb-3 mb-md-0">
          <Button
            variant="primary"
            onClick={moverDerecha}
            disabled={seleccionIzquierda.length === 0}
            className="me-2 me-md-0 mb-md-2"
          >
            <ChevronRight />
          </Button>
          <Button variant="primary" onClick={moverIzquierda} disabled={seleccionDerecha.length === 0}>
            <ChevronLeft />
          </Button>
        </Col>

        <Col md={5}>
          <h2 className="h4 mb-3">Lista Derecha</h2>
          <ListaItems
            items={listaDerecha}
            seleccion={seleccionDerecha}
            onToggle={(id) => toggleSeleccion(id, "derecha")}
            lado="derecha"
          />
        </Col>
      </Row>
    </Container>
  )
}

