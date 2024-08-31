import React, { useState, useEffect } from "react";
import { loginFetch } from "../../../Redux/usersReduce";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { sendMail } from "../../../Redux/sendMailReduce";
import Configuration from "../../../configuration";
import { Button, Card, Form, Container, Col, Row } from "react-bootstrap";

function LoginPage() {
  const url = Configuration.BACK_BASEURL;

  const notifyErr = (msg) =>
    toast.error(
      <strong>
        <i className="fas fa-exclamation-circle"></i>
        {msg}
      </strong>
    );

  const settings = useSelector((state) => state.settings.entities);

  if (settings.length > 0) {
    document.title = settings[0].name;
  }

  const dispatch = useDispatch();
  const [cardClasses, setCardClasses] = useState("card-hidden");
  const [forgotPassword, setForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    setTimeout(function () {
      setCardClasses("");
    }, 1000);
  }, []);

  function loginChange(event) {
    setLogin(event.target.value);
  }

  function passwordChange(event) {
    setPassword(event.target.value);
  }

  function enterKeyPressed(event) {
    if (event.charCode === 13) {
      submitForm();
      return true;
    } else {
      return false;
    }
  }

  const handleForgotPasswordClick = () => {
    setForgotPassword(true);
  };

  const handleLoginClick = () => {
    setForgotPassword(false);
  };

  const submitForm = (event) => {
    const promise = new Promise((resolve, reject) => {
      setTimeout(async () => {
        var root = await dispatch(
          loginFetch({ login: login, password: password })
        );
        var entities = root.payload;
        resolve(entities);
      }, 0);
    });

    promise.then((value) => {
      if (value.message !== true) {
        notifyErr(value.message);
      } else {
        localStorage.setItem("x-access-token", value.token);
        window.location.replace("/profile");
      }
    });
  };

  return (
    <>
      <ToastContainer />
      <div className="login-page full-gray section-image" data-color="black">
        <Row>
          <Col lg="9">
            <div className="block-log">
              <Row>
                {/* <Col className="mx-auto" lg="5"> */}
                <Col className="mx-auto" lg="5" md="8" sm="10" xs="8">
                  <Form
                    action=""
                    className="form"
                    method=""
                    onSubmit={submitForm}
                  >
                    <Card className={"card-login " + cardClasses}>
                      <Card.Header>
                        <h3 className="header text-center">PFE</h3>
                        <br></br>
                      </Card.Header>
                      <Card.Body>
                        {!forgotPassword ? (
                          <>
                            <Form.Group className="margin-bottom">
                              <label>Login</label>
                              <Form.Control
                                onKeyPress={enterKeyPressed}
                                placeholder="Login"
                                type="text"
                                onChange={loginChange}
                              ></Form.Control>
                            </Form.Group>
                            <Form.Group className="margin-bottom">
                              <label>Mot de passe</label>
                              <Form.Control
                                placeholder="Password"
                                onKeyPress={enterKeyPressed}
                                onChange={passwordChange}
                                type="password"
                              ></Form.Control>
                            </Form.Group>
                          </>
                        ) : (
                          <Form.Group className="margin-bottom">
                            <label>Email</label>
                            <Form.Control
                              placeholder="Email"
                              type="email"
                              onChange={(e) => setEmail(e.target.value)}
                              value={email}
                            ></Form.Control>
                          </Form.Group>
                        )}
                      </Card.Body>
                      <Card.Footer className="ml-auto mr-auto">
                        <br></br>
                        <Button
                          className="btn-wd"
                          type="button"
                          variant="info"
                          onClick={submitForm}
                        >
                          Connexion
                        </Button>

                        <br clear="all"></br>
                        <br clear="all"></br>
                      </Card.Footer>
                    </Card>
                  </Form>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default LoginPage;
