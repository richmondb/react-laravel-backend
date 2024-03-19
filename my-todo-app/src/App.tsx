import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import React, {useEffect, useState} from 'react';
import TodoItem from "./components/TodoItem.tsx";
import emptyLogo from "./assets/empty-list.svg"
import ConfirmModal from "./components/ConfirmModal.tsx";
import axios from "axios";
import {TodoAPI} from "./interface/TodoAPI.ts";

function App() {
    const [todos, setTodos] = useState<TodoAPI[]>([]);
    const [loading, setLoading] = useState(true);
    const [todoTitle, setTodoTitle] = useState('');
    const [todoBody, setTodoBody] = useState('');
    const [isEditing, setEditing] = useState(false);
    const [editingIndex, setEditingIndex] = useState(0);

    /**
     * Function to add a new todo item.
     *
     * @return {void} no return value
     * @param event
     */

    /**
     * Handles form submission for creating a new todo.
     *
     * - Prevents empty submissions by checking if `todoTitle` is trimmed.
     * - Makes a POST request using Axios to `http://127.0.0.1:8000/api/v1/todos` with the following data:
     *   - `title`: The value of the `todoTitle` state.
     *   - `text`: The value of the `todoBody` state (optional).
     *   - `completed`: Set to `false` by default.
     * - On success:
     *   - Logs the ID of the newly created todo to the console.
     *   - Updates the `todos` state by appending a new todo object with the following properties:
     *     - `id`: The ID retrieved from the response (`res.data.todo.id`).
     *     - `title`: The value of the `todoTitle` state.
     *     - `text`: The value of the `todoBody` state (optional).
     *     - `completed`: Set to `false`.
     *     - `created_at`: The created timestamp from the response (optional, depending on API).
     *     - `updated_at`: The updated timestamp from the response (optional, depending on API).
     * - On error:
     *   - Logs the error to the console.
     * - Finally (always executed):
     *   - Resets the form input values by setting `todoTitle` and `todoBody` states to empty strings.
     *
     * @param {React.FormEvent<HTMLFormElement>} event The form submission event object.
     * @return {Promise<void>}
     */
    const handleFormSubmit = async (event: React.FormEvent): Promise<void> => {
        event.preventDefault();
        if (!todoTitle.trim()) {
            return; // Avoid empty submissions
        }
        try {
            const res = await axios.post('http://127.0.0.1:8000/api/v1/todos',
                {
                    title: todoTitle,
                    text: todoBody,
                    completed: false
                });
            if (res) {
                console.log(res.data.todo.id)
                setTodos(prevTodos => [...prevTodos, {
                    id: res.data.todo.id,
                    title: todoTitle, text: res.data.todo.text, completed: res.data.todo.completed,
                    created_at: res.data.todo.created_at, updated_at: res.data.todo.updated_at
                }]);
            }
        } catch (e) {
            console.log(e)
        } finally {
            // Reset the form input contents
            setTodoTitle('');
            setTodoBody('');
        }

    };


    /**
     * Removes a todo item at the specified index.
     *
     * @param {number} index - The index of the todo item to be removed
     * @return {void}
     */
    const removeTodo: (index: number) => void = (index: number): void => {
        setTodos(prevTodos => {
            const newTodos = [...prevTodos];
            newTodos.splice(index, 1);
            return newTodos;
        });
    };


    /**
     * Toggle the completion status of a todo at the specified index.
     *
     * @param {number} index - The index of the todo to be toggled
     * @return {void}
     */
    const completeTodo = (index: number): void => {
        setTodos((prevTodos) => prevTodos.map((todo, i) => i === index ? {...todo, completed: !todo.completed} : todo));
    };

    /**
     * Edit a specific todo item.
     *
     * @param {number} index - The index of the todo item to edit
     * @return {void}
     */
    const editTodo = (index: number): void => {
        // Access the specific todo item using destructuring
        const {title, text} = todos[index] || {};

        // Set state values for editing
        setTodoTitle(title);
        setTodoBody(text);
        setEditingIndex(index);
        setEditing(true);
    };


    /**
     * Saves the edit for the specified todo item at the given index.
     *
     * @param {number} index - The index of the todo item to be edited
     * @return {void}
     */
    const saveEdit = (index: number): void => {
        setTodos((prevTodos) => prevTodos.map((todo, i) => i === index ? {
            ...todo, title: todoTitle, text: todoBody
        } : todo));
        // Reset state for new todo input
        setTodoTitle('');
        setTodoBody('');
        setEditingIndex(0);
        setEditing(false);
    };

    const removeCompleted = (): void => setTodos(todos.filter(todo => !todo.completed));

    const markAllComplete = (): void => setTodos(todos.map(todo => ({...todo, completed: true})));

    const markAllIncomplete = (): void => setTodos(todos.map(todo => ({...todo, completed: false})));

    /**
     * Fetches a list of todos asynchronously.
     *
     * Uses Axios to make a GET request to the provided URL (`http://127.0.0.1:8000/api/v1/todos`).
     *
     * - On success:
     *   - Logs the fetched data to the console.
     *   - Updates the `todos` state with the fetched data (`res.data.data`).
     * - On error:
     *   - Logs the error to the console.
     * - Finally (always executed):
     *   - Sets the `setLoading` state to `false` to indicate loading completion.
     *
     * @return {Promise<void>}
     */
    const fetchTodo = async (): Promise<void> => {
        try {
            const res = await axios.get('http://127.0.0.1:8000/api/v1/todos')
            console.log(res.data.data)
            setTodos(res.data.data);
        } catch (e) {
            console.log(e)
        } finally {
            setLoading(false);
        }
    }

    /**
     * Runs a side effect after the component mounts.
     *
     * Fetches todos using the `fetchTodo` function and then sets the `setLoading` state to `false`
     * to indicate that loading is complete.
     *
     * @return {function} Cleanup function to be executed when the component unmounts.
     */
    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        fetchTodo().then(r => setLoading(false))
    }, []);


    return (<>
        <div className={'container-custom shadow-lg border border-dark-subtle rounded-2'}>
            <div className={'p-2'}>
                <h3 className='text-center text-lexorange'>Todo List</h3>
            </div>
            <div className={'d-flex'}>
                {/* Left Side of the Panel */}
                <div
                    className={'w-50 d-flex flex-column justify-content-between border-end border-top border-dark-subtle p-2'}>
                    <Form onSubmit={handleFormSubmit}>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <div className={'d-flex gap-1'}>
                                <Form.Label className={'text-lexpurple'}>Todo Title</Form.Label>
                                <p className={'small fw-lighter text-lexlightpurple mb-0'}>(Required)</p>
                            </div>
                            <Form.Control className={'border-lexpurple'} value={todoTitle}
                                          onChange={(e) => setTodoTitle(e.target.value)} required
                                          type="text" placeholder="My Todo Title"/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <div className={'d-flex gap-1'}>
                                <Form.Label className={'text-lexpurple'}>Todo Description</Form.Label>
                                <p className={'small text-lexlightpurple mb-0'}>(Optional)</p>
                            </div>
                            <Form.Control className={'border-lexpurple'} value={todoBody}
                                          onChange={(e) => setTodoBody(e.target.value)}
                                          as="textarea"
                                          rows={4} placeholder='My Todo Description'/>
                        </Form.Group>
                        <div className='d-flex gap-2'>
                            <Button className={'btn-lexorange w-100'} disabled={isEditing} type='submit'>Add
                                Todo</Button>
                            {isEditing ? <Button className={'btn-lexpurple w-100'} type='button' variant='info'
                                                 onClick={() => saveEdit(Number(editingIndex))}>Save
                                Edit</Button> : null}
                        </div>
                    </Form>
                    <div className={'d-flex flex-column gap-2'}>
                        <Button className={'btn-outline-lexpurple w-100'} disabled={isEditing}
                                onClick={markAllComplete} variant={'outline-primary'}
                                type='button'>Mark all as Complete</Button>
                        <Button className={'btn-outline-lexpurple w-100'} disabled={isEditing}
                                onClick={markAllIncomplete} variant={'outline-primary'}
                                type='button'>Mark all as Incomplete</Button>
                        <Button className={'btn-outline-lexpurple'} disabled={isEditing}
                                onClick={removeCompleted} variant={'outline-primary'}
                                type='button'>Remove all Completed</Button>
                        <ConfirmModal Disabled={isEditing} ButtonName={'Remove all Todos'}
                                      ModalHeading={'Remove all Todos'}
                                      Onclick={() => setTodos([])}
                                      ModalBody={'Would you like to Remove all Todos?'}/>
                    </div>
                </div>

                {/* Right Side of the Panel */}
                <div className={'w-75 container-todo border-top border-dark-subtle p-2'}>
                    {todos.length === 0 ?
                        <div className={'h-100 d-flex justify-content-center align-items-center flex-column'}>
                            <img src={emptyLogo} alt="empty-task"/>
                            <h3 className={'text-lexpurple'}>Empty Todo</h3>
                        </div> : <div className={'d-flex flex-column gap-1'}>
                            {todos.map((todo, index) => (
                                <TodoItem key={index} index={index} todo={todo} removeTodo={removeTodo}
                                          editTodo={editTodo}
                                          completeTodo={completeTodo} isEditing={isEditing}/>))}
                        </div>}
                </div>
            </div>
        </div>
    </>)
}

export default App
