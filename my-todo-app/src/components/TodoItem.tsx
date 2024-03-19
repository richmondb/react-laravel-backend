import Button from "react-bootstrap/Button";
import ItemConfirmModal from "./ItemConfirmModal.tsx";
import {TodoAPI} from "../interface/TodoAPI.ts";

function TodoItem({index, todo, removeTodo, completeTodo, editTodo, isEditing}: {
    index: number,
    isEditing: boolean,
    todo: TodoAPI,
    removeTodo: (index: number) => void,
    completeTodo: (index: number) => void,
    editTodo: (index: number) => void
}) {

    function prettifyTimestamp(timestamp: string): string {
        // Use the built-in Date object for compatibility
        const parsedDate = new Date(timestamp);

        // Format the date using toLocaleString() for flexibility
        return parsedDate.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            timeZoneName: 'short', // Include time zone abbreviation
        });
    }

    return (<div key={index} className={`p-2 bg-white border ${todo.completed ? 'border-lexpurple' : ''}  rounded-1`}
                 id='card-container'>
            <div className='d-flex justify-content-between align-items-center' id='card-title'>
                <h6 className={`text-lexpurple fw-semibold mb-0 ${todo.completed ? 'text-decoration-line-through opacity-75' : ''}`}>{todo.title}</h6>
                <div className='d-flex gap-2'>
                    <Button variant='outline-success' className={'btn-outline-lexorange'} size='sm' type='button' disabled={isEditing} onClick={() => completeTodo(index)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                             className="bi bi-check-square" viewBox="0 0 16 16">
                            <title>Mark as Complete</title>
                            <path
                                d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                            <path
                                d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/>
                        </svg>
                    </Button>
                    <Button variant={'outline-secondary'} className={'btn-outline-lexpurple'} size='sm' type='button' onClick={() => editTodo(index)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                             className="bi bi-pencil-square" viewBox="0 0 16 16">
                            <title>Edit Todo</title>
                            <path
                                d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                            <path fillRule="evenodd"
                                  d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                        </svg>
                    </Button>
                    <ItemConfirmModal Disabled={isEditing}
                                      ModalHeading={"Remove Todo"}
                                      ModalBody={"Would you like to Remove this Todo?"}
                                      Onclick={() => removeTodo(index)}/>
                </div>
            </div>
            <div id='card-body' className={'border-top mt-2'}>
                <p className={`w-100 py-1 ${todo.completed ? 'text-decoration-line-through opacity-75' : ''} text-lexpurple  text-break text-pretty mb-0`}>
                    {todo.text}
                </p>
            </div>
            <div className={'d-flex justify-content-end'}>
                <p className={'mb-0 small text-lexlightpurple text-opacity-75'}>Date
                    Created: {prettifyTimestamp(todo.created_at)}</p>
            </div>

        </div>);
}

export default TodoItem;