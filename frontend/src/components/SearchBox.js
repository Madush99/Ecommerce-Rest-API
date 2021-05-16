import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'

export const SearchBox = ({ history }) => {
    const [keyword, setKeyword] = useState('')

    const submitHandler = (e) => {
        e.preventDefault()
        if (keyword.trim()) {
            history.push(`/search/${keyword}`)
        } else {
            history.push('/')
        }
    }
    return (
        <Form onSubmit={submitHandler} inline>
            <Form.Control
                type='text'
                name='q'
                onChange={(e) => setKeyword(e.target.value)}
                placeholder='Search Products...'
                className='me-sm-2 ml-sm-5 hj'>

            </Form.Control>
            <Button type='submit' variant='outline-success' className='p-1.5 ng'>Search</Button>
        </Form>
    )
}

export default SearchBox
