const express = require('express');
const app = express();
const pool =  require("./db");
const ejs = require('ejs');


app.use(express.json()) // => req.body

app.set('views', 'views');
app.set("view engine", "ejs");


//ROUTES//

//get all todos

app.get("/todos", async (req,res) => {
    try{
        const allTodos = await pool.query("SELECT * FROM todo");

        res.json(allTodos.rows);
    }catch(err){
        console.log(err.message);
    }
});

//get todo
app.get("/todos/:id", async(req,res) => {
    const { id} = req.params;
    try {
        const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [id]);

        res.json(todo.rows[0]);
    } catch (err) {
        console.log(err.message);
    }
});
//create todo
app.post("/todos", async (req,res) => {
    try {
        const { description } = req.body;
        const newTodo = await pool.query(
        "INSERT INTO todo (description) VALUES ($1) RETURNING * ", 
        [description]
        );
        // //await
        // console.log(req.body);
        res.json(newTodo.rows[0]);
    }catch(err){
        console.error(err.message)
    }
})
//update todo

app.put("/todos/:id", async (req,res) => {
    try {
        const {id} = req.params; //WHERE
        const {description} = req.body; //SET

        const updateTodo = await pool.query("UPDATE todo SET description = $1 WHERE todo_id = $2", [description, id]);

        res.json("Todo was updated!");
    } catch (err) {
        console.error(err.message);
    }
})
//delete todo

app.delete("/todos/:id", async (req,res) => {
    try {
        const {id} = req.params;
        const deleteTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1", [id]);

        res.json("Todo was successfully deleted!");
    } catch (err) {
        console.error(err.message);
    }
})

app.listen(3000, () => {
    console.log("server listening on port 3000")
})