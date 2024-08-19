import {
    auth, signOut, onAuthStateChanged, updateEmail, EmailAuthProvider, sendEmailVerification, reauthenticateWithCredential,
    db, collection, query, where, getDocs, doc, getDoc, updateDoc, deleteDoc,
    storage, ref, uploadBytes, getDownloadURL,
    addDoc,

} from "./firebase.js";

//all vaiiables
let owner = document.getElementById("username");
let showblog = document.getElementById("ul");
let updateimage = document.getElementById("imageupload");

async function getblogs() {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const uid = user.uid;
            let q = query(collection(db, "todo"), where("uid", "==", uid));
            let docref = await getDocs(q);
            showblog.innerHTML = "";
            docref.forEach((snapshot) => {
                let obj = {
                    id: snapshot.id,
                    ...snapshot.data(),
                }
                owner.innerHTML = obj.name;
                let li = document.createElement("li");
                li.classList.add("work");
                li.style.cssText = "display: flex; position:relative;";
                li.innerHTML = `
                <img src="${obj.imageurl}" alt="" width="120px" height="120px" class="img">
                <div style="margin-left: 30px;">
                        <h4>${obj.title}</h4>
                        <span style="font-weight: 600">${obj.name}-</span><span id="date">${obj.date}</span>
                        <p style="margin-top: 30px;">${obj.description}</p>
                                         <div class="bt"> 
                            <button id="del" onclick="del('${obj.id}', this)">Delete</button>
                            <button id="edit" onclick="edit('${obj.id}', this)">Edit</button>
        </div>
                    </div>`;
                showblog.appendChild(li)
            });

        } else {
            window.location.href = "./login.html";
        }

    });
};

updateimage.addEventListener("change", function (e) {
    const image = e.target.files[0];
    if (image) {
        document.getElementById("post").disabled = true;
        let storageref = ref(storage, `blogimages/${image.name}`);
        uploadBytes(storageref, image).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((url) => {
                document.getElementById("blogimage").src = url;
                document.getElementById("post").disabled = false;
            })
        })
    }
});
async function edit(id) {
    try {
        let editt = document.getElementById("edit");
        editt.setAttribute("data-bs-toggle", "modal");
        editt.setAttribute("data-bs-target", "#exampleModal");
        const docRef = doc(db, "todo", id);
        const snapshot = await getDoc(docRef);
        document.getElementById("imageupload").src = snapshot.data().imageurl;
        document.getElementById("post").addEventListener("click", async function () {
            let title = document.getElementById("recipient-name");
            let description = document.getElementById("message-text");
            let obj = {
                id: snapshot.id,
                ...snapshot.data()
            }
             await updateDoc(docRef, {
                 title: title.value || obj.title,
                 description: description.value || obj.description,
                 imageurl: document.getElementById("blogimage").src || obj.imageurl,
             });

             title.value = "";
             description.value = "";
             getblogs();
    });
}
    catch (error) {
    console.log("error", error);
}
}



async function del(id) {
    try {
        await deleteDoc(doc(db, "todo", id));
        getblogs();
    } catch (error) {
        console.log("error", error);
    }
}





window.addEventListener("load", getblogs);
window.edit = edit;
window.del = del;
