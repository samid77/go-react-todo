import { useState } from 'react'
import {Box, List, ListItem, ThemeIcon} from '@mantine/core'
import useSWR from 'swr'
import {CheckCircleFillIcon, CheckCircleIcon} from '@primer/octicons-react'
import AddTodo from '../components/AddTodo'

export const ENDPOINT = 'http://localhost:4000'

export interface Todo {
  id: number
  title: string
  body: string
  done: boolean
}

const fetcher = (url:string) => 
  fetch(`${ENDPOINT}/${url}`).then((r) => r.json())

function App() {

  const {data, mutate} = useSWR<Todo[]>('api/todos', fetcher);

  const markTodoAsDone = async(id: number) => {
    const updated = await fetch(`${ENDPOINT}/api/todos/${id}/done`, {
      method: 'PATCH',
    }).then(res => res.json());
    mutate(updated)
  }

  return (
    <Box sx={(theme) => ({
      padding: '2rem',
      width: '100%',
      maxWidth:'400rem',
      margin: '0 auto',
      background:'white'
    })}>
      <List spacing='xs' size='sm' mb={12} center>
        {data?.map((todo) => {
          return (
            <List.Item 
              key={`todo_${todo.id}`}
              onClick={() => markTodoAsDone(todo.id)}
              icon={todo.done ? (<ThemeIcon color='teal' size={24} radius='xl'>
                <CheckCircleFillIcon />
              </ThemeIcon>): (
                <ThemeIcon color='gray' size={24} radius='xl'>
                  <CheckCircleIcon />
                </ThemeIcon>
              )}
            >
              {todo.title}
            </List.Item>
          )
        })}
      </List>
      <AddTodo mutate={mutate} />
    </Box>
    
  )
}

export default App
