import { createSlice } from "@reduxjs/toolkit";
import { auth } from "./fire";
const init={}
const profileSlice=createSlice({
    name:"profile",
    initialState:{profile:init,loaded:false},
    reducers:{
        setProfile(state,action){
            console.log("entereed");
            state.profile=action.payload;
            state.loaded=true;
            console.log(state.profile);
        },
        setProfileValue(state,action){
            const type=action.payload.type;
            const prevProfile=state.profile;
            state.profile={...prevProfile,[type]:action.payload.value}
            console.log(state.profile);

        },
        stopLoading(state){
            state.loaded=true;
        }
        ,
        addOnProfileValue(state,action){
            const prevProfile=state.profile;
            console.log(state.profile);
            console.log(state.profile.Colleges_id)
            const n=[...state.profile.Colleges_id,action.payload.value];
            console.log(n);
            state.profile={...prevProfile,Colleges_id:n}
        },
        addOnProfileProfessors(state,action){
            const prevProfile=state.profile;
            const n=[...state.profile.professors,action.payload.value];
            console.log(n);
            state.profile={...prevProfile,professors:n}
        }
        ,
        logOut(state){
            state.profile=init;
            console.log(state.profile);
            state.loaded=false;
        }
    }
});
export default profileSlice;
export const profileActions=profileSlice.actions;