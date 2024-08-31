import { Button, Card, Container, Row, Col } from "react-bootstrap";
import React, { useEffect, useCallback } from "react";
import {
  exportExcel,
  fetchUsers,
  userChangeEtat,
} from "../../../Redux/usersReduce";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import MaterialReactTable from "material-react-table";
import { toast, ToastContainer } from "react-toastify";

// core components
function ListUser({ obj }) {
  const annee = localStorage.getItem("annee");
  const notify = (type, msg) => {
    if (type === 1)
      toast.success(
        <strong>
          <i className="fas fa-check-circle"></i>
          {msg}
        </strong>
      );
    else
      toast.error(
        <strong>
          <i className="fas fa-exclamation-circle"></i>
          {msg}
        </strong>
      );
  };
  const navigate = useHistory();
  var idRole = obj.user.id_role;
  const dispatch = useDispatch();
  const [entities, setEntities] = React.useState([]);
  const [columns] = React.useState([
    //column definitions...
    {
      header: "Nom et prénom",
      accessorKey: "nom_prenom",
    },
    {
      header: "Login",
      accessorKey: "login",
    },
    {
      header: "Role",
      accessorKey: "role",
      Cell: ({ cell }) => cell.row.original.roles.nom,
    },
    {
      header: "E-mail",
      accessorKey: "email",
    },
    {
      header: "Etat",
      accessorKey: "etat",
      Cell: ({ cell }) =>
        cell.row.original.etat === 1 ? "Activé" : "Désactivé",
    },
    {
      accessorKey: "id",
      header: "actions",
      Cell: ({ cell, row }) => (
        <div className="actions-right block_action">
          <Button
            onClick={() => {
              navigate.push("/utilisateur/update/" + cell.row.original.id);
            }}
            variant="warning"
            size="sm"
            className="text-warning btn-link edit"
          >
            <i className="fa fa-edit" />
          </Button>
          <Button
            onClick={(event) => {
              changeEtat(cell.row.original.id, cell.row.original.etat);
            }}
            variant="danger"
            size="sm"
            className={
              cell.row.original.etat === 1
                ? "text-success btn-link delete"
                : "text-danger btn-link delete"
            }
          >
            <i
              className={
                cell.row.original.etat === 1 ? "fa fa-check" : "fa fa-times"
              }
            />
          </Button>
        </div>
      ),
    },
    //end
  ]);
  function ajouter() {
    navigate.push("/ajouterUtilisateur");
  }

  const getUser = useCallback(async () => {
    var response = await dispatch(fetchUsers());
    setEntities(response.payload);
  }, [dispatch]);
  function changeEtat(id, e) {
    /* setEntities([]); */
    dispatch(userChangeEtat(id)).then((e1) => {
      getUser();
      switch (e) {
        case 0:
          notify(1, "Activer avec succes");
          break;
        case 1:
          notify(1, "Désactiver avec succes");
          break;
        default:
          break;
      }
    });
  }

  useEffect(() => {
    getUser();
  }, [getUser]);

  function ListTable({ list }) {
    return (
      <MaterialReactTable
        columns={columns}
        data={list}
        enableColumnActions={true}
        enableColumnFilters={true}
        enablePagination={true}
        enableSorting={true}
        enableBottomToolbar={true}
        enableTopToolbar={true}
        muiTableBodyRowProps={{ hover: false }}
      />
    );
  }

  return (
    <>
      <Container fluid>
        <ToastContainer />
        <Row>
          <Col md="8">
            <Button
              id="saveBL"
              className="btn-wd  mr-1 float-left"
              type="button"
              variant="success"
              onClick={ajouter}
            >
              <span className="btn-label">
                <i className="fas fa-plus"></i>
              </span>
              Ajouter un utilisateur
            </Button>
          </Col>
          <Col md="12">
            <h4 className="title">Liste des utilisateurs</h4>
            <Card>
              <Card.Body>
                <ListTable list={entities}></ListTable>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default ListUser;
