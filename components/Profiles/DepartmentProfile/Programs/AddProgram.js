import React, { useState, useEffect, useReducer, cloneElement } from "react";
import { auth, creatuser, db } from "../../../../store/fire";
import Select from "react-select";
import classes from "./AddProgram.module.css";
import { getIdToken } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { get_Sujects, get_prof } from "../../../../store/getandset";
import { displayMessage } from "../../../../store/message-slice";
let modul = [
  { value: "physics", label: "Physics" },
  { value: "mathII", label: "MathII" },
  { value: "humanrights", label: "Human Rights" },
];

const intilistate = {
  name: "",
  nametouched: false,
  outcome: "",
  outcometouched: false,
  eveningStudy: false,
  code: "",
  codetouched: false,
  specialty: false,
  specialtyYear: 0,
  specialtyYeartouched: false,
  programsNeeded: 0,
  programsNeededtouched: false,
  summerInternship: false,
  summerInternshipYear: 0,
  programManager: "",
  programMangertouched: false,
  programCordinator: "",
  programCordinatortouched: false,
  eveningStudy:false,
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
        outcome: "",
        outcometouched: false,
        eveningStudy: false,
        code: "",
        codetouched: false,
        specialty: false,
        specialtyYear: 0,
        specialtyYeartouched: false,
        programsNeeded: 0,
        programsNeededtouched: false,
        summerInternship: 0,
        summerInternshipYear: 0,
        summerInternshipYeartouched: false,
        programManager: "",
        programManagertouched: false,
        programCordinator: "",
        programCordinatortouched: false,
        eveningStudy:0,
      };
    default:
  }
  return newstate;
}

const AddProgram = (probs) => {
  const [modules, setModules] = useState(modul);
  const [professors, setProfessors] = useState([]);
  const [state, dispatch] = useReducer(reducer, intilistate);
  const [uploading, setUploading] = useState(false);
  const inputsValid = {
    outcome: state.outcome.trim() !== "",
    name: state.name.trim() !== "",
    specialtyYear: state.specialtyYear > 0,
    code: state.code.trim() !== "",
    programsNeeded: state.programsNeeded > 0,
    summerInternshipYear: state.summerInternshipYear > 0,
    programManager: state.programManager.trim() !== "",
    programCordinator: state.programCordinator.trim() !== "",
  };
  const [formIsValid, setFormIsValid] = useState(false);
  const profile = useSelector((state) => state.profile.profile);
  const Department_id = profile.Department_id;
  const professorsoid=profile.professors || [];
  const dispatchRedux=useDispatch();
  useEffect(() => {
    if (
      inputsValid.outcome &&
      inputsValid.name &&
      (state.specialty ? inputsValid.specialtyYear : true) &&
      (state.specialty ? inputsValid.programsNeeded : true) &&
      (state.summerInternship ? inputsValid.summerInternshipYear : true) &&
      inputsValid.programCordinator &&
      inputsValid.programManager
    ) {
      setFormIsValid(true);
    } else {
      setFormIsValid(false);
    }
    console.log(formIsValid);
  }, [inputsValid]);
  useEffect(() => {
    if (!auth.currentUser) return;
    console.log("NNNN");
    const f = async () => {
      const a = await get_Sujects(Department_id);
      setModules(a);
      console.log(a, "a");
    };
    f();
  }, [auth.currentUser]);
  useEffect( ()=>{
    const fetch=async()=>{
      try{
      const p= await get_prof(professorsoid);
      setProfessors(p);
      }
      catch(e){
        console.log(e);
        dispatchRedux(displayMessage("Loading Failed","error"));
      }
    }
    if(Department_id)
    fetch();
  },[Department_id,profile])
  const blurHandler = (e) => {
    const action = {
      type: "touch",
      value: e.target.name + "touched",
    };
    console.log(action);
    dispatch(action);
  };

  function onchange(e) {
    const action = {
      type: "input",
      input: e.target.name,
      value: e.target.value,
    };
   
    console.log(action);
    dispatch(action);
  }
  const submitHandler = async (e) => {
    e.preventDefault();
    setUploading(true);
    // course is variable indicating course number with values 1 or 2
    try {
      const info = {
        name: state.name,
        outcome: state.outcome,
        code: state.code,
        specialtyYear: state.specialtyYear,
        programsNeeded: state.programsNeeded,
        summerInternship: +state.summerInternship === 1,
        summerInternshipYear: state.summerInternshipYear,
        programManager: state.programManager,
        programCordinator: state.programCordinator,
        Deprartment_id: Department_id,
        University_id: profile.University_id,
        College_id: profile.College_id,
        specialty: +state.specialty === 1,
        eveningStudy: +state.eveningStudy === 1,
        activated:true,
        type:(probs.ECTS == 240 ? 4:probs.ECTS == 300 ? 5: 6)
      };
      const id=await addDoc(collection(db,"programs"),info);
       updateDoc(doc(db,"users",auth.currentUser.uid),
        {programs : arrayUnion(id.id) }
      )
      console.log();
      setUploading(false);
    } catch (e) {
      setUploading(false);
      console.log(e);
    }

    const action = {
      type: "reset",
    };
    dispatch(action);
  };


  return (
    <div className={`${classes.container}`}>
      <button onClick={() => probs.showAddProgram(false)}>X</button>
      <form action="" className=" form">
        <h3>Program Setup</h3>
        <div className={classes.fields}>
          <span>
            <label htmlFor="email">
              Program Name<span className={classes.star}>*</span>
            </label>
            <input
              type="text"
              placeholder=""
              name="name"
              id="name"
              onChange={onchange}
              onBlur={blurHandler}
              value={state.name}
            />
            {!inputsValid.name && state.nametouched && (
              <p className={classes.errorText}>Program Name must be valid!</p>
            )}
          </span>
          <span>
            <label className="text">
              Outcome<span className={classes.star}>*</span>
            </label>
            <input
              name="outcome"
              type=""
              onChange={onchange}
              onBlur={blurHandler}
              value={state.describtion}
            />
            {!inputsValid.outcome && state.outcometouched && (
              <p className={classes.errorText}>
                describtion must not be empty!
              </p>
            )}
          </span>
          <span>
            <label className="text">
              Program Code<span className={classes.star}>*</span>
            </label>
            <input
              name="code"
              type=""
              onChange={onchange}
              onBlur={blurHandler}
              value={state.code}
            />
            {!inputsValid.code && state.codetouched && (
              <p className={classes.errorText}>Code must not be empty!</p>
            )}
          </span>
          <span>
            <label className="text">
              Is there a specialty<span className={classes.star}>*</span>
            </label>
            <select
              name="specialty"
              type=""
              onChange={onchange}
              onBlur={blurHandler}
              value={state.specialty}
            >
              <option value={0}>doesn't exist</option>
              <option value={1}>exist</option>
            </select>
          </span>

          <span>
            <label className="text">
              Specialty Year<span className={classes.star}>*</span>
            </label>
            <input
              name="specialtyYear"
              type="number"
              onChange={onchange}
              onBlur={blurHandler}
              value={state.specialtyYear}
            />
            {!inputsValid.specialtyYear && state.specialtyYeartouched && (
              <p className={classes.errorText}>
                Specialty Year must be bigger than zero!
              </p>
            )}
          </span>
          <span>
            <label className="text">
              number of modules needed for speciality
              <span className={classes.star}>*</span>
            </label>
            <input
              name="programsNeeded"
              type="number"
              onChange={onchange}
              onBlur={blurHandler}
              value={state.programsNeeded}
            />
            {!inputsValid.programsNeeded && state.programsNeededtouched && (
              <p className={classes.errorText}>
                number must be bigger than zero!
              </p>
            )}
          </span>
          <span>
            <label className="text">
              Is Summer Internship needed<span className={classes.star}>*</span>
            </label>
            <select
              name="summerInternship"
              type=""
              onChange={onchange}
              onBlur={blurHandler}
              value={state.summerInternship}
            >
              <option value={0}>not needed</option>
              <option value={1}>needed</option>
            </select>
          </span>
          <span>
            <label className="text">
              Is there an evening study<span className={classes.star}>*</span>
            </label>
            <select
              name="eveningStudy"
              type=""
              onChange={onchange}
              onBlur={blurHandler}
              value={state.eveningStudy}
            >
              <option value={0}>doesn't exists</option>
              <option value={1}>exists</option>
            </select>
          </span>
          <span>
            <label className="text">
              Summer Internship Year<span className={classes.star}>*</span>
            </label>
            <input
              name="summerInternshipYear"
              type="number"
              onChange={onchange}
              onBlur={blurHandler}
              value={state.summerInternshipYear}
            />
            {!inputsValid.summerInternshipYear &&
              state.summerInternshipYeartouched && (
                <p className={classes.errorText}>
                  number must be bigger than zero!
                </p>
              )}
          </span>
          <span>
            <label className="text">
              Program Manager
              <span className={classes.star}>*</span>
            </label>
            <select
              name="programManager"
              type=""
              onChange={onchange}
              value={state.programManager}
            >
              <option value={""} disabled hidden>
                select...
              </option>
              {professors.map((p) => {
                return <option value={p.id}>{p.username}</option>;
              })}
            </select>
          </span>
          <span>
            <label className="text">
              Program Cordinator
              <span className={classes.star}>*</span>
            </label>
            <select
              name="programCordinator"
              type=""
              onChange={onchange}
              value={state.programCordinator}
            >
              <option value={""} disabled hidden>
                select...
              </option>
              {professors.map((p) => {
                return <option value={p.id}>{p.username}</option>;
              })}
            </select>
          </span>
          <div className={classes.button}>
            {" "}
            <button
              onClick={submitHandler}
              disabled={!formIsValid || uploading}
            >
              {uploading ? "Uploading" : "Add"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
export default AddProgram;
