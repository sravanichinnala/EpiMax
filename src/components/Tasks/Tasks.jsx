import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthTokenContext from "../../context/AuthTokenContext";
import { FaDoorOpen, FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import "./tasks.css";
import emptyToDo from "../emptyTodo.jpg";
function Tasks() {
  let { authToken, setAuthToken } = useContext(AuthTokenContext);
  let state = useLocation().state;
  let username = state === null ? "" : state.username;
  const navigate = useNavigate();
  let [addTaskDisplay, setAddTaskDisplay] = useState(false);
  let [tasksList, setTasksList] = useState([]);
  let [taskManager, setTaskManager] = useState(0);
  let [addEditTaskToggle, setAddEditTaskToggle] = useState("add");
  let [newTaskDetails, setNewTaskDetails] = useState({
    title: "",
    description: "",
    duedate: "",
    status: "pending",
  });
  let [editTaskDetails, setEditTaskDetails] = useState({
    title: "",
    description: "",
    duedate: "",
    status: "",
    username: "",
  });
  const tasksRetrieveFunc = () => {
    try {
      fetch("http://localhost:3001/tasks", {
        method: "GET",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${authToken}`,
        },
      }).then(async (res) => {
        const data = await res.json();
        setTasksList(data);
      });
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    if (authToken === "") {
      navigate("/login-signup");
    } else {
      tasksRetrieveFunc();
    }
  }, [authToken]);

  useEffect(() => {
    if (taskManager !== 0) {
      tasksRetrieveFunc();
    }
  }, [taskManager]);
  // useEffect(() => {
  //   try {
  //     fetch("http://localhost:3001/tasks", {
  //       method: "GET",
  //       headers: {
  //         "content-type": "application/json",
  //         authorization: `Bearer ${authToken}`,
  //       },
  //     }).then(async (res) => {
  //       const data = await res.json();
  //       console.log(data);
  //       setTasksList(data);
  //       console.log(tasksList);
  //     });
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }, []);
  const handleNewTaskDetails = (e) => {
    setNewTaskDetails((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleEditTaskDetails = (e) => {
    setEditTaskDetails((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const deleteTask = (id) => {
    try {
      fetch("http://localhost:3001/delete-task", {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ id: id }),
      }).then((res) => {
        if (res.status !== 200) {
          alert("Something work happend.Please, try again.");
        }
        setTaskManager((prev) => prev + 1);
      });
    } catch (e) {
      alert("Something work happend.Please, try again." + `Error: ${e}`);
    }
  };
  const taskToDiv = ({ id, title, description, duedate, status }) => {
    return (
      <div id="item" key={id}>
        <span style={{ fontSize: "1.25rem", fontWeight: "600", color: "blue" }}>
          {title}
        </span>
        <span
          style={{
            fontSize: "1.05rem",
            textIndent: "1em",
            textAlign: "justify",
          }}
        >
          {description}
        </span>
        <span>
          <span style={{ fontSize: "1.05rem", fontWeight: "bold" }}>
            Due Date:{" "}
          </span>
          {duedate}
        </span>
        <span
          style={
            status.toLowerCase() === "completed"
              ? {
                  textDecoration: "line-through",
                  textDecorationColor: "green",
                  textDecorationThickness: "2px",
                }
              : {}
          }
        >
          <span style={{ fontSize: "1.05rem", fontWeight: "bold" }}>
            Status:{" "}
          </span>
          {status}
        </span>
        <div className="task-edit-delete-btns">
          <button
            onClick={() => {
              const itemDetails = tasksList.find((item) => item.id === id);
              console.log("id", id);
              console.log(itemDetails);
              setAddTaskDisplay((prev) => !prev);
              setEditTaskDetails(itemDetails);
              console.log(editTaskDetails);
              setAddEditTaskToggle("edit");
            }}
          >
            <FaEdit />
          </button>
          <button onClick={() => deleteTask(id)}>
            <FaTrash />
          </button>
        </div>
        <button
          style={{
            marginTop: "5px",
            color: "white",
            border: "none",
            background: "#007cffdb",
            padding: "4px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Mark As Completed
        </button>
      </div>
    );
  };
  const addTask = async () => {
    fetch("http://localhost:3001/add-task", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(newTaskDetails),
    }).then((res) => {
      setTaskManager((prev) => prev + 1);
    });
    setAddTaskDisplay((prev) => !prev);
  };
  const logOut = () => {
    setAuthToken("");
  };
  const editTask = async () => {
    fetch("http://localhost:3001/update-task", {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(editTaskDetails),
    }).then((res) => {
      setTaskManager((prev) => prev + 1);
    });
    setAddTaskDisplay((prev) => !prev);
  };
  const addEditTaskFunc = (mode) => {
    return (
      <div className={addTaskDisplay ? "popupDiv dflex" : "popupDiv"}>
        <div id="addTask">
          <span
            style={{
              display: "flex",
              justifyContent: "center",
              fontSize: "1.35rem",
              color: "blue",
            }}
          >
            {mode === "add" ? "Add Task" : "Edit Task"}
          </span>
          <input
            type="text"
            name="title"
            placeholder="Title Name"
            value={
              mode === "add" ? newTaskDetails.title : editTaskDetails.title
            }
            onChange={
              mode === "add" ? handleNewTaskDetails : handleEditTaskDetails
            }
          />
          <textarea
            rows={4}
            name="description"
            placeholder="Description"
            value={
              mode === "add"
                ? newTaskDetails.description
                : editTaskDetails.description
            }
            onChange={
              mode === "add" ? handleNewTaskDetails : handleEditTaskDetails
            }
          />
          <input
            type="text"
            name="duedate"
            placeholder="DD/MM/YYYY"
            value={
              mode === "add" ? newTaskDetails.duedate : editTaskDetails.duedate
            }
            onChange={
              mode === "add" ? handleNewTaskDetails : handleEditTaskDetails
            }
          />
          <span>
            Status:
            <select
              value={
                mode === "add" ? newTaskDetails.status : editTaskDetails.status
              }
              name="status"
              onChange={
                mode === "add" ? handleNewTaskDetails : handleEditTaskDetails
              }
            >
              <option value="pending">Pending</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </span>
          <span
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              marginTop: "10px",
            }}
          >
            <button
              className="task-btn"
              onClick={() => {
                setAddTaskDisplay((prev) => !prev);
                {
                  mode === "add"
                    ? setNewTaskDetails({
                        title: "",
                        description: "",
                        duedate: "",
                        status: "pending",
                      })
                    : setEditTaskDetails({
                        title: "",
                        description: "",
                        duedate: "",
                        status: "pending",
                        username: "",
                      });
                }
              }}
            >
              Cancel
            </button>
            <button
              className="task-btn"
              onClick={mode === "add" ? addTask : editTask}
            >
              {mode === "add" ? "ADD" : "Edit"}
            </button>
          </span>
        </div>
      </div>
    );
  };
  return (
    <>
      {authToken !== "" ? (
        <div>
          {addEditTaskToggle === "add"
            ? addEditTaskFunc("add")
            : addEditTaskFunc("edit")}
          {/* <div className={addTaskDisplay ? "popupDiv dflex" : "popupDiv"}>
            <div id="addTask">
              <span
                style={{
                  display: "flex",
                  justifyContent: "center",
                  fontSize: "1.35rem",
                  color: "blue",
                }}
              >
                Add Task
              </span>
              <input
                type="text"
                name="title"
                placeholder="Title Name"
                value={newTaskDetails.title}
                onChange={handleNewTaskDetails}
              />
              <textarea
                rows={4}
                name="description"
                placeholder="Description"
                value={newTaskDetails.description}
                onChange={handleNewTaskDetails}
              />
              <input
                type="text"
                name="duedate"
                placeholder="DD/MM/YYYY"
                value={newTaskDetails.duedate}
                onChange={handleNewTaskDetails}
              />
              <span>
                Status:
                <select
                  value={newTaskDetails.status}
                  name="status"
                  onChange={handleNewTaskDetails}
                >
                  <option value="pending">Pending</option>
                  <option value="in progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </span>
              <span
                style={{
                  display: "flex",
                  justifyContent: "space-evenly",
                  marginTop: "10px",
                }}
              >
                <button
                  className="task-btn"
                  onClick={() => {
                    setAddTaskDisplay((prev) => !prev);
                    setNewTaskDetails({
                      title: "",
                      description: "",
                      duedate: "",
                      status: "pending",
                    });
                  }}
                >
                  Cancel
                </button>
                <button className="task-btn" onClick={addTask}>
                  ADD
                </button>
              </span>
            </div>
          </div> */}
          <div id="tasksMain">
            <div id="heading">Task Manager</div>
            <div id="taskOperations">
              <div id="addTaskBtn">
                <button
                  style={{
                    marginTop: "5px",
                    color: "white",
                    border: "none",
                    background: "#007cffdb",
                    padding: "4px",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setAddEditTaskToggle("add");
                    setAddTaskDisplay((prev) => !prev);
                  }}
                >
                  <FaPlus style={{ color: "black" }} /> Add Task
                </button>
              </div>
              <div style={{ fontSize: "1.25rem" }}>
                Hello, <b>{username}</b>
              </div>
              <div id="logoutBtn">
                <button
                  style={{
                    marginTop: "5px",
                    color: "white",
                    border: "none",
                    background: "#007cffdb",
                    padding: "4px",
                    borderRadius: "5px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                  }}
                  onClick={logOut}
                >
                  Logout&nbsp; <FiLogOut style={{ color: "black" }} />
                </button>
              </div>
            </div>
            <hr />
            <div id="taskItems">
              <span>Tasks List</span>
              <div id="items">
                {tasksList.length === 0 ? (
                  <div style={{ marginTop: "50px" }}>
                    <img src={emptyToDo} />
                  </div>
                ) : (
                  tasksList.map((item) => {
                    return taskToDiv(item);
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

export default Tasks;
