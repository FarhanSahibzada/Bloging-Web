import {
    auth, signOut, onAuthStateChanged, updateEmail, EmailAuthProvider, sendEmailVerification, reauthenticateWithCredential,
    db, collection, query, where, getDocs, doc, getDoc, updateDoc, deleteDoc,
    storage, ref, uploadBytes, getDownloadURL,
    addDoc,

} from "./files/firebase.js";


// animations
let heading = document.getElementById("heading");
let alpha = 0;
let str1 = "Publish Your Ideas, Your Way ";
str1 = str1.split("");
let reverse = false;

function alphabet() {
    heading.innerHTML = str1.slice(0, alpha).join('');
    if (!reverse) {
        alpha++;
        if (alpha > str1.length) {
            reverse = true; // Switch to reverse mode
            setTimeout(alphabet, 400);
        } else {
            setTimeout(alphabet, 400);
        }
    } else {
        alpha--;
        if (alpha < 0) {
            reverse = false; // Switch back to forward mode
            heading.innerHTML = ""; // Clear the heading
            alpha = 0;
            setTimeout(alphabet, 400);
        } else {
            setTimeout(alphabet, 400);
        }
    }
}

alphabet(); // Start the typing effect

let imagediv = document.querySelectorAll(".image-div1");
let num = 0;
let back = document.getElementById("blogs");
let arr = [" #FF7F50", "#ffb42b", "#fb6cb2"];

//animation function
setInterval(animateimages, 2000);
function animateimages() {
    // Pehle sab images ko reset kar dete hainy
    imagediv.forEach((div) => {
        div.classList.remove("new")
        div.classList.remove("end")
    });
    imagediv[num].classList.add("new");
    back.style.background = arr[num];
    setTimeout(() => {
        imagediv[num].classList.add("end");
        num++;
        if (num >= imagediv.length) {
            num = 0; // Reset to first image
        }
    }, 1000);
}

// all vaiablles
let slbtn = document.querySelector(".btns");
let profile = document.querySelector(".image-container");
let createblog = document.getElementById("btn1");
let viewprofile = document.getElementById("profile");
let sbtn = document.getElementById("sign");
let lbtn = document.getElementById("log");
let post = document.getElementById("post");
let showblog = document.getElementById("ul");
let myblog = document.getElementById("my-blog");
let btnimage = document.getElementById("imageupload");


// functions
createblog.addEventListener("click", function () {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            createblog.setAttribute("data-bs-toggle", "modal");
            createblog.setAttribute("data-bs-target", "#exampleModal");
        } else {
            window.location.href = "./files/login.html";
        }
    });
});

btnimage.addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (file) {
        post.disabled = true;
        let storageref = ref(storage, `blogimages/${file.name}`);
        uploadBytes(storageref, file).then((snapshot) => {
            return getDownloadURL(snapshot.ref);
        }).then((url) => {
            document.getElementById("blogimage").src = url;
            post.disabled = false;
        }).catch((error) => {
            console.error("Error uploading image: ", error);
            post.disabled = false; 
        });
    }
});


post.addEventListener("click", async function () {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const uid = user.uid;
            let title = document.getElementById('recipient-name');
            let description = document.getElementById('message-text');
            let q = query(collection(db, "users"), where("uid", "==", user.uid));
            let docref = await getDocs(q);
            let promises = [];
            let date = new Date().toLocaleDateString();
            
            docref.forEach((doccs) => {
                const userDocRef = doc(db, "users", doccs.id);
                promises.push(getDoc(userDocRef).then(docSnap => {
                    return addDoc(collection(db, "todo"), {
                        title: title.value,
                        description: description.value,
                        name: docSnap.data().name,
                        date : date,
                        uid: uid,
                        imageurl: document.getElementById("blogimage").src,
                    });
                }));
            });
            await Promise.all(promises);

            title.value = "";
            description.value = "";
            getwork();
        }
    });
});



// get blog

async function getwork() {
    try {
        // Clear previous content
        showblog.innerHTML = "";

        // Query to get todo items
        let qu = await getDocs(collection(db, "todo"));
        qu.forEach((d) => {
            let obj = {
                id: d.id,
                ...d.data()
            };
            let li = document.createElement('li');
            li.className = "work";
            li.style.cssText = "display: flex; position:relative;";

            li.innerHTML = `
            <img src="${obj.imageurl}" alt="" width="120px" height="120px" class="img">
            <div style="margin-left: 30px;">
                    <h4>${obj.title}</h4>
                    <span style="font-weight: 600">${obj.name}-</span><span id="date">${obj.date}</span>
                    <p style="margin-top: 30px;">${obj.description}</p>
                </div>`;
            showblog.appendChild(li);
        });

        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const uid = user.uid;
                let q = query(collection(db, "users"), where("uid", "==", uid));
                let snapshot = await getDocs(q);

                snapshot.forEach((docs) => {
                    if (docs.exists()) {
                        profile.style.display = "block";
                        slbtn.style.display = "none";
                        if (docs.data().imageurl) {
                            document.getElementById("userImage").src = docs.data().imageurl;
                        }
                    } else {
                        profile.style.display = "none";
                    }
                });
            }
        });
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}







viewprofile.addEventListener("click", function () {
    window.location.href = "./files/home.html"
})
sbtn.addEventListener("click", function () {
    window.location.href = "./files/register.html"
});
lbtn.addEventListener("click", function () {
    window.location.href = "./files/login.html"
});
myblog.addEventListener("click", function () {
    window.location.href = "./files/myblog.html"
});

window.addEventListener("load", getwork);
