import { Box, Card, CardContent, CardHeader, CardMedia, Dialog, IconButton, List, ListItem, ListItemAvatar, ListItemText, ListSubheader, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { get_active_modules, get_professor_modules, get_progs, get_students_count, get_users } from "../../../store/getandset";
import Loader from "../../UI/Loader/Loader";
import { auth } from "../../../store/fire";
import profilePicture from "../../../Images/profilePicutre.jpg"
import { Book, BookRounded, BookmarksRounded, Edit, Subject, SubjectRounded } from "@mui/icons-material";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import EditProfile from "../StudentProfile/EditProfile";
import { useLocation } from "react-router-dom";
function ViewProfessorProfile() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = (queryParams.get('id') || ''); //getting module id from url
    const [profile, setprofile] = useState({});
    const [modules,setModules]=useState([]);
    const [studentCount, setstudentCount] = useState(0);
    const Department_id = profile.Department_id;
    const [loading,setLoading]=useState(true);
    const theme = useTheme();
    const [edit,setEdit]=useState(false);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    useEffect(() => {
        const f = async () => {
          try {
            setLoading(true);
            const p= await get_users([id]);  
            console.log(p[0]);
            setprofile(p[0]);
              const p1 = get_professor_modules(p[0].Department_id,p[0].id);
              const [modules] = await Promise.all([p1]);
              let profM=[];
             modules.map((m)=>profM.push(m.id));
             const stN= await get_students_count(p[0].Department_id,profM);
              setModules(modules);
              setstudentCount(stN);
              console.log(stN);
          } catch (e) {
            console.log(e);
          } finally {
            setLoading(false);
          }
        };
        if (id) {
          f();
        }
      }, [ id]);

      const handleEdit=()=>{
        setEdit((prev)=>!prev);
      }
      if(loading){
        return <Loader/>
      }
    return (
        <>
        <Box sx={{width:"100%",display:"grid",justifyItems:"center",paddingTop:"0.6rem"}}>
    <Box sx={{width:"100%",height:"fit-content",maxWidth:"1200px",display:"flex",flexDirection:"column",borderRadius:"10px",boxShadow:"2"}}>
        <Card sx={{borderRadius:"0",boxShadow:"none",}}>
            <CardHeader    title={profile.name} 
        subheader={`@${profile.username}`}/>
            <CardContent sx={{display:"flex",width:"100%",justifyContent:isSmallScreen?"center":"flex-start",flexDirection:"row",flexWrap:"wrap"}}>
                <CardMedia     sx={{width:isSmallScreen?"100%":"32%",minWidth:"250px",minHeight:"250px",backgroundSize:"contain"}} image={profile.profilePicture ? profile.profilePicture : profilePicture}/>
                <List sx={{width:"32%",minWidth:"150px",}}>
                    <ListItem>
                        <ListItemText primary="Sex" secondary={profile.sex || "-"}/>
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Country" secondary={profile.Country || "-"}/>
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="University" secondary={profile.University_id || "-"}/>
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="College" secondary={profile.College_id || "-"}/>
                    </ListItem>
                </List>
                <List sx={{width:"33%",minWidth:"150px"}}>
                    <ListItem>
                        <ListItemText primary="Department" secondary={profile.Department_id || "-"}/>
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="City" secondary={profile.city || "-"}/>
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Degree" secondary={profile.Degree ||"-"}/>
                    </ListItem>
                </List>
            </CardContent>
        </Card>
        <Box sx={{width:"100%",display:"flex",justifyContent:isSmallScreen?"center":"flex-start",flexDirection:"row",flexWrap:"wrap",gap:"0.8rem",bgcolor:"#fff",padding:"16px"}}>
        <Card sx={{width:"49%",boxShadow:"none",minWidth:"320px",bgcolor:"rgba(0, 0, 0, 0.03)"}}>
            <CardContent>
                <List subheader={<ListSubheader sx={{bgcolor:"inherit"}}>Current semester information</ListSubheader>}>
                <ListItem>
                        <ListItemText primary="Number of Students" secondary={studentCount}/>
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Number of Modules" secondary={modules.length}/>
                    </ListItem>
                </List>
            </CardContent>
        </Card>
        <List subheader={<ListSubheader>Professor Modules</ListSubheader>} sx={{width:"49%",borderRadius:"8px",boxShadow:"none",minWidth:"320px",border:"1px solid rgba(0, 0, 0, 0.1)"}}>
       {modules.length === "0" && <Typography textAlign="center" color="text.secondary"> No modules were found!</Typography>}
        {modules.map((mod)=>(<ListItem key={mod.id}>
                <BookRounded sx={{width:"2.8rem",height:"2.8rem",color:"rgba(0, 0, 0, 0.5)",background:"rgba(0, 0, 0, 0.03)",borderRadius:"50%",padding:"0.4rem",marginRight:"0.5rem"}}/>
            
            <ListItemText primary="Module Name" secondary={mod.name}/>
            </ListItem>))}
        </List>
        </Box>
    </Box>
    </Box> 
    </>);
}

export default ViewProfessorProfile;

