require("dotenv").config();


const express = require("express")
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Love = require('./model/Love.js');

app.set("view engine" ,"ejs");
app.set("views" , path.join(__dirname , "views"));
app.use(express.static(path.join(__dirname , "/public"))); 
app.use(express.urlencoded({extended: true})); 
app.use(express.json());
const ejsMate = require("ejs-mate");
app.engine("ejs" , ejsMate); 
const methodOverride = require("method-override");
app.use(methodOverride("_method"));


const dbURl = process.env.ATLASEB_URL;


main()
.then( ()=> {
     console.log("connected to DB");
})
.catch(err => console.log(err));
// const mongoUrl = "mongodb://127.0.0.1:27017/WonderLust";

async function main() {
  await mongoose.connect(dbURl);
}

app.listen(2020 , ()=> {
    console.log("server is Listnening "); 
})


// Routes ........
app.get("/", (req,res)=> {
     res.send("yo u r in Root "); 
})

// app.get("/check", async (req, res) => {
//     try {
//         await Love.insertMany([
//             { boy: "vivian", girl: "seq" },
//             { boy: "marcel", girl: "seq" }
//         ]);
//         console.log("Data was initialized");
//         res.send("Data initialized successfully!");
//     } catch (error) {
//         console.error("Error initializing data:", error);
//         res.status(500).send("Failed to initialize data");
//     }
// });


//Middleware
let isOwner = (req,res,next)=> {
     let code = req.query.code;
     let input = prompt("Code please");
     let err = "YOu are not allowed to access this Page contact Developer please"
     if(code == input){
            next();
     }else{
           res.render("/err.ejs" ,{err} );
     }
}

app.get("/landing" ,(req,res)=> {
     let no = req.query.NO;
     console.log(no);
     res.render("./Love.ejs",{no});
})
app.post("/landing" , async (req, res)=> {
     let {boy , girl} = req.body;
     try {
          await Love.insertOne({boy: boy , girl: girl});
          console.log("Data was initialized");
     } catch (error) {
          console.error("Error initializing data:", error);
          let err = "Try again later Server is Busy / contact Developer"
          return   res.render("/err.ejs" , {err})
     }
     let randomNO = (Math.floor(Math.random()*100)+1)
     res.redirect(`/landing?NO=${randomNO}`);
     
})

app.get("/validate", (req, res)=> {
      res.render("./validate.ejs");
})
app.post("/validate", async (req,res)=> {
      let {code} = req.body;

      if(code == process.env.SECRET){
          let datas = await Love.find({});
           res.render("./data.ejs", {datas});
      }else{
           res.render("./err.ejs" , {err : "You're not supposed to be here."})
      }
})

app.delete("/clear" , async (req, res )=> {
      try {
          await Love.deleteMany({})
          res.redirect("/validate")
      } catch (error) {
          console.log(err);
          res.render("./err.els" , {err : "failed to Delete the Data , Try again Later. "})
      }
})

app.use((req,res)=> {
    res.redirect("/landing");
})