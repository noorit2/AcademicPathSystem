import React, { useState, useEffect, useReducer } from "react";
import { auth, creatuser } from "../../../store/fire";
import classes from "./AddDepartment.module.css";
import { getIdToken } from "firebase/auth";
import { useSelector } from "react-redux";

const intilistate = {
  email: "",
  emailtouched: false,
  password: "",
  passwordtouched: false,
  name: "",
  nametouched: false,
};
function reducer(state, action) {
  let newstate = {};
  switch (action.type) {
    case "touch":
      newstate = { ...state, [action.value]: true };
      break;
    case "input":
      newstate = { ...state, [action.input]: action.value };
      break;
    case "reset":
      newstate = {
        name: "",
        nametouched: false,
        email: "",
        emailtouched: false,
        password: "",
        passwordtouched: false,
      };
    default:
  }
  return newstate;
}

const AddDepartment = (probs) => {
  const [state, dispatch] = useReducer(reducer, intilistate);
  const [uploading,setUploading]=useState(false);
  const inputsValid = {
    email: state.email.trim() !== "",
    password: state.password.length > 7,
    name: state.name.trim() !== "",
  };
  const [formIsValid, setFormIsValid] = useState(false);
  const profile=useSelector(state=>state.profile.profile);
  useEffect(() => {
    if (inputsValid.email && inputsValid.password && inputsValid.name) {
      setFormIsValid(true);
    } else {
      setFormIsValid(false);
    }
  }, [inputsValid]);

  const blurHandler = (e) => {
    const action = {
      type: "touch",
      value: e.target.name + "touched",
    };
    dispatch(action);
  };

  function onchange(e) {
    let creationType="";
    if(state.email.includes("@") && state.email.includes(".com")){
      creationType="email";
    }
    else{
      creationType="username";
    }
    console.log(creationType);
    const action = {
      type: "input",
      input: e.target.name,
      value: e.target.value,
    };
    dispatch(action);
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    setUploading(true);
    let creationType="";
    if(state.email.includes("@") && state.email.includes(".com")){
      creationType="emailandpassword";
    }
    else{
      creationType="username";
    }
    try {
      const IdToken = await getIdToken(auth.currentUser);

      const info = {
        email: state.email,
        password: state.password,
        createType: creationType,
        name: state.name,
        accountType: "Department",
        IdToken: IdToken,
        path: { University_id:profile.University_id,College_id:auth.currentUser.uid },
      };
      console.log(info);
      const k = await creatuser(info);
      console.log(k);
      setUploading(false);
    } catch (e) {
      console.log(e);
      setUploading(false);
    }
    const action={
      type:"reset"
    };
    dispatch(action);
    probs.showAddDepartment(false);
  };

  return (
    <div className={`${classes.container} ${probs.className}`}>
      <form action="" className=" form">
        <h3>Add Department</h3>
        <label htmlFor="email">
          Email or Username<span className={classes.star}>*</span>
        </label>
        <input
          type="email"
          placeholder=""
          name="email"
          id="email"
          onChange={onchange}
          onBlur={blurHandler}
          value={state.email}
        />
        {!inputsValid.email && state.emailtouched && (
          <p className={classes.errorText}>Email or username must be valid!</p>
        )}
        <label className="text">
          Password<span className={classes.star}>*</span>
        </label>
        <input
          name="password"
          type="password"
          onChange={onchange}
          onBlur={blurHandler}
          value={state.password}
          placeholder="more than 7 characters.."
        />
        {!inputsValid.password && state.passwordtouched && (
          <p className={classes.errorText}>password must not be empty!</p>
        )}
        <label className="text">
          Name<span className={classes.star}>*</span>
        </label>
        <input
          name="name"
          type="text"
          onChange={onchange}
          onBlur={blurHandler}
          value={state.name}
        />
        {!inputsValid.name && state.nametouched && (
          <p className={classes.errorText}>name must not be empty!</p>
        )}
        <div className={classes.button}>
          {" "}
          <button onClick={submitHandler} disabled={!formIsValid || uploading}>
          {uploading ? "Uploading...":"Add"}
          </button>
        </div>
      </form>
    </div>
  );
};
export default AddDepartment;
