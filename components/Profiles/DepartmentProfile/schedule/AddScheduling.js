import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { AddOutlined, Edit } from "@mui/icons-material";
import ReactSelect from "react-select";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../../../store/fire";
import { useSelector } from "react-redux";
import { useQuery } from "react-query";
import { get_active_modules } from "../../../../store/getandset";
export default function AddScheduling(probs) {
  const [open, setOpen] = React.useState(false);
  let {
    initialValues,
    edit,
    classes,
    disabled,
    study,
    selectedDivision,
    selectedLevel,
    selectedProgram,
    selectedSpeciality,
    handlerefetch,
    programs,
    modulesSch,
    activeMod=[]
  } = probs;
  const [selectedModule, setSelectedModule] = React.useState(
    edit ? initialValues["module"] || "" : ""
  ); //editing parameters to ignore just set edit to false
  const [selectedClass, setSelectedClass] = React.useState(
    edit ? initialValues["class"] || "" : ""
  );
  const [selectedType, setSelectedType] = React.useState(
    edit ? initialValues["type"] || "" : ""
  );
  const [selectedStartingTime, setSelectedStartingTime] = React.useState(
    edit
      ? {
          value: initialValues["startingTime"],
          label: initialValues["startingTime"],
        } || ""
      : ""
  );
  const [selectedEndingTime, setSelectedEndingTime] = React.useState(
    edit
      ? {
          value: initialValues["endingTime"],
          label: initialValues["endingTime"],
        } || ""
      : ""
  );
  const profile = useSelector((state) => state.profile.profile);
  const Department_id = profile.Department_id;
  const [selectedDay, setSelectedDay] = React.useState(
    edit
      ?  initialValues["day"] || ""
      : ""
  );
  
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleChange = (event) => {
    console.log(event.target.value, event);
    if (event.target.name === "module") setSelectedModule(event.target.value);
    else if (event.target.name === "class")
      setSelectedClass(event.target.value);
    else if (event.target.name === "type") setSelectedType(event.target.value);
    else if(event.target.name === "day")
setSelectedDay(event.target.value)
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button
        disabled={disabled}
        startIcon={edit ? "" : <AddOutlined />}
        variant={edit ? "contained" : "outlined"}
        sx={
          edit
            ? {
                "&:hover": {
                  bgcolor: "transparent",
                  border: "none",
                  color: "inherit",
                  boxShadow: "none",
                },
                bgcolor: "transparent",
                boxShadow: "none",
                padding: "0",
                minWidth: "fit-content",
                color: "inherit",
                border: "none",
              }
            : {}
        }
        title="Add a Schedule"
        onClick={handleClickOpen}
        
      >
        {edit ? "Edit" : "Add"}
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: async (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const x = formJson;
            let code= selectedModule !== "" ?activeMod.filter((a)=>a.id === selectedModule)[0].name+selectedDay+selectedStartingTime.value+selectedEndingTime.value:"";
            const filteredObject = Object.entries(x).reduce(
              (acc, [key, value]) => {
                if (value !== "") {
                  acc[key] = value;
                }
                return acc;
              },
              {}
            );

            const id = await addDoc(collection(db, "schedulemodule"), {
              ...x[0],
              ...filteredObject,
              Department_id: Department_id,
              study: study,
              speciality: selectedSpeciality,
              division: selectedDivision,
              studyType: study,
              level: selectedLevel,
              program: selectedProgram,
              endingTime: selectedEndingTime.label,
              startingTime: selectedStartingTime.label,
              day:+filteredObject.day,
              code:code
            });
            handlerefetch();

            handleClose();
          },
        }}
        fullWidth={true}
      >
        <DialogTitle>Add a Committe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the committe information below
          </DialogContentText>
          <FormControl
            sx={{ minWidth: "100%", paddingLeft: "0", margin: "8px 0 4px " }}
            size="small"
          >
            <InputLabel
              id="module"
              sx={{ color: "var(--styling1) !important" }}
            >
              Module
            </InputLabel>
            <Select
              name="module"
              label="Module"
              labelId="module"
              onChange={handleChange}
              fullWidth
              value={selectedModule}
              sx={{
                height: "2.5rem",
                color: "var(--styling1)",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "var(--styling1) !important",
                },
                "& .MuiSvgIcon-root": {
                  color: "var(--styling1)",
                },
              }}
            >
              {activeMod.map((mod) => (
                <MenuItem value={mod.id}>{mod.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl
            sx={{ minWidth: "100%", paddingLeft: "0", margin: "8px 0 4px " }}
            size="small"
          >
            <InputLabel id="class" sx={{ color: "var(--styling1) !important" }}>
              Class
            </InputLabel>
            <Select
              name="class"
              label="Class"
              labelId="class"
              onChange={handleChange}
              fullWidth
              value={selectedClass}
              sx={{
                height: "2.5rem",
                color: "var(--styling1)",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "var(--styling1) !important",
                },
                "& .MuiSvgIcon-root": {
                  color: "var(--styling1)",
                },
              }}
            >
              {classes.map((cl) => (
                <MenuItem value={cl.id} key={cl.id}>
                  {cl.name}
                </MenuItem>
              ))}
              <MenuItem value="online">Online</MenuItem>
            </Select>
          </FormControl>
          <FormControl
            sx={{ minWidth: "100%", paddingLeft: "0", margin: "8px 0 4px " }}
            size="small"
          >
            <InputLabel id="type" sx={{ color: "var(--styling1) !important" }}>
              Type
            </InputLabel>
            <Select
              name="type"
              label="Type"
              labelId="type"
              onChange={handleChange}
              fullWidth
              value={selectedType}
              sx={{
                height: "2.5rem",
                color: "var(--styling1)",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "var(--styling1) !important",
                },
                "& .MuiSvgIcon-root": {
                  color: "var(--styling1)",
                },
              }}
            >
              <MenuItem value="Online">Online</MenuItem>
              <MenuItem value="Lab">Lab</MenuItem>
              <MenuItem value="Inside Classroom">Inside Classroom</MenuItem>
            </Select>
          </FormControl>
          <FormControl
            sx={{ minWidth: "100%", paddingLeft: "0", margin: "8px 0 4px " }}
            size="small"
          >
            <InputLabel id="day" sx={{ color: "var(--styling1) !important" }}>
              Day
            </InputLabel>
            <Select
              name="day"
              label="Day"
              labelId="day"
              required
              onChange={handleChange}
              fullWidth
              value={selectedDay}
              sx={{
                height: "2.5rem",
                color: "var(--styling1)",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "var(--styling1) !important",
                },
                "& .MuiSvgIcon-root": {
                  color: "var(--styling1)",
                },
              }}
            >
              <MenuItem value={0}>Sunday</MenuItem>
              <MenuItem value={1}>Monday</MenuItem>
              <MenuItem value={2}>Tuesday</MenuItem>
              <MenuItem value={3}>Wednesday</MenuItem>
              <MenuItem value={4}>Thursday</MenuItem>
              <MenuItem value={5}>Friday</MenuItem>
              <MenuItem value={6}>Saturday</MenuItem>
            </Select>
          </FormControl>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              width: "100%",
            }}
          >
            <ReactSelect
              hideSelectedOptions
              isDisabled={selectedDay === ""}
              value={selectedStartingTime}
              onChange={(e) => {
                setSelectedStartingTime(e);
              }}
              options={
                study === "morning"
                  ? generateTimeArrayInRange(510, 900, 5,modulesSch,selectedDay)
                  : generateTimeArrayInRange(720, 1170, 5,modulesSch,selectedDay)
              }
              placeholder="Starting Time"
            ></ReactSelect>
            <ReactSelect
              hideSelectedOptions
              isDisabled={selectedDay === ""}
              value={selectedEndingTime}
              onChange={(e) => setSelectedEndingTime(e)}
              options={
                study === "morning"
                  ? generateTimeArrayInRange(510, 900, 5,modulesSch,selectedDay)
                  : generateTimeArrayInRange(720, 1170, 5,modulesSch,selectedDay)
              }
              placeholder="Ending Time"
            ></ReactSelect>
          </Box>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">{edit ? "Save" : "Add"}</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

function generateTimeArrayInRange(startValue, endValue, stepSize,modulesSch,selectedDay) {
  console.log(modulesSch);
  let timeArray = [];
  // Using a for loop to generate the array
  for (let value = startValue; value <= endValue; value += stepSize) {
    // Calculating hours and minutes
    const hours = Math.floor(value / 60);
    const minutes = value % 60;

    // Formatting the time as "00:00"
    const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;

    // Adding the formatted time to the array
    timeArray.push({
      label: formattedTime,
      value: hours * 60 + minutes,
      id: formattedTime,
    });
  
  }
  modulesSch.map((mod)=>{
    const [startHours, startMinutes] = mod.startingTime.split(':').map(Number);
 const [endHours,endMinutes]=mod.endingTime.split(':').map(Number);
 let day=mod.day;
 console.log(day,selectedDay);
 if(+selectedDay === +day){
  console.log(mod.startingTime,mod.endingTime);
  console.log((startHours * 60)+startMinutes);
  console.log((endHours * 60)+endMinutes);
  console.log(timeArray);
 timeArray= timeArray.filter((t)=>{
    if(((t.value >= ((startHours * 60)+startMinutes)) && (t.value < (endHours * 60)+endMinutes)  )){
      console.log(t.value);
    }
    return !(t.value >= ((startHours * 60)+startMinutes) && (t.value < (endHours * 60)+endMinutes)  );
  })
 }
  })
  
  return timeArray;
}
