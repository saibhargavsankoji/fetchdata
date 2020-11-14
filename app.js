const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const mongoose = require("mongoose");
const axios = require("axios");
const {
    response
} = require("express");
const {
    allowedNodeEnvironmentFlags
} = require("process");


const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static('public'));

mongoose.connect("mongodb+srv://saibhargav:Sankoji1997.@fectchdata.j6acy.mongodb.net/fetchedData?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});
const fetchSchema = new mongoose.Schema({
    category: String,
    id: Number,
    skill: String,
    subcategory: String,
    used_by: Object
});
const Fetch = new mongoose.model("report", fetchSchema);


const url = "https://orchestra.maprecruit.com/sampleskillsdata";
const categories = [];
const subcategories = [];
let cat = "All";
let subcat = "All";

axios.get(url)
    .then(response => {
        return response.data;
    })
    .then(data => {
        const loadedData = data.data;
        Fetch.find(function (err, reports) {
            if (reports.length === 0) {
                Fetch.insertMany(loadedData);
            }
            if(err){
                return;
            }
        });
    })

Fetch.find(function (err, reports) {
    if (subcategories.length === 0 && categories.length === 0) {
        reports.forEach(element => {
            if (!categories.includes(element.category)) {
                categories.push(element.category);
            }
            if (!subcategories.includes(element.subcategory)) {
                subcategories.push(element.subcategory);
            }
        });
    }
    if(err){
        return;
    }
})


app.get("/", function (req, res) {


    function renderAll() {
        Fetch.find(function (err, reports) {
            if (err) {
                return;
            } else {
                res.render("index", {
                    report: reports,
                    categoriesArray: categories,
                    subcategoriesArray: subcategories
                })
            }
        });
    }

    function filtered(c, sc) {

        let obj;
        if (c && sc) {
            obj = {
                category: c,
                subcategory: sc
            }
        }
        if (c !== "All" && sc === "All") {
            obj = {
                category: c,
            }
        }
        if (c === "All" && sc !== "All") {
            obj = {
                subcategory: sc
            }
        }
        if (c === "All" && sc === "All") {
            renderAll();
        }

        Fetch.find(obj, function (err, data) {
            res.render("index", {
                report: data,
                categoriesArray: categories,
                subcategoriesArray: subcategories
            })
        });
    }

    if (cat !== "All" || subcat !== "All") {
        filtered(cat, subcat);
    }
    if (cat === "All" && subcat === "All") {
        renderAll();
    }

});

app.post("/", function (req, res) {
    cat = req.body.selectedC;
    subcat = req.body.selectedSC;
    res.redirect("/");
});

app.post("/update", function (req, res) {
    const id = req.body.id;
    const updateC = req.body.selectedC;
    const updateSC = req.body.selectedSC;

    const conditions = {
        id: id
    };
    if (updateC !== "None" && updateSC !== "None") {
        const update = {
            category: req.body.selectedC,
            subcategory: req.body.selectedSC
        }
        Fetch.findOneAndUpdate(conditions, update, () => {

        });
        res.redirect("/");
        return;
    }
    if (updateC !== "None" && updateSC === "None") {
        const update = {
            category: req.body.selectedC
        }
        Fetch.findOneAndUpdate(conditions, update, (err, data) => {

        });
        res.redirect("/");
        return;
    }
    if (updateC === "None" && updateSC !== "None") {
        const update = {
            subcategory: req.body.selectedSC
        }
        Fetch.findOneAndUpdate(conditions, update, (err, data) => {

        });
        res.redirect("/");
        return;
    }
    if (updateSC !== "None" && updateC !== "None") {
        res.redirect("/");
        return;
    }

    // class Updat{
    //     constructor(id, c, sc){
    //         this.id = id;
    //         this.c = c;
    //         this.sc = sc;
    //         this.check(c,sc)
    //     }
    //  check(c, sc) {
    //      if(c !== "None")
    //  }  
    // }
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port);