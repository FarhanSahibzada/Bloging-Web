import {
    auth, signOut, onAuthStateChanged, updateEmail, EmailAuthProvider, sendEmailVerification, reauthenticateWithCredential,
    db, collection, query, where, getDocs, doc, getDoc, updateDoc,
    storage, ref, uploadBytes, getDownloadURL,
  } from "./firebase.js";
  
  let out = document.getElementById("logout");
  let showusername = document.getElementById("showuser");
  let dbcollection = collection(db, "users");
  let btnimage = document.getElementById('imageupload');
  let inp = document.querySelectorAll(".inp");
  let nameInput = document.getElementById('name');
  let emailInput = document.getElementById('email');
  let ageInput = document.getElementById('age');
  let genderInput = document.getElementById('gen');
  let phoneInput = document.getElementById('phone');
  let countryInput = document.getElementById('country');
  let cityInput = document.getElementById('city');
  // email changed
  let emailbtn = document.getElementById("emailbtn");
  let currentemail = document.getElementById("oldemail");
  let newemail = document.getElementById("newemail");
  let oldpasswod = document.getElementById("oldpassword");
  let updateemail = document.getElementById("updateemail");
  
  let flag = false;
  // authentication
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      // authentication with username
      const uid = user.uid;
      // Query the Firestore collection to find the document with the matching uid
      const q = query(dbcollection, where("uid", "==", uid));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((docss) => {
        let data = docss.data();
        showusername.innerHTML = data.name + "👋";
  
        // Set initial state of inputs (disabled)
        const inputs = document.querySelectorAll('.inp');
        inputs.forEach(input => input.disabled = true);
  
        // Add event listener to "Edit Profile" button
        document.getElementById('edit').addEventListener('click', function () {
          inputs.forEach(input => input.disabled = false);
        });
  
        emailbtn.addEventListener("click", function () {
          currentemail.value = emailInput.value
        });
  
        updateemail.addEventListener("click", async function () {
          try {
            const credential = EmailAuthProvider.credential(
              currentemail.value,
              oldpasswod.value,
            )
            console.log("success1");
  
            await reauthenticateWithCredential(auth.currentUser, credential);
            console.log("success2");
            await updateEmail(auth.currentUser, newemail.value);
            console.log("success3");
  
            await sendEmailVerification(auth.currentUser);
            alert("email verification is send to your email:", newemail.value)
  
            const userDocRef = doc(db, "users", docss.id);
            const docSnap = await getDoc(userDocRef);
            if (docSnap.exists()) {
              const existingData = docSnap.data();
              const updatedData = {
                ...existingData,
                email: newemail.value,
              }
              await updateDoc(userDocRef, updatedData);
            }
          } catch (error) {
            console.log("error", error);
          }
        });
  
        nameInput.value = data.name || "--";
        emailInput.value = data.email || "--";
        ageInput.value = data.age || "--";
        genderInput.value = data.gender || "--";
        phoneInput.value = data.phone || "--";
        countryInput.value = data.country || "--";
        cityInput.value = data.city || "--";
  
        document.getElementById("save").addEventListener("click", async function () {
          const userDocRef = doc(db, "users", docss.id);
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            const existingData = docSnap.data();
            const updatedData = {
              ...existingData,
              name: nameInput.value || existingData.name,
              age: ageInput.value || existingData.age,
              gender: genderInput.value || existingData.gender,
              phone: phoneInput.value || existingData.phone,
              country: countryInput.value || existingData.country,
              city: cityInput.value || existingData.city
            };
            await updateDoc(userDocRef, updatedData);
            location.reload();
            inputs.forEach(input => input.disabled = true);
  
          } else {
            console.error("Document not found");
          }
  
        });
  
     
        
        // storage image
        if (data.imageUrl) {
          document.getElementById('userImage').src = data.imageUrl;
        }
  
        btnimage.addEventListener("change", function (e) {
          const file = e.target.files[0]; // ya ik array ki tarh hota isliye 0 lagya ha 
          if (file) {
            const storageref = ref(storage, `images/${uid}/${file.name}`) // specific path mil jye ga
            uploadBytes(storageref, file).then((snapshot) => {
              getDownloadURL(snapshot.ref).then(async (downloadURL) => {
                console.log('File available at', downloadURL);
                document.getElementById('userImage').src = downloadURL;
  
                const userDocRef = docss.ref;
                await updateDoc(userDocRef, {
                  imageUrl: downloadURL
                });
              });
            });
          };
        });
      });
  
    } else {
      location.href = "./login.html";
    }
  });
  
  
  
  // signout
  out.addEventListener("click", () => {
    signOut(auth).then(() => {
      console.log("User signed out");
      location.href = "../index.html";
    }).catch((error) => {
      console.error("Sign out error:", error);
    });
  });
  
  let home = document.querySelector(".homeicon");
  
  home.addEventListener("click",function (){
    window.location.href = "../index.html"
  })
  
  
  