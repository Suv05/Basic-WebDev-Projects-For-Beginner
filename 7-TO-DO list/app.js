const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const Item = require('./itemModel'); // Import the Item model
const List = require('./listmodel');//Importing list model

const app = express();

//body-praser and express init
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

//ejs init
app.set('view engine', 'ejs');

//mongoose init
main().catch(err => console.log(err));

//intialization of items in to database
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/todo-list');

    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled

    const item1 = new Item({ name: 'Silence' });
    const item2 = new Item({ name: 'Dance' });
    const item3 = new Item({ name: 'Fuck' });

    const defaultItem = [item1, item2, item3];
}







//get request to home router...
app.get('/', (req, res) => {

    Item.find()
        .exec().then(foundItems => {
            if (foundItems.length === 0) {
                Item.insertMany(defaultItem)
                    .then(result => {
                        console.log(" Inserted document", result);
                    }).catch(err => {
                        console.error("error", err);
                    });

                res.redirect('/');
            } else {
                res.render('index', { currentday: "Today", newtask: foundItems, actionValue: "/" });
            }

        }).catch(err => {
            console.error('Error finding items:', err);
        });

});

//post request to home router
app.post('/', (req, res) => {

    let itemName = req.body.task;

    const item = new Item({ name: itemName });

    item.save();
    res.redirect('/');

})






//post request to delete task to /delete router
app.post('/delete', (req, res) => {

    let checkedItem = req.body.checkbox;
    async function removeDocument() {
        try {
            await Item.deleteOne({ _id: checkedItem });
            console.log('Document removed successfully');
            res.redirect('/');
        } catch (err) {
            console.error('Error:', err);
            res.redirect('/');
        }
    }

    removeDocument();

})



//post request to work router
let workItems= [];
app.post('/work', (req, res) => {
    let workitem = req.body.task;
    workItems.push(workitem);

    res.redirect('/work');
});



//get request to work router
app.get('/:customListName', (req, res) => {
    const customListName = req.params.customListName;


    const list=new List({
        name:customListName,
        items:defaultItem
    })

    list.save();
})


























app.get('/about', (req, res) => {
    res.render('about');

});




app.listen(3000, () =>
    console.log("port is running in 3000 port")
)