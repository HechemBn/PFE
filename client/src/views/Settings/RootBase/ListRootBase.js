import SweetAlert from "react-bootstrap-sweetalert";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import React,{useEffect,useCallback, useMemo} from "react";
import { fetchRootBase,rootBaseDeleted } from "../../../Redux/rootBaseReduce";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { verification } from "../../../Redux/usersReduce";
import MaterialReactTable from 'material-react-table';
import { toast, ToastContainer } from "react-toastify";

// core components
function ListRootBase() {
  const notify = (type,msg) => {
    if(type === 1)
      toast.success(<strong><i className="fas fa-check-circle"></i>{msg}</strong>);
    else 
      toast.error(<strong><i className="fas fa-exclamation-circle"></i>{msg}</strong>);
  }
  const dispatch = useDispatch();
  const navigate = useHistory();
  const [alert, setAlert] = React.useState(null);
  const [entities, setEntities] = React.useState([]);
  const columns = useMemo(
    () => [
      //column definitions...
      {
        header: "name",
        accessorKey: "name",
      },
      {
        header: "path",
        accessorKey: "path",
      },
      {
        header: "component",
        accessorKey: "component",
      },
      {
        accessorKey: 'id',
        header: 'actions',        
        Cell: ({ cell, row }) => (
          <div className="actions-right block_action">
            {/* {console.log(cell.row.index)} */}
            {/* {console.log(cell.row.original)} */}
            <Button
              onClick={() => {
                navigate.push("/root/update/" + cell.row.original.id);
              }}
              variant="warning"
              size="sm"
              className="text-warning btn-link edit"
            >
              <i className="fa fa-edit" />
            </Button>
            <Button
              id={"idLigne_" + cell.row.original.id}
              onClick={(e) => {
                confirmMessage(cell.row.original.id,e);
              }}
              variant="danger"
              size="sm"
              className="text-danger btn-link delete"
            >
              <i className="fa fa-trash" id={"idLigne_" + cell.row.original.id}/>
            </Button>
          </div>
        ),
      },
      //end
    ],
    [],
  );
  const confirmMessage = (id,e) => {
    setAlert(
      <SweetAlert
        style={{ display: "block", marginTop: "-100px" }}
        title="Vous éte sure de supprime cette root?"
        onConfirm={() => deleteRoot(id,e)}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="info"
        cancelBtnBsStyle="danger"
        confirmBtnText="Oui"
        cancelBtnText="Non"
        showCancel
      >
        Vous éte sure de supprime cette root?
      </SweetAlert>
    );
  };
  const hideAlert = () => {
    setAlert(null);
  };
  function ajouter() {
    navigate.push('/ajouterRoot');
  }
  function deleteRoot(id,e) {
    dispatch(rootBaseDeleted({ id })).then(val=>{
      notify(1 , "Root supprimer avec succes");    
      hideAlert();
      getRoot();
    });
  }
  
  const getRoot = useCallback(async (titre) => {
    var root = await dispatch(fetchRootBase());
    setEntities(root.payload);
  }, [dispatch]);

  //verif token
  const verifToken = useCallback(async () => {
    var response = await dispatch(verification());
    if(response.payload === false){
      localStorage.clear();
      window.location.replace("/login");
    }
  }, [dispatch]);
  useEffect(() => {
    getRoot();
  }, [getRoot])
  return (
    <>
      {alert}
      <Container fluid>
        <ToastContainer />
        <Row>
          <Col md="12">
            <Button
              id="saveBL"
              className="btn-wd btn-outline mr-1 float-left"
              type="button"
              variant="info"
              onClick={ajouter}
            >
              <span className="btn-label">
                <i className="fas fa-plus"></i>
              </span>
              Ajouter une route
            </Button>
          </Col>
          <Col md="12">
            <h4 className="title">Liste des routes</h4>
            <Card>
              <Card.Body>
                <MaterialReactTable
                  columns={columns}
                  data={entities}
                  enableColumnActions={true}
                  enableColumnFilters={true}
                  enablePagination={true}
                  enableSorting={true}
                  enableBottomToolbar={true}
                  enableTopToolbar={true}
                  muiTableBodyRowProps={{ hover: false }}
                /> 
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default ListRootBase;
