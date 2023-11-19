import { useEffect, useRef, useState } from "react";
import Uob from "../../../Images/UniversityofBaghdad.png";
import UobBanner from "../../../Images/UoB_Tower.jpg";
import defaultProfilePicture from "../../../Images/profilePicutre.jpg";
import classes from "./EditProfile.module.css";
import { useDispatch, useSelector } from "react-redux";
import {profileActions} from "../../../store/profile-slice";
import { auth, db, storage } from "../../../store/fire";
import { deleteObject, getDownloadURL, ref, uploadBytes, uploadBytesResumable } from "firebase/storage";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
const EditProfile=(probs)=>{

    const profile=useSelector(state=>state.profile.profile);
    const imgref=useRef('');
    const wimgRef=useRef('');
    const typeRef=useRef(["",""]);
    const hasuplaod=useRef([false,false]);
    const dispatch=useDispatch();
    const[imagesValid,setImagesValid]=useState({profilePicture:true,bannerPicture:true,profilePictureTouched:false,bannerPictureTouched:false});
    const [profilePicture,setProfilePicture]=useState(probs.profilePicture? probs.profilePicture.length>0?probs.profilePicture:defaultProfilePicture:defaultProfilePicture);
    const [bannerPicture,setBannerPicture]=useState(probs.bannerPicture? probs.bannerPicture.length>0?probs.bannerPicture:"":"");
    const [error,setError]=useState("");
    let isFormValid= (imagesValid.bannerPictureTouched || imagesValid.profilePictureTouched) && ( imagesValid.profilePicture && imagesValid.bannerPicture);
    const imageUploadHandler=(event)=>{
        // let fileNameExt=event.target.files[0].name.slice((event.target.files[0].name.lastIndexOf(".") - 1 >>> 0) + 2);
        let imageSize = event.target.files[0].size / 1024 / 1024;
        let imageType=event.target.id;
        if(imageSize < 5  ){
        if(imageType === "profilePicture"){
            setProfilePicture(URL.createObjectURL(event.target.files[0]));
           imgref.current=event.target.files[0];
           typeRef.current[0]="profilePicture";
           typeRef.current[1]="img"
           console.log(profile.profilePicture);
            setImagesValid((prev)=> {return{...prev,profilePicture:true,profilePictureTouched:true}});
            console.log("pptouch");
    
         
        }
        else{
            setBannerPicture(URL.createObjectURL(event.target.files[0]));
            wimgRef.current=event.target.files[0]
            typeRef.current[0]="bannerPicture";
            typeRef.current[1]="wimg";
            console.log(typeRef.current);
            setImagesValid((prev)=> {return{...prev,bannerPicture:true,bannerPictureTouched:true}});
        }
        }
        else{
            setError("Image size shouldn't exceed 5 MB");
        }
}
useEffect(()=>{
if(profile.profilePicture!==""){
    console.log();
    hasuplaod.current[0]=true;
}
if(profile.bannerPicture!==""){
    hasuplaod.current[1]=true;
}
  },[])
    const sumbitHandler=(e)=>{
        e.preventDefault();
        console.log(imgref.current.name);
        console.log(typeRef.current);
        const name= typeRef.current[1]==="img"?imgref.current:wimgRef.current;
        const storegRef=ref(storage,`${typeRef.current[0]}/${auth.currentUser.uid}/${name.name}`)
        const uploadtask= uploadBytesResumable(storegRef,name);
        if(hasuplaod.current[0]||hasuplaod.current[1]){
            const url=(typeRef.current[0]==="bannerPicture"&&hasuplaod.current[1])?profile.bannerPicture:profile.profilePicture;
            console.log(typeRef.current[0],hasuplaod.current[1]);
            const act=(typeRef.current[0]==="bannerPicture"&& hasuplaod.current[1])||(typeRef.current[0]==="profilePicture"&&hasuplaod.current[0]);
           
            if(act){ 
            console.log(url);
            console.log(act);
            console.log(hasuplaod.current,"up");
        const deleteRef=ref(storage,url);
        console.log(deleteRef);
        deleteObject(deleteRef).then(()=>{
            console.log(deleteRef);
        
        }).catch((e)=>{
             console.log(e);   

        });}

        }
        uploadtask.on('state_changed',(Snapshot)=>{
         console.log(Snapshot.bytesTransferred/Snapshot.totalBytes);
        },(e)=>{
        },()=>{
         getDownloadURL(uploadtask.snapshot.ref).then((res)=>{
             console.log(res);
             if(imagesValid.profilePictureTouched){
                dispatch(profileActions.setProfileValue({type:"profilePicture",value:res}));}
                if(imagesValid.bannerPictureTouched){
                    dispatch(profileActions.setProfileValue({type:"bannerPicture",value:res})); 
                }
        
             setDoc(doc(db,"users",auth.currentUser.uid),{[typeRef.current[0]]:res},{merge:true}).then()
         })
        })
       
        probs.showEdit(false);
    }
    const cancelHandler=()=>{
        probs.showEdit(false);
    }
    return(
        <div className={`${classes.edit}`}>
        <h2>Edit Profile</h2>
        <hr></hr>
        <form onSubmit={sumbitHandler}>
        <div>
            <span>
        <h3>Profile Picture</h3>
        <div>
            <label htmlFor="profilePicture"><p>Edit</p></label>
            <input type="file" placeholder="edit" id="profilePicture" hidden onChange={imageUploadHandler} accept="image/png, image/jpg, image/jpeg"/>
        </div>
        </span>
        <img src={profilePicture} alt="" className={classes.profilePicture}/>
        {  error.length>0 && !imagesValid.profilePicture  && <p className={classes.errorText}>{error}</p>}
        </div>
        <div>
            <span>
        <h3>Banner Picture</h3>
        <label htmlFor="bannerPicture"><p>Edit</p></label>
            <input type="file" placeholder="edit" id="bannerPicture" hidden onChange={imageUploadHandler} accept="image/png, image/gif, image/jpeg"/></span>
        {bannerPicture.length >0 &&<img src={bannerPicture} alt="" className={classes.bannerPicture} />}
        {  error.length>0 && !imagesValid.bannerPicture  && <p className={classes.errorText}>{error}</p>}
        </div>
        <span>
        <button  type="button" onClick={cancelHandler}>Cancel</button>
        <button disabled={!isFormValid} type="submit" >Save</button>
        </span>
        </form>
        </div>
    )
}
export default EditProfile;