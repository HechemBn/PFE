import React, { useEffect,useCallback  } from "react";
import Select from "react-select";
import validator from "validator";
import { verification } from "../../../Redux/usersReduce";

// react-bootstrap components
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import { useParams, useHistory } from "react-router-dom";
import {
  rootBaseAdded,
  fetchRootBase,
  rootGetById,
} from "../../../Redux/rootBaseReduce";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";

function AjouterRootBase(props) {
  const dispatch = useDispatch();
  const location = useParams();
  const navigate = useHistory();
  //input
  const [name, setName] = React.useState("");
  const [className, setClassName] = React.useState("");
  const [role, setRole] = React.useState("");
  const [ordre, setOrdre] = React.useState(0);
  const [path, setPath] = React.useState("");
  const [component, setComponent] = React.useState("");
  const [icon, setIcon] = React.useState("");
  const [parent, setParent] = React.useState("");
  const [id, setId] = React.useState(0);
  //required
  const [nameRequired, setNameRequired] = React.useState(true);
  const [roleRequired, setRoleRequired] = React.useState(true);
  const [ordreRequired, setOrdreRequired] = React.useState(true);
  const [componentRequired, setComponentRequired] = React.useState(true);
  const [iconRequired, setIconRequired] = React.useState(true);
  const [pathRequired, setPathRequired] = React.useState(true);

  const [options, setOptions] = React.useState([
    {
      value: "",
      label: "Parent",
      isDisabled: true,
    },
  ]);
  const [parentSelect, setParentSelect] = React.useState({
    value: 0,
    label: "Parent",
  });
  const notify = (type,msg) => {
    if(type === 1)
      toast.success(<strong><i className="fas fa-check-circle"></i>{msg}</strong>);
    else 
      toast.error(<strong><i className="fas fa-exclamation-circle"></i>{msg}</strong>);
  }
  function submitForm() {
    if (validator.isEmpty(name)) {
      notify(2, "Name est obligatoire");
      setNameRequired(false);
    } else {
      setNameRequired(true);
    }

    if (validator.isEmpty(path)) {
      notify(2, "Path est obligatoire");
      setPathRequired(false);
    } else {
      setPathRequired(true);
    }

    if (validator.isEmpty(icon)) {
      notify(2, "Icon est obligatoire");
      setIconRequired(false);
    } else {
      setIconRequired(true);
    }

    if (validator.isEmpty(component)) {
      notify(2, "Component est obligatoire");
      setComponentRequired(false);
    } else {
      setComponentRequired(true);
    }

    if (validator.isEmpty(role)) {
      notify(2, "Role est obligatoire");
      setRoleRequired(false);
    } else {
      setRoleRequired(true);
    }

    if (parseInt(ordre) === 0) {
      notify(2, "Ordre est obligatoire");
      setOrdreRequired(false);
    } else {
      setOrdreRequired(true);
    }
    console.log(name, className, component, icon, path, parent, id,role,ordre)
    if (
      !validator.isEmpty(name) &&
      !validator.isEmpty(icon) &&
      !validator.isEmpty(path) &&
      !validator.isEmpty(role) &&
      parseInt(ordre) !== 0
    ) {
      dispatch(
        rootBaseAdded({ name, className, component, icon, path, parent, id,role,ordre })
      );
      if(isNaN(location.id) === true) 
        notify(1, "Insertion avec succes")
      else
        notify(1, "Modifier avec succes");
    }
  }


  //verif token
  const verifToken = useCallback(async () => {
    var response = await dispatch(verification());
    if(response.payload === false){
      localStorage.clear();
      window.location.replace("/login");
    }
  }, [dispatch]);

  useEffect(() => {
    async function getRoot(p) {
      var root = await dispatch(fetchRootBase());
      var entities = root.payload;
      var arrayOption = [];
      arrayOption.push({ value: 0, label: "Parent" });
      entities.forEach((e) => {
        arrayOption.push({ value: e.id, label: e.name });
        if (e.id === p) {
          setParentSelect({ value: e.id, label: e.name });
          setParent(e.id);
        }
      });
      setOptions(arrayOption);
    }
    const promise = new Promise((resolve, reject) => {
      setTimeout(async () => {
        if (isNaN(location.id) === false) {
          var root = await dispatch(rootGetById(location.id));
          var entities = root.payload;
          setName(entities.name);
          setParent(entities.parent);
          setPath(entities.path);
          setIcon(entities.icon);
          setComponent(entities.component);
          setClassName(entities.className);
          setOrdre(entities.ordre);
          setRole(entities.role);
          setId(location.id);
          resolve(entities.parent);
        } else {
          resolve(0);
        }
      }, 300);
    });

    promise.then((value) => {
      getRoot(value);
    });
  }, [location.id,dispatch]);

  function listeRoute() {
    navigate.push('/listRootBase');
  }
  return (
    <>
      <Container fluid>
        <ToastContainer />
        <div className="section-image">
          <Container>
            <Row>
              <Col md="12">
                <Button
                  id="saveBL"
                  className="btn-wd btn-outline mr-1 float-left"
                  type="button"
                  variant="info"
                  onClick={listeRoute}
                >
                  <span className="btn-label">
                    <i className="fas fa-list"></i>
                  </span>
                  Retour à la liste
                </Button>
              </Col>
            </Row>
            <Row>
              <Col md="12">
                <Form action="" className="form" method="">
                  <Card>
                    <Card.Header>
                      <Card.Header>
                        <Card.Title as="h4">
                          {typeof location.id == "undefined"
                            ? "Ajouter Route"
                            : "Modifier Route"}
                        </Card.Title>
                      </Card.Header>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col className="pr-1" md="6">
                          <Form.Group
                            className={
                              nameRequired ? "has-success" : "has-error"
                            }
                          >
                            <label>Name* </label>
                            <Form.Control
                              defaultValue={name}
                              placeholder="Nom"
                              type="text"
                              onChange={(value) => {
                                setName(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                          {nameRequired ? null : (
                            <label className="error">
                              Nom est obligatoire.
                            </label>
                          )}
                        </Col>
                        <Col className="pl-1" md="6">
                          <Form.Group>
                            <label>class </label>
                            <Form.Control
                              defaultValue={className}
                              placeholder="class"
                              type="text"
                              onChange={(value) => {
                                setClassName(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col className="pr-1" md="6">
                          <Form.Group
                            className={
                              pathRequired ? "has-success" : "has-error"
                            }
                          >
                            <label>Path* </label>
                            <Form.Control
                              defaultValue={path}
                              placeholder="Path"
                              type="text"
                              onChange={(value) => {
                                setPath(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                          {pathRequired ? null : (
                            <label className="error">
                              Path est obligatoire.
                            </label>
                          )}
                        </Col>

                        <Col className="pl-1" md="6">
                          <Form.Group
                            className={
                              componentRequired ? "has-success" : "has-error"
                            }
                          >
                            <label>Component* </label>
                            <Form.Control
                              defaultValue={component}
                              placeholder="Component"
                              type="text"
                              onChange={(value) => {
                                setComponent(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                          {componentRequired ? null : (
                            <label className="error">
                              Component est obligatoire.
                            </label>
                          )}
                        </Col>
                      </Row>

                      <Row>
                        <Col className="pr-1" md="6">
                          <Form.Group
                            className={
                              iconRequired ? "has-success" : "has-error"
                            }
                          >
                            <label>Icon* </label>
                            <Form.Control
                              defaultValue={icon}
                              placeholder="Icon"
                              type="text"
                              onChange={(value) => {
                                setIcon(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                          {iconRequired ? null : (
                            <label className="error">
                              Icon est obligatoire.
                            </label>
                          )}
                        </Col>

                        <Col className="pl-1" md="6">
                          <Form.Group>
                            <label>Parent </label>
                            <Select
                              className="react-select primary"
                              classNamePrefix="react-select"
                              value={parentSelect}
                              onChange={(value) => {
                                setParentSelect(value);
                                setParent(value.value);
                              }}
                              options={options}
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col className="pr-1" md="6">
                          <Form.Group
                            className={
                              roleRequired ? "has-success" : "has-error"
                            }
                          >
                            <label>Role* </label>
                            <Form.Control
                              defaultValue={role}
                              placeholder="Role"
                              type="text"
                              onChange={(value) => {
                                setRole(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                          {roleRequired ? null : (
                            <label className="error">
                              Role est obligatoire.
                            </label>
                          )}
                        </Col>

                        <Col className="pl-1" md="6">
                          <Form.Group
                            className={
                              ordreRequired ? "has-success" : "has-error"
                            }
                          >
                            <label>Ordre </label>
                            <Form.Control
                              value={ordre}
                              placeholder="Component"
                              type="number"
                              onChange={(value) => {
                                setOrdre(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                          {ordreRequired ? null : (
                            <label className="error">
                              Ordre est obligatoire.
                            </label>
                          )}
                        </Col>
                      </Row>

                      <Button
                        className="btn-fill pull-right"
                        type="button"
                        variant="info"
                        onClick={submitForm}
                      >
                        Enregistrer
                      </Button>
                      <div className="clearfix"></div>
                    </Card.Body>
                  </Card>
                </Form>
              </Col>
            </Row>
          </Container>
        </div>
      </Container>
    </>
  );
}

export default AjouterRootBase;
