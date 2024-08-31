import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { verifCode } from "../../../Redux/sendMailReduce";
import { useParams } from "react-router-dom";
import { changePassword } from "../../../Redux/usersReduce";

// react-bootstrap components
import { Button, Card, Form, Container, Col } from "react-bootstrap";

function ResetPassword() {
  const location = useParams();
  var code = location.code;
  const [password, setPassword] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true); // Variable pour suivre si les mots de passe correspondent

  const settings = useSelector((state) => state.settings.entities);

  if (settings.length > 0) {
    document.title = settings[0].name;
  }
  const dispatch = useDispatch();
  const [cardClasses, setCardClasses] = useState("card-hidden");
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
  const verifCodee = useCallback(async () => {
    dispatch(verifCode({ code })).then((e1) => {
      if (e1.payload.email !== "") {
        setCardClasses("");
        setEmail(e1.payload.email);
      } else {
        window.location.replace("/login");
      }
    });
  }, [dispatch]);
  useEffect(() => {
    verifCodee();
  }, [verifCodee]);
  const handleBlur = (password, confirmPassword) => {
    if (password !== confirmPassword) {
      setPasswordsMatch(false);
      notify(2, "Les mots de passe ne correspondent pas");
    } else {
      setPasswordsMatch(true);
    }
  };

  function submitForm(event) {
    if (password === "" || (confirmPassword === "" && passwordsMatch)) {
      notify(2, "Vérifier vos données");
    } else {
      dispatch(changePassword({ password, email })).then((e1) => {
        if (e1.payload === true) {
          window.location.replace("/login");
        } else {
          notify(2, "Vérifier vos données");
        }
      });
    }
  }
  return (
    <>
      <ToastContainer />
      <div className="full-gray section-image" data-color="black">
        <div className="content d-flex align-items-center p-0">
          <Container>
            <Col className="mx-auto" lg="4" md="8">
              <Form action="" className="form" method="" onSubmit={submitForm}>
                <Card className={"card-login " + cardClasses}>
                  <Card.Header>
                    <h3 className="header text-center">PFE</h3>
                    <br></br>
                  </Card.Header>
                  <Card.Body>
                    <Form.Group className="margin-bottom">
                      <label>Mot de passe </label>
                      <Form.Control
                        placeholder="Mot de passe"
                        type="password"
                        onChange={(value) => {
                          setPassword(value.target.value);
                        }}
                      ></Form.Control>
                    </Form.Group>
                    <Form.Group className="margin-bottom">
                      <label>Confirmer Mot de passe</label>
                      <Form.Control
                        placeholder="Confirmer mot de passe"
                        type="password"
                        onBlur={(value) => {
                          setConfirmPassword(value.target.value);
                          handleBlur(password, value.target.value);
                        }}
                      ></Form.Control>
                    </Form.Group>
                  </Card.Body>
                  <Card.Footer className="ml-auto mr-auto">
                    <br></br>
                    <Button
                      className="btn-wd"
                      type="button"
                      variant="info"
                      onClick={submitForm}
                    >
                      Confirmer
                    </Button>
                  </Card.Footer>
                </Card>
              </Form>
            </Col>
          </Container>
        </div>
      </div>
    </>
  );
}

export default ResetPassword;
