import {
  addDoc,
  and,
  arrayRemove,
  arrayUnion,
  collection,
  collectionGroup,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "./fire";
export const getunv = async () => {
  const ref = collection(db, "universities");
  const q = query(ref, where("name", "!=", null));
  const docs = await getDocs(q);
  const data = docs.docs.map((d) => d.data());
  return data;
};
export const setId = async (info) => {
  const { universities_id, Colleges_id, accountType } = info;
  console.log(info, "info");
  console.log(info);
  switch (accountType) {
    case "University": {
      break;
    }
    case "College": {
      const docRef = doc(db, "users", universities_id);
      console.log(auth.currentUser);
      await updateDoc(docRef, {
        Colleges_id: arrayUnion(auth.currentUser.uid),
      });
    }
    case "Student": {
    }
    case "Department": {
    }
    default:
      break;
  }
};
export const deletemoduel = async (id) => {
  const p1 = deleteDoc(doc(db, "subjects", id));
  const p2 = updateDoc(doc(db, "users", auth.currentUser), {
    subjects_id: arrayRemove(id),
  });
  const q = query(collectionGroup(db, "subject"), where("id", "array-contains", id))
  const docs_id = getDocs(q)
  const ids = (await docs_id).docs.map((doc) => ({ id: doc.id }));
  const p3 = ids.forEach(async (id) => {
    await deleteDoc(db, "subjects", id)
  })
  await Promise.all([p1, p2, p3]);
};
export const set_student_subject = async (info, id) => {
  await setDoc(
    doc(db, "users", auth.currentUser, "subjects", id),
    { ...info, subjects_id: id },
    { merge: true }
  );
};

export const get_Sujects = async (Deprartment_id) => {
  const q = query(collection(db, "subjects"), where("Deprartment_id", "==", Deprartment_id))
  const docs = await getDocs(q);
  const data = docs.docs.map((doc) => ({ label: doc.data().name, value: doc.data().name }))
  return data;
}
export const get_modules = async (Deprartment_id) => {
  const q = query(collection(db, "subjects"), where("Deprartment_id", "==", Deprartment_id))
  const docs = await getDocs(q);
  const data = docs.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
  console.log(data);
  return data;
}
export const get_prog = async (levels, Deprartment_id) => {
  const q = query(collection(db, "programs"),
    and(
      where("Deprartment_id", "==", Deprartment_id), where("levels", "==", levels)))
  const docs = await getDocs(q);
  const data = docs.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
  console.log(data);
  return data;
}
export const get_classRooms = async (Deprartment_id) => {
  const userRef = doc(db, "users", Deprartment_id);
  console.log("works");
  const docs = await getDocs(query(collection(userRef, "classRooms")
    , orderBy("namelower", "asc")
  ));
  const data = docs.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
  console.log(data);
  return data;
}
export const setreport = async (reportinfo, Department_id) => {
  console.log(Department_id);
  try{
  const report = await addDoc(collection(db, "reports"), reportinfo)
  const DepartmentRef = doc(db, "notififcation", Department_id);
  console.log("1");
  const notification = await addDoc(collection(DepartmentRef, "Department"), {
    seen: [],
    reportid:report.id,
    name:reportinfo.name,
    Department_id:Department_id,
  })
  console.log("2");
}
catch(e){
  console.log(3);
}
}

