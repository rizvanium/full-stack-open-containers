const Todo = ({ todo, handleComplete, handleDelete }) => {
  const doneInfo = (
    <>
      <span>This todo is done</span>
      <span>
        <button onClick={() => handleDelete(todo)}> Delete </button>
      </span>
    </>
  )

  const notDoneInfo = (
    <>
      <span>
        This todo is not done
      </span>
      <span>
        <button onClick={() => handleDelete(todo)}> Delete </button>
        <button onClick={() => handleComplete(todo)}> Set as done </button>
      </span>
    </>
  )

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '70%', margin: 'auto' }}>
      <span>{todo.text}</span>
      {todo.done ? doneInfo : notDoneInfo}
    </div>
  )
}

export default Todo;